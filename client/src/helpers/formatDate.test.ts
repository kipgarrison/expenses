import { formatDate, formatDateFromISOString } from './formatDate';

describe("formatDate", () => {
  it("should return a date formatted as mm/dd/yyyy when that format string is passed", () => {
    const d = new Date(2025, 0, 1);
    const formatted = formatDate(d, "mm/dd/yyyy");

    expect(formatted).toBe("01/01/2025");
  })

  it("shoould return a date formatted as mmmm yyyy when that format string is passed", () => {
    const d = new Date(2025, 0, 1);
    const formatted = formatDate(d, "mmmm yyyy");

    expect(formatted).toBe("January 2025");
  })
}) 

describe("formatDateFromISOString", () => {
  it("should return a date string in the format mm/dd/yyyy when given valid ISO date string", () =>{
    const dt = "2025-06-20T12:00:00.80Z";
    const expected = "06/20/2025";

    const actual = formatDateFromISOString(dt);

    expect(actual).toBe(expected);
  } )
});