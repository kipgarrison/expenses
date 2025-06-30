import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { vi } from 'vitest';
import { InitialAppState } from './types/AppState';
import React from 'react';
import { LoadReferenceDataInitAction } from './actions/app/AppActions';


describe("App", () => {
  let mockDispatch = vi.fn();
  beforeEach(() => {
    mockDispatch = vi.fn();
    const mockUseReducer = vi.fn().mockImplementation(() => [InitialAppState, mockDispatch]);
    vi.spyOn(React, 'useReducer').mockImplementation(mockUseReducer);
    
    // transactions mock
    vi.mock('./components/Transactions', () => ({ 
        Transactions: () => <div data-testid="mocked-transactions"></div> ,
    }));


  });

  it("should dispatch the actions to the store that would initiate the calls to get merchant and categories reference data", () => {
    render(<App />);

    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith(new LoadReferenceDataInitAction("Merchants"));
    expect(mockDispatch).toHaveBeenCalledWith(new LoadReferenceDataInitAction("Categories"));
  });

  it("should render with 3 tabs for the various top level components", async () => {
    render(<App />);
    
    const tabs = await waitFor(() => screen.queryByTestId("app-tabs"));
    expect(tabs).toBeInTheDocument();
    const ts = tabs as HTMLElement;
    expect(ts.innerHTML).toContain("Transactions");
    expect(ts.innerHTML).toContain("Transactions");
    expect(ts.innerHTML).toContain("Transactions");

  })
})

