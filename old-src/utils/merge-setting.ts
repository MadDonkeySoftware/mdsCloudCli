import { CONFIG_ELEMENTS } from './config-elements';

export function mergeSetting(target, source) {
  const result = { ...target };

  CONFIG_ELEMENTS.forEach((e) => {
    const { key } = e;
    if (source[key]) {
      result[key] = source[key];
    }
  });

  return result;
}
