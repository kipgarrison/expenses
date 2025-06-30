import type { TransactionSearchFilterType } from "../types/TransactionSeachFilterType"
import { filterToStrings } from "./filterToStrings";

describe("filterToStrings", () => {
  it("should return filter string for from date only", () => {
    const filter:TransactionSearchFilterType = {
      fromDate: "1/1/2025",
      merchants: [],
      categories: []
    };
  
    const actual = filterToStrings(filter);
    const expected = [ { columns: [ 'fromDate' ], message: "Date after 1/1/2025" }];
    expect(actual).toEqual(expected);

  })

  it("should return correct filter string for to date only", () => {
    const filter:TransactionSearchFilterType = {
      toDate: "12/31/2025",
      merchants: [],
      categories: []
    };
      
    const actual = filterToStrings(filter);
    const expected = [ { columns: [ 'toDate' ], message: "Date before 12/31/2025" }];
    expect(actual).toEqual(expected);

  })

  it("should return correct filter string for to and from date only", () => {
    const filter:TransactionSearchFilterType = {
      fromDate: "1/1/2025",
      toDate: "12/31/2025",
      merchants: [],
      categories: []
    };
      
    const actual = filterToStrings(filter);
    const expected = [ { columns: [ 'fromDate', 'toDate' ], message: "Date between 1/1/2025 and 12/31/2025" }];
    expect(actual).toEqual(expected);
  })

  it("should return filter string for from amount only", () => {
    const filter:TransactionSearchFilterType = {
      fromAmount: 100,
      merchants: [],
      categories: []
    };
      
    const actual = filterToStrings(filter);
    const expected = [ { columns: [ 'fromAmount' ], message: "Amount above $100.00" }];
    expect(actual).toEqual(expected);
  })

  it("should return correct filter string for to amount only", () => {
    const filter:TransactionSearchFilterType = {
      toAmount: 1000,
      merchants: [],
      categories: []
    };
      
    const actual = filterToStrings(filter);
    const expected = [ { columns: [ 'toAmount' ], message: "Amount below $1,000.00" }];
    expect(actual).toEqual(expected);

  })

  it("should return correct filter string for to and from amount only", () => {
    const filter:TransactionSearchFilterType = {
      fromAmount: 100,
      toAmount: 1000,
      merchants: [],
      categories: []
    };
      
    const actual = filterToStrings(filter);
    const expected = [ { columns: [ 'fromAmount', 'toAmount' ], message: "Amount between $100.00 and $1,000.00" }];
    expect(actual).toEqual(expected);
  })

  it("should return correct filter string for comments", () => {
    const filter: TransactionSearchFilterType = {
      comments: "testing",
      merchants: [],
      categories: []
    };
      
    const actual = filterToStrings(filter);
    const expected = [ { columns: [ 'comments' ], message: "Comments contains testing" }];
    expect(actual).toEqual(expected);
  })

  it("should return correct filter string for single merchant", () => {
    const filter: TransactionSearchFilterType = {
      merchants: [ { id: 1, name: "Exxon" } ],
      categories: []
    };
      
    const actual = filterToStrings(filter);
    const expected = [ { columns: [ 'merchants' ], message: "Merchants are Exxon" }];
    expect(actual).toEqual(expected);
  })

  it("should return correct filter string for two merchants", () => {
    const filter: TransactionSearchFilterType = {
      merchants: [ { id: 1, name: "Exxon" }, { id: 2, name: "Target"} ],
      categories: []
    };
      
    const actual = filterToStrings(filter);
    const expected = [ { columns: [ 'merchants' ], message: "Merchants are Exxon, Target" }];
    expect(actual).toEqual(expected);
  })

  it("should return correct filter string for three or more merchants", () => {
    const filter: TransactionSearchFilterType = {
      merchants: [ { id: 1, name: "Exxon" }, { id: 2, name: "Wal-Mart" }, { id: 3, name: "Target"} ],
      categories: []
    };
      
    const actual = filterToStrings(filter);
    const expected = [ { columns: [ 'merchants' ], message: "Merchants are Exxon, Wal-Mart, ..." }];
    expect(actual).toEqual(expected);
  })

    it("should return correct filter string for single category", () => {
    const filter: TransactionSearchFilterType = {
      merchants: [],
      categories: [ { id: 1, name: "Cat #1" } ]
    };
      
    const actual = filterToStrings(filter);
    const expected = [ { columns: [ 'categories' ], message: "Categories are Cat #1" }];
    expect(actual).toEqual(expected);
  })

  it("should return correct filter string for two types", () => {
    const filter: TransactionSearchFilterType = {
      merchants: [  ],
      categories: [ { id: 1, name: "Cat #1" }, { id: 2, name: "Cat #2" } ]
    };
      
    const actual = filterToStrings(filter);
    const expected = [ { columns: [ 'categories' ], message: "Categories are Cat #1, Cat #2" }];
    expect(actual).toEqual(expected);
  })

  it("should return correct filter string for three or more types", () => {
    const filter: TransactionSearchFilterType = {
      merchants: [ ],
      categories: [ { id: 1, name: "Cat #1" }, { id: 2, name: "Cat #2" }, { id: 3, name: "Cat #3" } ]
    };
      
    const actual = filterToStrings(filter);
    const expected = [ { columns: [ 'categories' ], message: "Categories are Cat #1, Cat #2, ..." }];
    expect(actual).toEqual(expected);
  });

  it("should return correct filter string for all fields", () => {
    const filter: TransactionSearchFilterType = {
      fromDate: '1/1/2025',
      toDate: '12/31/2025',
      fromAmount: 100,
      toAmount: 1000,
      comments: 'testing',
      merchants: [ { id: 1, name: "Exxon" }, { id: 2, name: "Wal-Mart" } ],
      categories: [ { id: 1, name: "Cat 1"}, { id: 2, name: "Cat 2" }]
    };
      
    const actual = filterToStrings(filter);
    const expected = [ 
      { columns: [ 'fromDate', 'toDate' ], message: "Date between 1/1/2025 and 12/31/2025" },
      { columns: [ 'fromAmount', 'toAmount' ], message: "Amount between $100.00 and $1,000.00" },
      { columns: [ 'comments' ], message: "Comments contains testing" },
      { columns: [ 'merchants' ], message: "Merchants are Exxon, Wal-Mart" },
      { columns: [ 'categories' ], message: "Categories are Cat 1, Cat 2" }];
    expect(actual).toEqual(expected);
  });
})