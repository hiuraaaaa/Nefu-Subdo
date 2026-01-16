import { describe, it, expect } from "vitest";
import {
  detectRecordType,
  validateSubdomain,
  validateTarget,
  validateRecordType,
  buildRecordName,
  buildErrorResponse,
  buildSuccessResponse,
} from "./dns-utils";

describe("DNS Utils", () => {
  describe("detectRecordType", () => {
    it("should detect A record for IPv4 address", () => {
      expect(detectRecordType("192.168.1.1")).toBe("A");
      expect(detectRecordType("10.0.0.1")).toBe("A");
      expect(detectRecordType("255.255.255.255")).toBe("A");
    });

    it("should detect CNAME record for hostname", () => {
      expect(detectRecordType("example.com")).toBe("CNAME");
      expect(detectRecordType("api.example.com")).toBe("CNAME");
      expect(detectRecordType("subdomain.domain.co.uk")).toBe("CNAME");
    });
  });

  describe("validateSubdomain", () => {
    it("should validate correct subdomain names", () => {
      expect(validateSubdomain("api")).toBe(true);
      expect(validateSubdomain("www")).toBe(true);
      expect(validateSubdomain("mail")).toBe(true);
      expect(validateSubdomain("api-v2")).toBe(true);
      expect(validateSubdomain("test123")).toBe(true);
    });

    it("should reject invalid subdomain names", () => {
      expect(validateSubdomain("-api")).toBe(false);
      expect(validateSubdomain("api-")).toBe(false);
      expect(validateSubdomain("api_test")).toBe(false);
      expect(validateSubdomain("api.test")).toBe(false);
      expect(validateSubdomain("")).toBe(false);
    });
  });

  describe("validateTarget", () => {
    it("should validate IPv4 addresses", () => {
      expect(validateTarget("192.168.1.1")).toBe(true);
      expect(validateTarget("10.0.0.1")).toBe(true);
      expect(validateTarget("255.255.255.255")).toBe(true);
    });

    it("should validate hostnames", () => {
      expect(validateTarget("example.com")).toBe(true);
      expect(validateTarget("api.example.com")).toBe(true);
      expect(validateTarget("subdomain.domain.co.uk")).toBe(true);
    });

    it("should reject empty targets", () => {
      expect(validateTarget("")).toBe(false);
    });
  });

  describe("validateRecordType", () => {
    it("should validate supported record types", () => {
      expect(validateRecordType("A")).toBe(true);
      expect(validateRecordType("CNAME")).toBe(true);
      expect(validateRecordType("TXT")).toBe(true);
      expect(validateRecordType("MX")).toBe(true);
      expect(validateRecordType("NS")).toBe(true);
    });

    it("should reject unsupported record types", () => {
      expect(validateRecordType("AAAA")).toBe(false);
      expect(validateRecordType("SOA")).toBe(false);
      expect(validateRecordType("invalid")).toBe(false);
    });
  });

  describe("buildRecordName", () => {
    it("should build correct record names", () => {
      expect(buildRecordName("api", "example.com")).toBe("api.example.com");
      expect(buildRecordName("www", "nepuh.web.id")).toBe("www.nepuh.web.id");
      expect(buildRecordName("mail", "domain.co.uk")).toBe("mail.domain.co.uk");
    });

    it("should handle single character subdomains", () => {
      expect(buildRecordName("a", "example.com")).toBe("a.example.com");
    });
  });

  describe("buildErrorResponse", () => {
    it("should build error response with message", () => {
      const response = buildErrorResponse("Test error");
      expect(response.success).toBe(false);
      expect(response.error).toBe("Test error");
      expect(response.details).toEqual({});
    });

    it("should build error response with details", () => {
      const details = { field: "subdomain", reason: "invalid" };
      const response = buildErrorResponse("Test error", details);
      expect(response.success).toBe(false);
      expect(response.error).toBe("Test error");
      expect(response.details).toEqual(details);
    });
  });

  describe("buildSuccessResponse", () => {
    it("should build success response with data", () => {
      const data = { id: "123", name: "test" };
      const response = buildSuccessResponse(data);
      expect(response.success).toBe(true);
      expect(response.data).toEqual(data);
    });

    it("should build success response with nested data", () => {
      const data = {
        record: { id: "123", type: "A", name: "api.example.com" },
        message: "DNS record created",
      };
      const response = buildSuccessResponse(data);
      expect(response.success).toBe(true);
      expect(response.data).toEqual(data);
    });
  });
});
