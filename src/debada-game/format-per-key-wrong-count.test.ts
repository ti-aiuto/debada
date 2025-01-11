import {formatPerKeyWrongCount} from './format-per-key-wrong-count';

describe('formatPerKeyWrongCount', () => {
  it('戻り値の確認', () => {
    expect(formatPerKeyWrongCount({})).toEqual('');
    expect(formatPerKeyWrongCount({b: 1})).toEqual('B:1回');
    expect(formatPerKeyWrongCount({b: 2, a: 3})).toEqual('A:3回 B:2回');
    expect(formatPerKeyWrongCount({b: 2, a: 3, c: 4, d: 5})).toEqual(
      'D:5回 C:4回 A:3回 B:2回'
    );
    expect(formatPerKeyWrongCount({b: 2, a: 3, c: 4, d: 5, e: 6})).toEqual(
      'E:6回 D:5回 C:4回 A:3回 B:2回ほか'
    );
  });
});
