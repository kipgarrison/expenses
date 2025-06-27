import { vi } from "vitest";
import { midnightTomorrow } from "./midnightTomorrow";

describe("midnightTomorrow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  })

  afterEach(() => {
    vi.useRealTimers();
  })
  
  it("should return a date object representing tomorrows date at midnight", () => {
    vi.setSystemTime(new Date(2024, 1, 1, 10, 30, 0, 0));
    const actual = midnightTomorrow();
    const expected = new Date(2024, 1, 2, 0, 0, 0, 0); 
    expect(actual).toEqual(expected);
  });
});