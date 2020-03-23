import * as React from "react";
import {Button} from "../_shared/buttons/Button";
import {SelectionValue} from "../../store/patterns/selection/types";
import '../../styles/selectionControls.scss';

export interface SelectionControlsProps {
    selectionValue: SelectionValue

    onClear()

    onCreatePattern()

    onCut()

}

export interface SelectionControlsState {

}

export class SelectionControls extends React.PureComponent<SelectionControlsProps, SelectionControlsState> {

    render() {
        const {onClear, onCreatePattern, onCut, selectionValue} = this.props;
        return selectionValue.segments && selectionValue.segments.length ? (
            <div className={'selection-controls'}>
                <Button
                    onClick={onClear}>clear</Button>

                <Button
                    onClick={onCreatePattern}>pattern</Button>
                <Button
                    onClick={onCut}>cut</Button>
            </div>
        ) : null;
    }
}