'use client';

export function normalizeString(str: string): string {
  if (!str) return '';
  
  return str
    .trim()
    .toLowerCase()
    .replace(/[\u00C0-\u00FF]/g, char => 'aaaaaaaceeeeiiiidnoooooouuuuybsaaaaaaaceeeeiiiidnoooooouuuyyby'[
      '\u00c0\u00c1\u00c2\u00c3\u00c4\u00c5\u00c6\u00c7\u00c8\u00c9\u00ca\u00cb\u00cc\u00cd\u00ce\u00cf\u00d0\u00d1\u00d2\u00d3\u00d4\u00d5\u00d6\u00d8\u00d9\u00da\u00db\u00dc\u00dd\u00de\u00df\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5\u00e6\u00e7\u00e8\u00e9\u00ea\u00eb\u00ec\u00ed\u00ee\u00ef\u00f0\u00f1\u00f2\u00f3\u00f4\u00f5\u00f6\u00f8\u00f9\u00fa\u00fb\u00fc\u00fd\u00fe\u00ff'.indexOf(char)
    ] || char)
    .replace(/[^\w\s]/gi, '')
    .replace(/_/g, '')
    .replace(/\s+/g, '')
    .replace(/\s/g, '');
} 