/**
 * bogons v1.4.1 (CommonJS build)
 */

const VERSION = "1.4.1";

function v4Mask(bits) {
  if (bits === 0) return 0;
  if (bits >= 32) return 0xFFFFFFFF >>> 0;
  return (~((1 << (32 - bits)) - 1)) >>> 0;
}

const V4_RULES = [
  { net: 0x00000000 >>> 0, mask: v4Mask(8), reason: "RFC 1122 (This Host on This Network)" },
  { net: 0x0A000000 >>> 0, mask: v4Mask(8), reason: "RFC 1918 (Private-Use)" },
  { net: 0x64400000 >>> 0, mask: v4Mask(10), reason: "RFC 6598 (Shared Address Space / CGNAT)" },
  { net: 0x7F000000 >>> 0, mask: v4Mask(8), reason: "RFC 1122 (Loopback)" },
  { net: 0xA9FE0000 >>> 0, mask: v4Mask(16), reason: "RFC 3927 (Link-Local)" },
  { net: 0xAC100000 >>> 0, mask: v4Mask(12), reason: "RFC 1918 (Private-Use)" },
  { net: 0xC00000AA >>> 0, mask: v4Mask(31), reason: "RFC 8880 (NAT64/DNS64 Discovery)" },
  { net: 0xC000000A >>> 0, mask: v4Mask(32), reason: "RFC 8155 (TURN Anycast)" },
  { net: 0xC0000009 >>> 0, mask: v4Mask(32), reason: "RFC 7725 (PCP Anycast)" },
  { net: 0xC0000008 >>> 0, mask: v4Mask(32), reason: "RFC 7600 (IPv4 Dummy Address)" },
  { net: 0xC0000000 >>> 0, mask: v4Mask(29), reason: "RFC 6333 / RFC 7335 (DS-Lite / Dual-Stack Continuity)" },
  { net: 0xC0000000 >>> 0, mask: v4Mask(24), reason: "RFC 6890 (IETF Protocol Assignments)" },
  { net: 0xC0000200 >>> 0, mask: v4Mask(24), reason: "RFC 5737 (Documentation TEST-NET-1)" },
  { net: 0xC01FC400 >>> 0, mask: v4Mask(24), reason: "RFC 7535 (AS112-v4)" },
  { net: 0xC034C100 >>> 0, mask: v4Mask(24), reason: "RFC 7450 (Automatic Multicast Tunneling - AMT)" },
  { net: 0xC0586300 >>> 0, mask: v4Mask(24), reason: "RFC 7526 (6to4 Relay Anycast - Deprecated)" },
  { net: 0xC0A80000 >>> 0, mask: v4Mask(16), reason: "RFC 1918 (Private-Use)" },
  { net: 0xC6120000 >>> 0, mask: v4Mask(15), reason: "RFC 2544 (Benchmarking)" },
  { net: 0xC6336400 >>> 0, mask: v4Mask(24), reason: "RFC 5737 (Documentation TEST-NET-2)" },
  { net: 0xCB007100 >>> 0, mask: v4Mask(24), reason: "RFC 5737 (Documentation TEST-NET-3)" },
  { net: 0xE0000000 >>> 0, mask: v4Mask(4), reason: "RFC 1112 (Multicast)" },
  { net: 0xFFFFFFFF >>> 0, mask: v4Mask(32), reason: "RFC 919 / RFC 8190 (Limited Broadcast)" },
  { net: 0xF0000000 >>> 0, mask: v4Mask(4), reason: "RFC 1112 (Reserved / Former Class E)" },
];

function v6MaskBig(bits) {
  if (bits === 0) return 0n;
  const shift = BigInt(128 - bits);
  return ((1n << 128n) - 1n) ^ ((1n << shift) - 1n);
}

const V6_RULES = [
  // 2001:db8::/32
  { net: 0x20010db8n << 96n, mask: v6MaskBig(32), reason: "RFC 3849 (Documentation)" },
  // 2001::/32
  { net: 0x20010000n << 96n, mask: v6MaskBig(32), reason: "RFC 4380 (Teredo)" },
  // 2001:1::1/128
  { net: (0x20010001n << 96n) | 1n, mask: v6MaskBig(128), reason: "RFC 7723 (PCP Anycast)" },
  // 2001:1::2/128
  { net: (0x20010001n << 96n) | 2n, mask: v6MaskBig(128), reason: "RFC 8155 (TURN Anycast)" },
  // 2001:2::/48
  { net: 0x200100020000n << 80n, mask: v6MaskBig(48), reason: "RFC 5180 / RFC 9006 (Benchmarking)" },
  // 2001:3::/32
  { net: 0x20010003n << 96n, mask: v6MaskBig(32), reason: "RFC 7450 (Automatic Multicast Tunneling - AMT)" },
  // 2001:4:112::/48
  { net: 0x200100040112n << 80n, mask: v6MaskBig(48), reason: "RFC 7535 (AS112-v6)" },
  // 2001:10::/28
  { net: 0x20010010n << 96n, mask: v6MaskBig(28), reason: "RFC 4843 (Deprecated ORCHID)" },
  // 2001:20::/28
  { net: 0x20010020n << 96n, mask: v6MaskBig(28), reason: "RFC 7343 (ORCHIDv2)" },
  // 2001:30::/28
  { net: 0x20010030n << 96n, mask: v6MaskBig(28), reason: "RFC 9385 (Drone Remote ID)" },
  // 2001::/23
  { net: 0x20010000n << 96n, mask: v6MaskBig(23), reason: "RFC 2928 (IETF Protocol Assignments)" },
  // 2002::/16
  { net: 0x2002n << 112n, mask: v6MaskBig(16), reason: "RFC 3056 / RFC 7526 (6to4 - Deprecated)" },
  // 2620:4f:8000::/48
  { net: 0x2620004f8000n << 80n, mask: v6MaskBig(48), reason: "RFC 7534 (Direct Delegation AS112)" },
  // 64:ff9b:1::/48
  { net: 0x0064ff9b0001n << 80n, mask: v6MaskBig(48), reason: "RFC 8215 (Local-Use IPv4/IPv6 Translation)" },
  // 64:ff9b::/96
  { net: 0x0064ff9b0000000000000000n << 32n, mask: v6MaskBig(96), reason: "RFC 6052 (IPv4/IPv6 Translation)" },
  // 100::/64
  { net: 0x0100n << 112n, mask: v6MaskBig(64), reason: "RFC 6666 (Discard-Only)" },
  // 3ffe::/16
  { net: 0x3ffen << 112n, mask: v6MaskBig(16), reason: "RFC 3701 (6bone - Deprecated / Returned)" },
];

const AS_RULES = [
  { start: 0, end: 0, reason: "RFC 6483 / RFC 7607 (Reserved ASN 0)" },
  { start: 23456, end: 23456, reason: "RFC 6793 (AS_TRANS 4-Byte Transition)" },
  { start: 64496, end: 64511, reason: "RFC 5398 (Documentation 16-bit)" },
  { start: 64512, end: 65534, reason: "RFC 1930 / RFC 6996 (Private-Use 16-bit)" },
  { start: 65535, end: 65535, reason: "RFC 7300 (Reserved 16-bit Last ASN)" },
  { start: 65536, end: 65551, reason: "RFC 5398 (Documentation 32-bit)" },
  { start: 65552, end: 131071, reason: "RFC 7249 / IANA (Reserved 32-bit)" },
  { start: 4200000000, end: 4294967294, reason: "RFC 6996 (Private-Use 32-bit)" },
  { start: 4294967295, end: 4294967295, reason: "RFC 7300 (Reserved 32-bit Last ASN)" },
];

function parseAsn(asn) {
  if (typeof asn === "number") {
    if (!Number.isInteger(asn) || asn < 0 || asn > 4294967295) {
      throw new Error("ASN out of 32-bit range");
    }
    return asn;
  }
  if (typeof asn !== "string") {
    throw new Error("Invalid ASN type");
  }

  let s = asn.trim();
  if (s.toUpperCase().startsWith("AS")) {
    s = s.slice(2);
  }
  if (!s) {
    throw new Error("Empty ASN string");
  }

  if (s.includes(".")) {
    const parts = s.split(".");
    if (parts.length !== 2) throw new Error("Invalid asdot syntax");
    const high = Number(parts[0]);
    const low = Number(parts[1]);
    if (!Number.isInteger(high) || !Number.isInteger(low) || high < 0 || high > 65535 || low < 0 || low > 65535) {
      throw new Error("Invalid asdot values");
    }
    return (high << 16) | low;
  }

  const num = Number(s);
  if (!Number.isInteger(num) || num < 0 || num > 4294967295) {
    throw new Error("Invalid ASN syntax");
  }
  return num;
}

function checkAsn(asn) {
  let val;
  try {
    val = parseAsn(asn);
  } catch (err) {
    return { isPublic: false, reason: "Invalid ASN syntax" };
  }

  for (const rule of AS_RULES) {
    if (val >= rule.start && val <= rule.end) {
      return { isPublic: false, reason: rule.reason };
    }
  }
  return { isPublic: true, reason: "" };
}

function isPublicAsn(asn) {
  return checkAsn(asn).isPublic;
}

function parseIpv4ToUint32(s) {
  if (typeof s !== "string") return null;
  const parts = s.trim().split(".");
  if (parts.length !== 4) return null;
  let num = 0;
  for (let i = 0; i < 4; i++) {
    const part = parts[i];
    if (!/^\d+$/.test(part)) return null;
    const n = Number(part);
    if (n < 0 || n > 255) return null;
    num = (num << 8) | n;
  }
  return num >>> 0;
}

function checkIpv4(ip) {
  let num;
  if (typeof ip === "number") {
    num = ip >>> 0;
  } else {
    num = parseIpv4ToUint32(ip);
    if (num === null) {
      return { isPublic: false, reason: "Invalid IPv4 address syntax" };
    }
  }

  for (const rule of V4_RULES) {
    if (((num & rule.mask) >>> 0) === rule.net) {
      return { isPublic: false, reason: rule.reason };
    }
  }

  return { isPublic: true, reason: "" };
}

function isPublicIpv4(ip) {
  return checkIpv4(ip).isPublic;
}

function parseIpv6ToBigInt(s) {
  if (typeof s !== "string") return null;
  s = s.trim();
  if (!s) return null;

  if (s.includes(".")) {
    const lastColon = s.lastIndexOf(":");
    if (lastColon === -1) return null;
    const v4Part = s.slice(lastColon + 1);
    const v4Num = parseIpv4ToUint32(v4Part);
    if (v4Num === null) return null;
    const high = (v4Num >>> 16) & 0xffff;
    const low = v4Num & 0xffff;
    s = s.slice(0, lastColon) + ":" + high.toString(16) + ":" + low.toString(16);
  }

  const doubleColonParts = s.split("::");
  if (doubleColonParts.length > 2) return null;

  let blocks = [];
  if (doubleColonParts.length === 2) {
    const left = doubleColonParts[0] ? doubleColonParts[0].split(":") : [];
    const right = doubleColonParts[1] ? doubleColonParts[1].split(":") : [];
    const missing = 8 - (left.length + right.length);
    if (missing < 0) return null;
    blocks = [...left, ...new Array(missing).fill("0"), ...right];
  } else {
    blocks = s.split(":");
    if (blocks.length !== 8) return null;
  }

  let val = 0n;
  for (const b of blocks) {
    if (!/^[0-9a-fA-F]{1,4}$/.test(b)) return null;
    val = (val << 16n) | BigInt(parseInt(b, 16));
  }
  return val;
}

function checkIpv6(ip) {
  const num = parseIpv6ToBigInt(ip);
  if (num === null) {
    return { isPublic: false, reason: "Invalid IPv6 address syntax" };
  }

  if ((num >> 32n) === 0xffffn) {
    const v4 = Number(num & 0xffffffffn);
    return checkIpv4(v4);
  }

  for (const rule of V6_RULES) {
    if ((num & rule.mask) === rule.net) {
      return { isPublic: false, reason: rule.reason };
    }
  }

  if (num === 1n) return { isPublic: false, reason: "RFC 4291 (Loopback)" };
  if (num === 0n) return { isPublic: false, reason: "RFC 4291 (Unspecified)" };
  if ((num >> 118n) === 0x3fan) return { isPublic: false, reason: "RFC 4291 (Link-Local)" };
  if ((num >> 121n) === 0x7en) return { isPublic: false, reason: "RFC 4193 (Unique Local Address / ULA)" };
  if ((num >> 120n) === 0xffn) return { isPublic: false, reason: "RFC 4291 (Multicast)" };

  const topByte = Number(num >> 120n);
  if (topByte < 0x20 || topByte > 0x3f) {
    return { isPublic: false, reason: "RFC 4291 (IANA Unallocated / Outside 2000::/3 Global Unicast)" };
  }

  return { isPublic: true, reason: "" };
}

function isPublicIpv6(ip) {
  return checkIpv6(ip).isPublic;
}

function checkIp(ip) {
  if (typeof ip !== "string") {
    return { isPublic: false, reason: "Invalid IP address syntax" };
  }
  if (ip.includes(":")) {
    return checkIpv6(ip);
  }
  return checkIpv4(ip);
}

function isPublicIp(ip) {
  return checkIp(ip).isPublic;
}

function validPublicPrefix(cidr) {
  if (typeof cidr !== "string") return false;
  const parts = cidr.trim().split("/");
  if (parts.length !== 2) return false;

  const len = Number(parts[1]);
  if (!Number.isInteger(len) || len < 0) return false;

  if (parts[0].includes(":")) {
    if (len < 16 || len > 48) return false;
    const num = parseIpv6ToBigInt(parts[0]);
    if (num === null) return false;

    if ((num >> 32n) === 0xffffn) {
      const v4 = Number(num & 0xffffffffn);
      const v4Len = len >= 96 ? len - 96 : len;
      if (v4Len < 8 || v4Len > 24) return false;
      const mask = v4Mask(v4Len);
      if (((v4 & mask) >>> 0) !== v4) return false;
      return isPublicIpv4(v4);
    }

    const mask = v6MaskBig(len);
    if ((num & mask) !== num) return false;
    return isPublicIpv6(parts[0]);
  } else {
    if (len < 8 || len > 24) return false;
    const num = parseIpv4ToUint32(parts[0]);
    if (num === null) return false;
    const mask = v4Mask(len);
    if (((num & mask) >>> 0) !== num) return false;
    return isPublicIpv4(num);
  }
}

module.exports = {
  VERSION,
  parseAsn,
  checkAsn,
  isPublicAsn,
  checkIpv4,
  isPublicIpv4,
  checkIpv6,
  isPublicIpv6,
  checkIp,
  isPublicIp,
  validPublicPrefix,
};
