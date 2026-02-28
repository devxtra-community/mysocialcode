export const Colors = {
  light: {
    primary: '#0f172a',
    primaryForeground: '#ffffff',

    secondary: '#f1f5f9',
    secondaryForeground: '#0f172a',

    background: '#ffffff',
    text: '#0f172a',

    muted: '#f1f5f9',
    mutedForeground: '#64748b',

    border: '#e5e7eb',

    red: '#ef4444',
    destructiveForeground: '#ffffff',

    green: '#22c55e',

    // ✅ added
    card: '#ffffff',
  },

  dark: {
    primary: '#e5e7eb',
    primaryForeground: '#020617',

    secondary: '#1e293b',
    secondaryForeground: '#ffffff',

    background: '#020617',
    text: '#e5e7eb',

    muted: '#1e293b',
    mutedForeground: '#94a3b8',

    border: '#1e293b',

    red: '#ef4444',
    destructiveForeground: '#ffffff',

    green: '#22c55e',

    // ✅ added
    card: '#0f172a',
  },
} as const;
