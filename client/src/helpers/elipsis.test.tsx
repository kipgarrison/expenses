import { elipsis } from "./elipsis";

describe.only("elipsis", () => {
  it("should not add an elipsis to text strings shorted the max parameter", () => {
    const str = "four score and seven years ago";
    const elided = elipsis(str, 40);
    expect(elided).toBe(str);
  });

  it("should add an elipsis to text strings longer than the max characters at nearest work break", () => {
    const str = "four score and seven years ago";
    const elided = elipsis(str, 22);
    expect(elided).toBe("four score and seven...");
  })
});