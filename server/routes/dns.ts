import { Router, Request, Response } from "express";
import { LIST_DOMAIN, MAINTENANCE_MODE, CLOUDFLARE_API_TOKEN, CLOUDFLARE_API_BASE_URL, DNS_RECORD_CONFIG } from "../config";
import { detectRecordType, validateSubdomain, validateTarget, validateRecordType, buildRecordName, buildErrorResponse, buildSuccessResponse } from "../dns-utils";

const router = Router();

router.get("/domains", (req: Request, res: Response) => {
  try {
    const domains = LIST_DOMAIN.filter(d => d.zoneId).map(d => ({
      name: d.name,
      description: d.description,
    }));

    res.json({
      success: true,
      domains,
    });
  } catch (error) {
    console.error("Error fetching domains:", error);
    res.status(500).json(buildErrorResponse("Failed to fetch domains"));
  }
});

router.post("/create-dns", async (req: Request, res: Response) => {
  try {
    if (MAINTENANCE_MODE) {
      return res.status(503).json(buildErrorResponse("Service is under maintenance"));
    }

    const { domain, subdomain, recordType: userRecordType, target } = req.body;

    if (!domain || !subdomain || !target) {
      return res.status(400).json(buildErrorResponse("Missing required fields"));
    }

    if (!validateSubdomain(subdomain)) {
      return res.status(400).json(buildErrorResponse("Invalid subdomain name"));
    }

    if (!validateTarget(target)) {
      return res.status(400).json(buildErrorResponse("Invalid target (IP or hostname)"));
    }

    const domainConfig = LIST_DOMAIN.find(d => d.name === domain);
    if (!domainConfig || !domainConfig.zoneId) {
      return res.status(400).json(buildErrorResponse("Domain not found or not configured"));
    }

    let recordType = userRecordType;
    if (!recordType) {
      recordType = detectRecordType(target);
    } else if (!validateRecordType(recordType)) {
      return res.status(400).json(buildErrorResponse("Invalid record type"));
    }

    if (!CLOUDFLARE_API_TOKEN) {
      return res.status(500).json(buildErrorResponse("Cloudflare API token not configured"));
    }

    const recordName = buildRecordName(subdomain, domain);
    const cloudflareUrl = `${CLOUDFLARE_API_BASE_URL}/zones/${domainConfig.zoneId}/dns_records`;

    const response = await fetch(cloudflareUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: recordType,
        name: recordName,
        content: target,
        ttl: DNS_RECORD_CONFIG.ttl,
        proxied: DNS_RECORD_CONFIG.proxied,
      }),
    });

    const cloudflareData = await response.json();

    if (!response.ok) {
      console.error("Cloudflare API error:", cloudflareData);
      const errorMessage = cloudflareData.errors?.[0]?.message || "Failed to create DNS record";
      return res.status(response.status).json(buildErrorResponse(errorMessage));
    }

    res.json(buildSuccessResponse({
      record: cloudflareData.result,
      message: `DNS record created successfully: ${recordName}`,
    }));
  } catch (error) {
    console.error("Error creating DNS record:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    res.status(500).json(buildErrorResponse(errorMessage));
  }
});

export default router;
