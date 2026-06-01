/**
 * Dzieli nazwę fabularną grupy na część główną (biała) i akcent (zielona).
 * Np. „Marchewkowa Gwardia” + „anty-orkowa” jak na banerze grupy.
 *
 * @param {string | null | undefined} storyName
 * @returns {{ primary: string, accentLines: string[] }}
 */
export function splitGroupStoryTitle(storyName) {
  const normalized = String(storyName ?? '').trim();
  if (!normalized) {
    return { primary: 'Grupa', accentLines: [] };
  }

  const lines = normalized
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 1) {
    return {
      primary: lines[0],
      accentLines: lines.slice(1),
    };
  }

  const singleLine = lines[0] ?? normalized;

  const dashSplit = singleLine.split(/\s[-–—|]\s/u);
  if (dashSplit.length >= 2) {
    const primary = dashSplit[0].trim();
    const accentLines = dashSplit.slice(1).map((part) => part.trim()).filter(Boolean);
    if (primary && accentLines.length > 0) {
      return { primary, accentLines };
    }
  }

  const words = singleLine.split(/\s+/u).filter(Boolean);
  if (words.length >= 2) {
    const lastWord = words[words.length - 1];
    const isTaglineWord =
      lastWord.includes('-') || /^[a-ząćęłńóśźż]/u.test(lastWord);

    if (isTaglineWord) {
      return {
        primary: words.slice(0, -1).join(' '),
        accentLines: [lastWord],
      };
    }
  }

  return { primary: singleLine, accentLines: [] };
}
