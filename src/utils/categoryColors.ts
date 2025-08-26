interface CategoryColorMapping {
  origin: string;
  background: string;
  border: string;
}

type ColorMappings = {
  [key: string]: CategoryColorMapping;
};

export const categoryColorMappings: ColorMappings = {
  green: {
    origin: 'bg-green-400',
    background: 'bg-green-100',
    border: 'border-green-300',
  },
  orange: {
    origin: 'bg-orange-400',
    background: 'bg-orange-100',
    border: 'border-orange-300',
  },
  blue: {
    origin: 'bg-blue-400',
    background: 'bg-blue-100',
    border: 'border-blue-300',
  },
  red: {
    origin: 'bg-red-400',
    background: 'bg-red-100',
    border: 'border-red-300',
  },
  purple: {
    origin: 'bg-purple-400',
    background: 'bg-purple-100',
    border: 'border-purple-300',
  },
  yellow: {
    origin: 'bg-yellow-400',
    background: 'bg-yellow-100',
    border: 'border-yellow-300',
  },
  slate: {
    origin: 'bg-slate-400',
    background: 'bg-slate-100',
    border: 'border-slate-300',
  },
};

const isHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

// Helper function to adjust hex color brightness
const adjustBrightness = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 0 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

export const getCategoryColors = (
  color: string | null | undefined,
): CategoryColorMapping => {
  if (!color) return categoryColorMappings.slate;

  const key = color.toLowerCase();

  if (categoryColorMappings[key]) {
    return categoryColorMappings[key];
  }

  if (isHexColor(key)) {
    return {
      origin: key,
      background: adjustBrightness(key, 80),
      border: adjustBrightness(key, 40),
    };
  }

  // Default to slate for invalid colors
  return categoryColorMappings.slate;
};
