import * as React from "react";
import {Button} from "../_shared/Button";
import {HistoryValue} from "../../store/patterns/history/types";

export interface HistoryControlsProps {

    history: HistoryValue

    onUndo()

    onRedo()
}

export const HistoryControls: React.FC<HistoryControlsProps> = ({onUndo, onRedo, history}) => {

    return (
        <>
            <Button
                onClick={onUndo}
                disabled={!history.before.length}
                width={70}>
                undo{history.before.length ? `(${history.before.length})` : ""}</Button>
            <Button
                onClick={onRedo}
                disabled={!history.after.length}
                width={70}>
                redo{history.after.length ? `(${history.after.length})` : ""}</Button>
        </>
    );
};