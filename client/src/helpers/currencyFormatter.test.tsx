import { formatCurrency } from "./currencyFormatter";

describe("currencyFormatter", () => {
  it("should return a properly formatted US currency when a number if provided", () => {
    const value = 20;
    
    const expected = "$20.00" 
    const actual = formatCurrency(value);
    
    expect(actual).toBe(expected);
  });

  it("should properly handle negative amounts", () => {
    const value = -20;
    
    const expected = "-$20.00" 
    const actual = formatCurrency(value);
    
    expect(actual).toBe(expected);
  });


});