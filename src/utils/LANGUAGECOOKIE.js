export function READLANGUAGECOOKIE() {
  const cookies = Object.fromEntries(
    document.cookie.split(';').map((entry) => {
      const [key, value] = entry.split('=');
      return [key.trim(), value];

    }),
  );

  if (cookies.CURRENTLANGUAGE) {
    return cookies.CURRENTLANGUAGE;
  } else {
    return 'polish';
  }
}