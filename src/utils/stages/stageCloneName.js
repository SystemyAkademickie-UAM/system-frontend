/**
 * Buduje domyślną nazwę sklonowanego etapu: „Kopia (nazwa)”, „Kopia 2 (nazwa)” itd.
 * @param {string} sourceName
 * @param {string[]} existingNames
 * @returns {string}
 */
export function buildStageCloneName(sourceName, existingNames = []) {
  const base = sourceName.trim();
  let maxCopyNumber = 0;

  for (const name of existingNames) {
    const trimmed = name.trim();
    const match = trimmed.match(/^Kopia(?: (\d+))? \((.+)\)$/);
    if (!match || match[2] !== base) {
      continue;
    }
    const copyNumber = match[1] ? Number.parseInt(match[1], 10) : 1;
    if (Number.isFinite(copyNumber)) {
      maxCopyNumber = Math.max(maxCopyNumber, copyNumber);
    }
  }

  const nextNumber = maxCopyNumber + 1;
  return nextNumber === 1 ? `Kopia (${base})` : `Kopia ${nextNumber} (${base})`;
}
