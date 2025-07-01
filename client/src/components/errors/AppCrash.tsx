// @ts-expect-error("SVG import cause TS to show error")
import FrownyFace from '../icons/FrownyFace.svg?react';
import './AppCrash.css';

export function AppCrash({ show }: { show?: boolean }) {
  if (show) {
    return (
      <div className='app-crash-message'>
        <FrownyFace height={100} width={100} />
        <h3>Something went horribly wrong</h3>
        <p>I'm not feeling well and I can't seem to download some critical data.  It seems like my services are having problems.  Please try again later.</p>
      </div>
    )
  } else {
    return <></>
  }
}