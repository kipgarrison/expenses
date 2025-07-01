import { render, screen, waitFor } from "@testing-library/react";
import { vi,  } from "vitest";
import { SortButton } from "./SortButton";
import userEvent from "@testing-library/user-event";

describe("SortButton", () => {
  it("should render a button with ascending icon, column name and call onSort with column name when clicked", async () => {
    const sort = vi.fn();
    const sortDir = "asc";
    render(<SortButton sortDir={sortDir} onSort={sort} column="column">Title</SortButton>);
    const btn = await waitFor(() => screen.getByTestId("sort-asc"));
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent("Title")
    expect(sort).not.toHaveBeenCalled();
    await userEvent.click(btn);
    expect(sort).toHaveBeenCalledWith("column");
  })

  it("should render a button with descending icon, column name and call onSort with column name when clicked", async () => {
    const sort = vi.fn();
    const sortDir = "desc";
    render(<SortButton sortDir={sortDir} onSort={sort} column="column">Title</SortButton>);
    const btn = await waitFor(() => screen.getByTestId("sort-desc"));
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent("Title")
    expect(sort).not.toHaveBeenCalled();
    await userEvent.click(btn);
    expect(sort).toHaveBeenCalledWith("column");
  })

  it("should render a button with w/o icon, w/column name and call onSort with column name when clicked", async () => {
    const sort = vi.fn();
    const sortDir = "none";
    render(<SortButton sortDir={sortDir} onSort={sort} column="column">Title</SortButton>);
    const btn = await waitFor(() => screen.getByTestId("sort-none"));
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent("Title")
    expect(sort).not.toHaveBeenCalled();
    await userEvent.click(btn);
    expect(sort).toHaveBeenCalledWith("column");
  })
})