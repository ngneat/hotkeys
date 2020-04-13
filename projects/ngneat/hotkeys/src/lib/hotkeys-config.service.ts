import { InjectionToken } from '@angular/core';

export const HOTKEYS_CONFIG = new InjectionToken<Partial<HotkeysConfig>>('Hotkeys configuration', {
  providedIn: 'root',
  factory: () => ({})
});

export interface HotkeysConfig {
  helpShortcut: string;
}
