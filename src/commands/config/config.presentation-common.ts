import { ENV_CONFIG_ELEMENTS } from './config.constants.ts';

export function getConfigKeys(includeAll = false) {
  const configElementKeys = ENV_CONFIG_ELEMENTS.map((e) => e.key);
  if (includeAll) {
    configElementKeys.push('all');
  }
  return configElementKeys;
}

export function getSortedConfigKeys({
  includeAll = false,
}: {
  includeAll?: boolean;
} = {}) {
  const keys = getConfigKeys(includeAll);
  return keys.sort((a, b) => {
    // Sort alphabetically, but put 'all' at the end if present
    if (a === 'all') return 1;
    if (b === 'all') return -1;
    return a.localeCompare(b);
  });
}
