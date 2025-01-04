import { sortBy } from 'lodash';

export function formatPerKeyWrongCount(perKeyWrongCount: {
  [key: string]: number;
}): string {
  const sorted = sortBy(Object.entries(perKeyWrongCount), row => -row[1])
    .map(row => `${row[0]}:${row[1]}回`)
  if (sorted.length > 4) {
    return sorted.slice(0, 5).join(' ') + 'ほか'
  } else {
    return sorted.join(' ')
  }
}
