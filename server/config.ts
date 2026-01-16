/**
 * Configuration for Cloudflare DNS Management
 * Edit this file to add or remove domains
 */

export interface DomainConfig {
  name: string;
  zoneId: string;
  description?: string;
}

/**
 * List of domains that can be managed through this application
 * Add new domains here with their Cloudflare Zone ID
 * 
 * Example:
 * {
 *   name: "example.com",
 *   zoneId: "your-zone-id-from-cloudflare",
 *   description: "Main domain"
 * }
 */
export const LIST_DOMAIN: DomainConfig[] = [
  {
    name: "nepuh.web.id",
    zoneId: process.env.CF_ZONE_ID_1 || "",
    description: "Primary domain",
  },
  // Add more domains here as needed
  // {
  //   name: "example.com",
  //   zoneId: process.env.CF_ZONE_ID_2 || "",
  //   description: "Secondary domain",
  // },
];

/**
 * Maintenance mode configuration
 * Set to true to enable maintenance mode and block all DNS operations
 */
export const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true";

/**
 * Cloudflare API Configuration
 */
export const CLOUDFLARE_API_TOKEN = process.env.CF_API_TOKEN || "";
export const CLOUDFLARE_API_BASE_URL = "https://api.cloudflare.com/client/v4";

/**
 * DNS Record Configuration
 */
export const DNS_RECORD_CONFIG = {
  ttl: 1, // Automatic TTL
  proxied: false, // DNS only, not proxied through Cloudflare
};

/**
 * Supported DNS Record Types
 */
export const SUPPORTED_RECORD_TYPES = ["A", "CNAME", "TXT", "MX", "NS"] as const;
export type RecordType = (typeof SUPPORTED_RECORD_TYPES)[number];

/**
 * Validation patterns
 */
export const VALIDATION_PATTERNS = {
  // IPv4 pattern
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  // Subdomain pattern (alphanumeric and hyphens)
  subdomain: /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/,
  // Hostname pattern (domain name)
  hostname: /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.?$/,
};
