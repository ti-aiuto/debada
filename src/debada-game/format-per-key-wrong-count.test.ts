import { formatPerKeyWrongCount } from "./format-per-key-wrong-count";

describe('formatPerKeyWrongCount', () => {
  it('戻り値の確認', () => {
    expect(formatPerKeyWrongCount({})).toEqual('');
    expect(formatPerKeyWrongCount({ b: 1 })).toEqual('b:1回');
    expect(formatPerKeyWrongCount({ b: 2, a: 3 })).toEqual('a:3回 b:2回');
    expect(formatPerKeyWrongCount({ b: 2, a: 3, c: 4, d: 5 })).toEqual('d:5回 c:4回 a:3回 b:2回');
    expect(formatPerKeyWrongCount({ b: 2, a: 3, c: 4, d: 5, e: 6 })).toEqual('e:6回 d:5回 c:4回 a:3回 b:2回ほか');
  })
})
