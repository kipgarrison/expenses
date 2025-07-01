import type { ActionableEventHandlerParams } from "../../types/ActionableEventHandlerParams";
import type { Transaction } from "../../types/Transaction";
import "./Delete-Icon.css";
// @ts-expect-error("SVG import cause TS to show error")
import Clip from './paper-clip.svg?react';

function AttachmentIcon( {onAction, item }: ActionableEventHandlerParams<Transaction> ) {
    return <Clip height='16' width='16' onClick={ () => onAction(item) }/>;
}

export default AttachmentIcon;
