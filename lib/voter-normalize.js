/** Match keys used for voter roll lookup (aligned with form + xlsx import). */

function normalizeFirstLast(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/\s/g, '');
}

/** ZIP: digits only, last 5 zero-padded (NJ-style exports may omit leading 0). */
function normalizeZip(z) {
  const d = String(z ?? '').replace(/\D/g, '');
  if (!d) return '00000';
  const tail = d.slice(-5);
  return tail.padStart(5, '0');
}

module.exports = { normalizeFirstLast, normalizeZip };
