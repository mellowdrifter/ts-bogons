/**
 * bogons v1.4.1
 * Lean, high-performance, zero-dependency IP and ASN bogon validation library.
 */

export const VERSION: string;

export interface CheckResult {
  isPublic: boolean;
  reason: string;
}

/**
 * Checks whether an ASN is valid and publicly routable.
 * Supports numbers (15169), strings ("15169", "AS15169"), and asdot notation ("1.0").
 */
export function checkAsn(asn: number | string): CheckResult;

/**
 * Reports whether an ASN is valid and publicly routable.
 */
export function isPublicAsn(asn: number | string): boolean;

/**
 * Parses an ASN from a string or number into a 32-bit integer.
 * Throws an Error on invalid syntax or out-of-range value.
 */
export function parseAsn(asn: number | string): number;

/**
 * Checks whether an IPv4 address is publicly routable.
 */
export function checkIpv4(ip: string | number): CheckResult;

/**
 * Reports whether an IPv4 address is publicly routable.
 */
export function isPublicIpv4(ip: string | number): boolean;

/**
 * Checks whether an IPv6 address is publicly routable.
 * Automatically unmaps IPv4-mapped IPv6 addresses (::ffff:x.x.x.x).
 */
export function checkIpv6(ip: string): CheckResult;

/**
 * Reports whether an IPv6 address is publicly routable.
 */
export function isPublicIpv6(ip: string): boolean;

/**
 * Checks whether an IP address (IPv4 or IPv6) is publicly routable.
 */
export function checkIp(ip: string): CheckResult;

/**
 * Reports whether an IP address is publicly routable.
 */
export function isPublicIp(ip: string): boolean;

/**
 * Validates a CIDR prefix string for BGP announcement:
 * - IPv4: prefix length between /8 and /24, no host bits set, not a bogon.
 * - IPv6: prefix length between /16 and /48, no host bits set, not a bogon.
 */
export function validPublicPrefix(cidr: string): boolean;
