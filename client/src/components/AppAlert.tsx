import { Alert } from "react-bootstrap"
import type { AlertType } from "../types/TransactionsState"
import { useEffect } from "react";

export default function AppAlert({alert, onClose }: {alert: AlertType, onClose: () => void }) {
  useEffect(() => {
    if (alert) {
      setTimeout(()=>{
        onClose();
      }, 5000);
    } 
  }, [alert, onClose]);
   
  return (
    alert &&
      <Alert variant={alert.type} onClose={() => onClose()} dismissible >
          {alert.message}
      </Alert>
  )
}
         