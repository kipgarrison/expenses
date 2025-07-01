import { render, screen, waitFor } from "@testing-library/react"
import { AppToast } from "./AppToast"
import { vi } from "vitest"
import type { AlertType } from "../../types/TransactionsState"

describe("AppToast", () => {
  it("should should show a toast message when alert is set", async () => {
    const alert: AlertType = { type: "success", message: "App Toast" };
    const close = vi.fn();
    
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(<AppToast alert={alert} onClose={close} />);
    const toast = await waitFor(() => screen.findByTestId("toast"));
    expect(toast).toBeInTheDocument();
    expect(close).not.toHaveBeenCalled();
    vi.advanceTimersByTime(6000);
    expect(close).toHaveBeenCalled();  
  })
})