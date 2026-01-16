import { VALIDATION_PATTERNS, RecordType } from "./config";

/**
 * Detect record type based on target value
 * - If target is an IPv4 address, return "A"
 * - Otherwise, assume it's a hostname and return "CNAME"
 */
export function detectRecordType(target: string): RecordType {
  if (VALIDATION_PATTERNS.ipv4.test(target)) {
    return "A";
  }
  return "CNAME";
}

/**
 * Validate subdomain name
 */
export function validateSubdomain(subdomain: string): boolean {
  return VALIDATION_PATTERNS.subdomain.test(subdomain);
}

/**
 * Validate target (IP or hostname)
 */
export function validateTarget(target: string): boolean {
  return (
    VALIDATION_PATTERNS.ipv4.test(target) ||
    VALIDATION_PATTERNS.hostname.test(target)
  );
}

/**
 * Validate record type
 */
export function validateRecordType(type: string): type is RecordType {
  return ["A", "CNAME", "TXT", "MX", "NS"].includes(type);
}

/**
 * Build the full DNS record name (subdomain.domain.com)
 */
export function buildRecordName(subdomain: string, domain: string): string {
  return `${subdomain}.${domain}`;
}

/**
 * Error response builder
 */
export function buildErrorResponse(
  message: string,
  details?: Record<string, unknown>
) {
  return {
    success: false,
    error: message,
    details: details || {},
  };
}

/**
 * Success response builder
 */
export function buildSuccessResponse(data: Record<string, unknown>) {
  return {
    success: true,
    data,
  };
}
