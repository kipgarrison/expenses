import Toast from 'react-bootstrap/Toast';
import type { AlertType } from '../types/TransactionsState';
import { ToastContainer } from 'react-bootstrap';

export function AppToast({ alert, onClose } : { alert?: AlertType, onClose: () => void}) {
  const variant = alert?.type === "success" ? "success" : "danger";
  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }} data-testid="toast">
      <Toast className="d-inline-block m-1" bg={variant} onClose={onClose} show={!!alert} autohide delay={3000}>
        <Toast.Header className="black-with-white-text">
            <strong className="me-auto">Expenses</strong>
          </Toast.Header>
          <Toast.Body className='text-white'>
            {alert?.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
  )
}