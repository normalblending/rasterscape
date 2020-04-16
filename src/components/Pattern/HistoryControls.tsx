import * as React from "react";
import {Button} from "../_shared/buttons/Button";
import {HistoryValue} from "../../store/patterns/history/types";
import {useTranslation} from 'react-i18next';
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {redo, undo} from "../../store/patterns/history/actions";

export interface HistoryControlsStateProps {
    history: HistoryValue

}

export interface HistoryControlsActionProps {

    redo(id: string)

    undo(id: string)

}

export interface HistoryControlsOwnProps {
    patternId: string

}

export interface HistoryControlsProps extends HistoryControlsStateProps, HistoryControlsActionProps, HistoryControlsOwnProps {

}

export const HistoryControlsComponent: React.FC<HistoryControlsProps> = ({undo, redo, history, patternId}) => {

    const onUndo = React.useCallback(() => {
        undo(patternId);
    }, [patternId]);

    const onRedo = React.useCallback(() => {
        redo(patternId);
    }, [patternId]);

    const {t} = useTranslation("common");
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

const mapStateToProps: MapStateToProps<HistoryControlsStateProps, HistoryControlsOwnProps, AppState> = (state, {patternId}) => ({
    history: state.patterns[patternId]?.history.value
});

const mapDispatchToProps: MapDispatchToProps<HistoryControlsActionProps, HistoryControlsOwnProps> = {
    redo,
    undo,
};

export const HistoryControls = connect<HistoryControlsStateProps, HistoryControlsActionProps, HistoryControlsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(HistoryControlsComponent);
