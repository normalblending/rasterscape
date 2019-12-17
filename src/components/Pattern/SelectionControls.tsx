import * as React from "react";
import {Button} from "../_shared/Button";
import {SelectionValue} from "../../store/patterns/types";

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
        return selectionValue.segments && selectionValue.segments.length && (
            <div>
                <Button
                    onClick={onClear}>clear</Button>

                <Button
                    onClick={onCreatePattern}>pattern</Button>
                <Button
                    onClick={onCut}>cut</Button>
            </div>
        );
    }
}