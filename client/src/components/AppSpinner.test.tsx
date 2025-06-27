import { render, screen, waitFor } from "@testing-library/react"
import { AppSpinner } from "./AppSpinner"

describe("AppSpinner", () => {
  it("should show the spinner and hide its child elements when show is true", async () => {
    render(<AppSpinner show><div>I'm the child</div></AppSpinner>);
    const element = await waitFor(() => screen.getByTestId("app-spinner"));
    expect(element).toBeInTheDocument();
    const child = screen.queryByText("I'm the child");
    expect(child).toBeNull();
  })

  it("should hide the spinner and show its child elements when show is false", async () => {
    render(<AppSpinner><div>I'm the child</div></AppSpinner>);
    const child = await waitFor(() => screen.getByText("I'm the child"));
    expect(child).toBeInTheDocument();
    const spinner = screen.queryByTestId("app-spinner");
    expect(spinner).toBeNull();
  })
})