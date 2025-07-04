import { Spinner } from "react-bootstrap"
import "./AppSpinner.css";
import type { ReactNode } from "react";
import { ApiError } from "../../types/apiError";
import AppError from '../errors/AppError';

export function AppWrapper({showSpinner, error, children, onRetry }: { showSpinner?: boolean, error?: ApiError, children: ReactNode, onRetry: () => void}) {
  let output: ReactNode;
  if (showSpinner) {
    output = (
      <div className="row d-flex align-items-center full-screen" data-testid="app-spinner">
      <div className="centered-spinner">
        <Spinner animation="border" />
        <span className='m-3'>Please be patient while we load your data...</span>
      </div>
    </div>);
  } else if (error) {
    output = <AppError message={error.message} requestId={error.requestId} onRetry={onRetry} />;
  } else {
    output = children;
  }
  
  return (
      output    
  )
}
