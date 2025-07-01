import { Spinner } from "react-bootstrap"

export function ApiSpinner({show}: {show: boolean}) {
  const output = show ? <Spinner animation="border" />  : <></>
  return output;
}
