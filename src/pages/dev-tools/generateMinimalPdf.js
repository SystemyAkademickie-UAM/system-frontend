/**
 * @file generateMinimalPdf.js
 * @description Generuje poprawny bufor binarnego pliku PDF zgodny ze specyfikacją (%PDF-1.4).
 */

export function generateMinimalPdf(title = 'Dokument Systemowy', text = 'Przykładowa treść dokumentu.') {
  // Zastąp polskie znaki diakrytyczne bezpiecznymi odpowiednikami ASCII dla podstawowego fontu Type1 Helvetica
  const cleanTitle = title
    .replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (m) => {
      const map = {
        ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
        Ą: 'A', Ć: 'C', Ę: 'E', Ł: 'L', Ń: 'N', Ó: 'O', Ś: 'S', Ź: 'Z', Ż: 'Z',
      };
      return map[m] || m;
    })
    .replace(/[()]/g, '');

  const cleanText = text
    .replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (m) => {
      const map = {
        ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
        Ą: 'A', Ć: 'C', Ę: 'E', Ł: 'L', Ń: 'N', Ó: 'O', Ś: 'S', Ź: 'Z', Ż: 'Z',
      };
      return map[m] || m;
    })
    .replace(/[()]/g, '');

  const streamContent = `BT
/F1 18 Tf
50 720 Td
(${cleanTitle}) Tj
/F1 11 Tf
0 -30 Td
(${cleanText}) Tj
0 -20 Td
(Wygenerowano automatycznie w narzedziach deweloperskich MyAcademyQuest.) Tj
ET`;

  const streamLength = streamContent.length;

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length ${streamLength} >>
stream
${streamContent}
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000234 00000 n 
0000000305 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${400 + streamLength}
%%EOF
`;

  return new Blob([pdf], { type: 'application/pdf' });
}

