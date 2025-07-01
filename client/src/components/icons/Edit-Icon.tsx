import type { ActionableEventHandlerParams } from "../../types/ActionableEventHandlerParams";
import type { Transaction } from "../../types/Transaction";
import "./Edit-Icon.css";
// @ts-expect-error("SVG import cause TS to show error")
import PencilIcon from './pencil.svg?react';

function EditIcon( {onAction, item }: ActionableEventHandlerParams<Transaction> ) {
    return <PencilIcon height='16' width='16' onClick={ () => onAction(item) }/>;
}

export default EditIcon;