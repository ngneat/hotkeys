export type Platform = 'apple' | 'pc';

export function hostPlatform(): Platform {
  const appleDevices = ['Mac', 'iPhone', 'iPad', 'iPhone'];
  return appleDevices.some(d => navigator.platform.includes(d)) ? 'apple' : 'pc';
}

export function normalizeKeys(keys: string): string {
  const lowercaseKeys = keys.toLowerCase();
  const platform = hostPlatform();
  switch (platform) {
    case 'pc':
      return lowercaseKeys
        .split('.')
        .map(k => (k === 'meta' ? 'control' : k))
        .join('.');
    default:
      return keys;
  }
}
