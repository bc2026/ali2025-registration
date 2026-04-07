#!/usr/bin/env node
/**
 * Load data/20260304_NJ_8.xlsx (or XLSX_PATH) into PostgreSQL via Prisma.
 * Requires DATABASE_URL and applied migrations (`npx prisma migrate deploy`).
 *
 *   DATABASE_URL=postgresql://... node scripts/import-nj-xlsx.js
 *   XLSX_PATH=data/other.xlsx SHEET_NAME="NJ 8 Voter Rolls" node scripts/import-nj-xlsx.js
 */
const path = require('path');
const XLSX = require('xlsx');
const { prisma } = require('../lib/prisma');
const { normalizeFirstLast, normalizeZip } = require('../lib/voter-normalize');

const ROOT = path.join(__dirname, '..');
const XLSX_PATH = process.env.XLSX_PATH || path.join(ROOT, 'data', '20260304_NJ_8.xlsx');
const SHEET_NAME = process.env.SHEET_NAME || 'NJ 8 Voter Rolls';
const BATCH = Number(process.env.IMPORT_BATCH_SIZE || 2500);

function toDate(value) {
  if (value == null || value === '') return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

function rowToRecord(row) {
  const displayId = row.displayId != null ? String(row.displayId).trim() : '';
  if (!displayId) return null;

  const first = String(row.first ?? '').trim();
  const last = String(row.last ?? '').trim();
  if (!first || !last) return null;

  const zip = normalizeZip(row.zip);

  let legId = null;
  if (row.leg_id != null && row.leg_id !== '') {
    try {
      const raw = String(row.leg_id).replace(/\D/g, '');
      if (raw) legId = BigInt(raw);
    } catch {
      legId = null;
    }
  }

  let streetNum = null;
  if (row.street_num != null && row.street_num !== '') {
    const n = parseInt(String(row.street_num).replace(/\D/g, ''), 10);
    streetNum = Number.isFinite(n) ? n : null;
  }

  let congressional = null;
  if (row.congressional != null && row.congressional !== '') {
    const c = parseInt(String(row.congressional), 10);
    congressional = Number.isFinite(c) ? c : null;
  }

  return {
    displayId,
    legId,
    party: row.party != null ? String(row.party) : null,
    status: row.status != null ? String(row.status) : null,
    regDate: toDate(row.reg_date),
    dob: null,
    lastName: last,
    firstName: first,
    middle: row.middle != null ? String(row.middle) : null,
    suffix: row.suffix != null ? String(row.suffix) : null,
    streetNum,
    streetPre: row.street_pre != null ? String(row.street_pre) : null,
    streetPost: row.street_post != null ? String(row.street_post) : null,
    streetBase: row.street_base != null ? String(row.street_base) : null,
    streetSuff: row.street_suff != null ? String(row.street_suff) : null,
    streetName: row.street_name != null ? String(row.street_name) : null,
    aptUnit: row.apt_unit != null ? String(row.apt_unit) : null,
    city: row.city != null ? String(row.city) : null,
    address: row.address != null ? String(row.address) : null,
    zip,
    county: row.county != null ? String(row.county) : null,
    congressional,
    firstNormalized: normalizeFirstLast(first),
    lastNormalized: normalizeFirstLast(last),
  };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('Set DATABASE_URL (e.g. postgresql://admin:pass@localhost:5432/voter_db)');
    process.exit(1);
  }

  console.log('Reading', XLSX_PATH);
  const wb = XLSX.readFile(XLSX_PATH, { cellDates: true, dense: true });
  const sheet = wb.Sheets[SHEET_NAME];
  if (!sheet) {
    console.error('Sheet not found:', SHEET_NAME, 'available:', wb.SheetNames.join(', '));
    process.exit(1);
  }

  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
  console.log('Rows:', rows.length);

  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const slice = rows.slice(i, i + BATCH);
    const data = [];
    for (const r of slice) {
      const rec = rowToRecord(r);
      if (rec) data.push(rec);
    }
    if (!data.length) continue;
    const res = await prisma.njVoterRoll.createMany({ data, skipDuplicates: true });
    inserted += res.count;
    console.log(`… ${Math.min(i + BATCH, rows.length)} / ${rows.length} (+${res.count} new in batch)`);
  }

  const total = await prisma.njVoterRoll.count();
  console.log('Done. createMany inserted (new rows this run):', inserted, '| total in table:', total);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
