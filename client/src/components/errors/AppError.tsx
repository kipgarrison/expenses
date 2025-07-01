// @ts-expect-error("SVG import cause TS to show error")
import ErrorIcon from '../icons/ErrorIcon.svg?react';
import './AppError.css';

const AppError = ({ area, message }: { area: string, message: string}) => {
  return (
    <div className="app-error-message">
      <ErrorIcon height="50" width="50" />
      <h4>An error occured in {area}</h4>
      <p>{message}</p>
    </div>
  )
}

export default AppError;
