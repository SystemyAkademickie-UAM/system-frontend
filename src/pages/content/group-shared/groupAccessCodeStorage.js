const STORAGE_PREFIX = 'maq:group-access-code:';

export function getGroupAccessCode(groupId) {
  if (!groupId) return null;

  try {
    const raw = globalThis.localStorage?.getItem(`${STORAGE_PREFIX}${groupId}`);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return typeof parsed?.code === 'string' ? parsed.code : null;
  } catch {
    return null;
  }
}

export function saveGroupAccessCode(groupId, code) {
  if (!groupId || !code) return;

  globalThis.localStorage?.setItem(
    `${STORAGE_PREFIX}${groupId}`,
    JSON.stringify({ code, generatedAt: new Date().toISOString() }),
  );
}

export function generateGroupAccessCode(length = 8) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';

  for (let index = 0; index < length; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return code;
}
