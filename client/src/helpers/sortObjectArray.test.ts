import { sortObjectsArray } from "./sortObjectsArray";

describe("sortObjectArray", () => {
  it("should sort array of objects by primary column and direction", () => {
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

  it("should sort date fields asc correctly", () => {
    const array = [ { d: new Date(2025, 1, 1) }, { d: new Date(2024, 1, 1) }, { d: new Date(2026, 1, 1) }, { d: new Date(2024, 6, 1) } ];
    const expected = [ { d: new Date(2024, 1, 1) }, { d: new Date(2024, 6, 1) }, { d: new Date(2025, 1, 1) }, { d: new Date(2026, 1, 1) } ];
    
    const actual = sortObjectsArray(array, { column: "d", direction: "asc"});

    expect(actual).toEqual(expected);
  })

  it("should sort date fields desc correctly", () => {
    const array = [ { d: new Date(2025, 1, 1) }, { d: new Date(2024, 1, 1) }, { d: new Date(2026, 1, 1) }, { d: new Date(2024, 6, 1) } ];
    const expected = [ { d: new Date(2026, 1, 1) }, { d: new Date(2025, 1, 1) }, { d: new Date(2024, 6, 1) }, { d: new Date(2024, 1, 1) } ];
  
    const actual = sortObjectsArray(array, { column: "d", direction: "desc"});

    expect(actual).toEqual(expected);
  });

  
  it("should sort date fields and second field asc correctly", () => {
    const array = [ 
      { d: new Date(2024, 1, 1), id: 4 }, 
      { d: new Date(2024, 1, 1), id: 3 }, 
      { d: new Date(2024, 1, 1), id: 2 }, 
      { d: new Date(2024, 1, 1), id: 1 } 
    ];
    const expected = [ 
      { d: new Date(2024, 1, 1), id: 1 }, 
      { d: new Date(2024, 1, 1), id: 2 }, 
      { d: new Date(2024, 1, 1), id: 3 }, 
      { d: new Date(2024, 1, 1), id: 4 } 
    ];

    const actual = sortObjectsArray(array, { column: "d", direction: "asc"}, "id");

    expect(actual).toEqual(expected);

    const appData = [
      { id: 1683, date: new Date("2019-12-31T06:00:00.000Z") },
      { id: 932, date: new Date("2019-12-31T06:00:00.000Z") },
      { id: 658, date: new Date("2019-12-31T06:00:00.000Z") },
    ]

    const sortedAppData = sortObjectsArray(appData, { column: "date", direction: "asc"}, "id");

    expect(sortedAppData).toEqual(appData);
    
  });
})

