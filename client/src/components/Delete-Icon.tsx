import type { ActionableEventHandlerParams } from "../types/ActionableEventHandlerParams";
import type { Transaction } from "../types/Transaction";
import "./Delete-Icon.css";
// @ts-expect-error("SVG import cause TS to show error")
import TrashIcon from './trash.svg?react';

function DeleteIcon( {onAction, item }: ActionableEventHandlerParams<Transaction> ) {
    return <TrashIcon height='16' width='16' onClick={ () => onAction(item) }/>;
}

export default DeleteIcon;
