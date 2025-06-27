import { vi } from "vitest";
import { midnightToday } from "./midnightToday";

describe("midnightToday", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  })

  afterEach(() => {
    vi.useRealTimers();
  })
  
  it("should return a date object represent the current date at midnight", () => {
    vi.setSystemTime(new Date(2024, 1, 1, 10, 30, 0, 0));
    const actual = midnightToday();
    const expected = new Date(2024, 1, 1, 0, 0, 0, 0); 
    expect(actual).toEqual(expected);
  });
});