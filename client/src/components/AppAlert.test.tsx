import { render, screen, waitFor } from "@testing-library/react";
import AppAlert from "./AppAlert";
import type { AlertType } from "../types/TransactionsState";
import { vi } from "vitest";

describe("AppAlert", () => {
  it("should display an Bootstrap Alert with the message passed in and close after 5 seconds", async () => {
    const alert: AlertType = { type: "success", message: "Isn't life wonderful" };
    const close = vi.fn();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(<AppAlert alert={alert} onClose={close}/>)
    const element = await waitFor(() => screen.getByText(alert.message));
    expect(element).toBeInTheDocument();
    vi.advanceTimersByTime(6000);
    expect(close).toHaveBeenCalled();
  })

  it("should ")
})