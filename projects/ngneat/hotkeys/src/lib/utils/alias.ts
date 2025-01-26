type ModifierKey =
  | 'shift'
  | 'control'
  | 'alt'
  | 'meta'
  | 'altleft'
  | 'backspace'
  | 'tab'
  | 'left'
  | 'right'
  | 'up'
  | 'down'
  | 'enter'
  | 'space'
  | 'escape';

export type CustomAliases = { [key in ModifierKey]?: string };
