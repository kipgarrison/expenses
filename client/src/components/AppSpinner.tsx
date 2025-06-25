import { Spinner } from "react-bootstrap"
import "./AppSpinner.css";
import type { ReactNode } from "react";

export function AppSpinner({show, children }: { show: boolean, children: ReactNode}) {
  const output = show ?
        <div className="row d-flex align-items-center full-screen" role="app-spinner">
          <div className="centered-spinner">
            <Spinner animation="border" />
            <span className='m-3'>Please be patient while we load your data...</span>
          </div>
        </div>
      : children;
  return (
      output    
  )
}
