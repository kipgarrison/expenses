import { vi  } from 'vitest';
import { firstOfThisMonth } from './firstOfThisMonth';

describe("firstOfThisMonth", () => {
  it("should return a date object representing the first day of  the current month", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 0, 1, 10, 30, 0, 0));
    const expected = new Date(2024, 0, 1);
    const actual = firstOfThisMonth();
    expect(actual).toEqual(expected)
    vi.useRealTimers();
  });
});