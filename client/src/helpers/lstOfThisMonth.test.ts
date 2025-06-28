import { vi  } from 'vitest';
import { lastOfThisMonth } from './lastOfThisMonth';

describe("lastOfThisMonth", () => {
  it("should return a date object representing the last day of  the current month", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 0, 1, 10, 30, 0, 0));
    const expected = new Date(2024, 0, 31);
    const actual = lastOfThisMonth();
    expect(actual).toEqual(expected)
    vi.useRealTimers();
  });
});