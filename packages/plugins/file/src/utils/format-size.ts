/**
 * Format file size to human-readable string
 */
export const formatFileSize = (bytes: number | null | undefined): string => {
  if (bytes === null || bytes === undefined || bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));

  if (i === 0) return `${bytes} ${units[0]}`;

  const size = bytes / Math.pow(k, i);
  const decimals = size < 10 ? 2 : size < 100 ? 1 : 0;

  return `${size.toFixed(decimals)} ${units[i]}`;
};

/**
 * Parse file size string to bytes
 */
export const parseFileSize = (sizeString: string): number | null => {
  const match = sizeString.match(/^([\d.]+)\s*(B|KB|MB|GB|TB)?$/i);
  if (!match) return null;

  const value = parseFloat(match[1]);
  const unit = (match[2] ?? 'B').toUpperCase();

  const multipliers: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
  };

  return Math.round(value * (multipliers[unit] ?? 1));
};
