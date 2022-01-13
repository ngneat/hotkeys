export type Platform = 'apple' | 'pc';

export function hostPlatform(): Platform {
  const appleDevices = ['Mac', 'iPhone', 'iPad', 'iPhone'];
  return appleDevices.some(d => navigator.platform.includes(d)) ? 'apple' : 'pc';
}

export function normalizeKeys(keys: string, platform: Platform): string {
  const transformMap = {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight'
  };

  function transform(key: string): string {
    if (platform === 'pc' && key === 'meta') {
      key = 'control';
    }

    if (key in transformMap) {
      key = transformMap[key];
    }

    return key;
  }

  return keys
    .toLowerCase()
    .split('.')
    .map(transform)
    .join('.');
}
