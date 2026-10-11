import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  VERSION,
  isPublicAsn,
  checkAsn,
  parseAsn,
  isPublicIp,
  checkIp,
  validPublicPrefix
} from '../dist/index.js';

test('version check', () => {
  assert.equal(VERSION, '1.4.1');
});

test('ASN validation', () => {
  const cases = [
    [0, false, 'RFC 6483'],
    [1, true, ''],
    [15169, true, ''],
    [23456, false, 'RFC 6793'],
    [64496, false, 'RFC 5398'],
    [64511, false, 'RFC 5398'],
    [64512, false, 'RFC 1930'],
    [65534, false, 'RFC 1930'],
    [65535, false, 'RFC 7300'],
    [65536, false, 'RFC 5398'],
    [65551, false, 'RFC 5398'],
    [65552, false, 'RFC 7249'],
    [131071, false, 'RFC 7249'],
    [131072, true, ''],
    [4199999999, true, ''],
    [4200000000, false, 'RFC 6996'],
    [4294967294, false, 'RFC 6996'],
    [4294967295, false, 'RFC 7300'],
  ];

  for (const [asn, wantPublic, rfc] of cases) {
    assert.equal(isPublicAsn(asn), wantPublic, `ASN ${asn} public mismatch`);
    const res = checkAsn(asn);
    assert.equal(res.isPublic, wantPublic, `ASN ${asn} checkAsn mismatch`);
    if (!wantPublic) {
      assert.ok(res.reason.includes(rfc), `ASN ${asn} expected reason with ${rfc}, got ${res.reason}`);
    }
  }
});

test('ASN parsing', () => {
  assert.equal(parseAsn(15169), 15169);
  assert.equal(parseAsn('15169'), 15169);
  assert.equal(parseAsn('AS15169'), 15169);
  assert.equal(parseAsn('as15169'), 15169);
  assert.equal(parseAsn('1.0'), 65536);
  assert.equal(parseAsn('1.1'), 65537);
  assert.equal(parseAsn('AS1.0'), 65536);

  assert.throws(() => parseAsn(''));
  assert.throws(() => parseAsn('ghost'));
  assert.throws(() => parseAsn('1.2.3'));
});

test('IP validation', () => {
  const cases = [
    // IPv4 Global Unicast
    ['1.1.1.1', true],
    ['8.8.8.8', true],
    ['192.0.1.1', true],
    // IPv4 Bogons
    ['0.0.0.1', false],
    ['127.0.0.1', false],
    ['10.1.2.3', false],
    ['172.16.1.1', false],
    ['172.31.255.255', false],
    ['192.168.1.1', false],
    ['100.64.0.1', false],
    ['169.254.1.1', false],
    ['192.0.0.1', false],
    ['192.0.2.1', false],
    ['198.51.100.1', false],
    ['203.0.113.1', false],
    ['198.18.0.1', false],
    ['198.19.255.255', false],
    ['224.0.0.1', false],
    ['240.0.0.1', false],
    ['255.255.255.255', false],
    ['192.88.99.1', false],
    ['192.31.196.1', false],
    ['192.52.193.1', false],
    ['192.0.0.170', false],
    ['192.0.0.9', false],
    // IPv6 Global Unicast
    ['2600::', true],
    ['2001:4860:4860::8888', true],
    ['3fff::1', true],
    // IPv6 Bogons
    ['::1', false],
    ['::', false],
    ['fe80::1', false],
    ['fc00::1', false],
    ['fd00::1', false],
    ['2001::1', false],
    ['2001:1:2::3', false],
    ['2001:10::1', false],
    ['2001:2::1', false],
    ['2001:db8::1', false],
    ['2002::1', false],
    ['100::1', false],
    ['64:ff9b::1', false],
    ['64:ff9b:1::1', false],
    ['3ffe::1', false],
    ['ff02::1', false],
    ['2620:4f:8000::1', false],
    ['2001:30::1', false],
    ['2001:3::1', false],
    ['4000::1', false],
    // Mapped IPv6
    ['::ffff:1.2.3.4', true],
    ['::ffff:10.0.0.1', false],
  ];

  for (const [ip, wantPublic] of cases) {
    assert.equal(isPublicIp(ip), wantPublic, `IP ${ip} mismatch`);
  }

  // Malformed IP strings
  assert.equal(isPublicIp(''), false);
  assert.equal(isPublicIp('ghost'), false);
  assert.equal(isPublicIp('1.1.1.1.1'), false);
  assert.equal(isPublicIp(':::'), false);
  assert.equal(isPublicIp('2001:db8::z'), false);
});

test('BGP prefix validation', () => {
  // Valid IPv4
  assert.equal(validPublicPrefix('8.8.8.0/24'), true);
  assert.equal(validPublicPrefix('1.1.1.0/24'), true);
  assert.equal(validPublicPrefix('12.0.0.0/8'), true);

  // Invalid IPv4
  assert.equal(validPublicPrefix('8.8.8.8/32'), false);
  assert.equal(validPublicPrefix('8.0.0.0/7'), false);
  assert.equal(validPublicPrefix('10.0.0.0/8'), false);
  assert.equal(validPublicPrefix('8.8.8.1/24'), false);

  // Valid IPv6
  assert.equal(validPublicPrefix('2600::/16'), true);
  assert.equal(validPublicPrefix('2001:4860::/32'), true);
  assert.equal(validPublicPrefix('2a0d:1a40::/32'), true);
  assert.equal(validPublicPrefix('2001:4860:4860::/48'), true);

  // Invalid IPv6
  assert.equal(validPublicPrefix('2600::/15'), false);
  assert.equal(validPublicPrefix('2600::/64'), false);
  assert.equal(validPublicPrefix('2001:db8::/32'), false);
  assert.equal(validPublicPrefix('2001:4860::1/32'), false);
});
