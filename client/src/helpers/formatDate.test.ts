import { formatDate } from './formatDate';

describe("formatDate", () => {
  it("should return a date formatted as mm/dd/yyyy when that format string is passed", () => {
    const d = new Date(2025, 0, 1);
    const formatted = formatDate(d, "mm/dd/yyyy");

    expect(formatted).toBe("1/1/2025");
  })

  it("shoould return a date formatted as mmmm yyyy when that format string is passed", () => {
    const d = new Date(2025, 0, 1);
    const formatted = formatDate(d, "mmmm yyyy");

    expect(formatted).toBe("January 2025");
  })
}) 