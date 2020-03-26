import * as React from "react";
import {Button} from "../_shared/buttons/Button";
import {HistoryValue} from "../../store/patterns/history/types";
import { useTranslation } from 'react-i18next';

export interface HistoryControlsProps {

    history: HistoryValue

    onUndo()

    onRedo()
}

export const HistoryControls: React.FC<HistoryControlsProps> = ({onUndo, onRedo, history}) => {

    const { t } = useTranslation("common");
    return (
        <div className={'flex-row history-controls'}>
            <Button
                onClick={onUndo}
                disabled={!history.before.length}
                width={70}>
                {t('patternControls.undo')}{history.before.length ? `(${history.before.length})` : ""}</Button>
            <Button
                onClick={onRedo}
                disabled={!history.after.length}
                width={70}>
                {t('patternControls.redo')}{history.after.length ? `(${history.after.length})` : ""}</Button>
        </div>
    );
};