import { sortObjectsArray } from "./sortObjectsArray";

describe("sortObjectArray", () => {
  it("should sort array of objects the original by primary column and direction", () => {
    const array = [ { name: "Bob" }, { name: "Carl"}, { name: "Albert"}, { name: "Brian" } ];
    const expected = [ { name: "Albert"}, { name: "Bob" }, { name: "Brian" }, { name: "Carl"} ];
    const actual = sortObjectsArray(array, { column: "name", direction: "asc" });
    expect(actual).toEqual(expected);

    const expected2 = [ { name: "Carl"}, { name: "Brian" }, { name: "Bob" },  { name: "Albert"} ];
    const actual2 = sortObjectsArray(actual, { column: "name", direction: "desc" });
    expect(actual2).toEqual(expected2);
  })

  it("should sort array of object by primary and secondary", () => {
    const array = [ { name: "Bob", id: 4 }, { name: "Bob", id: 3}, { name: "Bob", id: 2}, { name: "Bob", id: 1 } ];
    const expected = [ { name: "Bob", id: 1}, { name: "Bob", id: 2 }, { name: "Bob", id: 3 }, { name: "Bob", id: 4} ];
    const actual = sortObjectsArray(array, { column: "name", direction: "asc" }, "id");
    expect(actual).toEqual(expected);

    const expected2 = [ { name: "Bob", id: 4}, { name: "Bob", id: 3 }, { name: "Bob", id: 2 },  { name: "Bob", id: 1} ];
    const actual2 = sortObjectsArray(actual, { column: "name", direction: "desc" }, "id");
    expect(actual2).toEqual(expected2);
  });

  it ("should not mutate original arry", () => {
    const array = [ { name: "Bob" }, { name: "Carl"}, { name: "Albert"}, { name: "Brian" } ];
    const expected = [ { name: "Albert"}, { name: "Bob" }, { name: "Brian" }, { name: "Carl"} ];
    
    const actual = sortObjectsArray(array, { column: "name", direction: "asc"});

    // array references should be different
    expect(actual).not.toBe(expected);
  })

})