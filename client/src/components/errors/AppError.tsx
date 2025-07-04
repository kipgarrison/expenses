// @ts-expect-error("SVG import cause TS to show error")
import FrownyFace from '../icons/FrownyFace.svg?react';


import './AppError.css';

const AppError = ({ message, requestId, onRetry }: { message: string, requestId?: string, onRetry?: () => void } ) => {
  
  return (
    <div className="app-error-message">
      <FrownyFace height={100} width={100} />
      <h3>An error has occured while processing your request</h3>
      <p>{message}</p>
      <p>The request id associated with this error is {requestId}</p>
      {onRetry && 
        <p>You can <a href="#" onClick={onRetry}>retry your request now</a> or try again later.</p>
      }
    </div>
  )
}

export default AppError;
