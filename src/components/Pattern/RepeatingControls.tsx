import * as React from "react";
import {ButtonNumberCF} from "../_shared/ButtonNumberCF";
import {ValueD} from "../_shared/ButtonNumber";
import {ButtonSelect} from "../_shared/ButtonSelect";
import {BezierCurve} from "../_shared/BezierCurve";
import * as Bezier from "bezier-js";
import {ERepeatingType, RepeatingParams} from "../../store/patterns/repeating/types";

export interface RepeatingControlsProps {
    repeating: RepeatingParams
    patternId: string

    onChange(repeating: RepeatingParams)

}

export interface RepeatingControlsState {

}

const repeatingRange = [1, 10] as [number, number];
const repeatingOutRange = [0, 3] as [number, number];
const repeatingValueD = ValueD.VerticalLinear(9);

export class RepeatingControls extends React.PureComponent<RepeatingControlsProps, RepeatingControlsState> {


    state = {
        curve: new Bezier(10, 10, 20, 20, 80, 80, 90, 90)
    }

    handleGridParamsChange = ({value, name}) => {
        const {onChange, repeating} = this.props;
        onChange({
            ...repeating,
            gridParams: {
                ...repeating.gridParams,
                [name]: value
            }
        })
    };

    handleIntegerChange = (data) => {
        const {selected, name} = data;
        const {onChange, repeating} = this.props;
        onChange({
            ...repeating,
            gridParams: {
                ...repeating.gridParams,
                [name]: !selected,
                bezierPoints: [{x: 10, y: 10}, {x: 20, y: 20}, {x: 80, y: 80}, {x: 90, y: 90}]
            }
        })
    };

    handleBezierChange = (points) => {
        const {onChange, repeating} = this.props;
        onChange({
            ...repeating,
            gridParams: {
                ...repeating.gridParams,
                bezierPoints: points
            }
        })
    };

    render() {
        const {type, gridParams} = this.props.repeating;
        return (
            <div>
                {type === ERepeatingType.Grid && (<>
                    <ButtonSelect
                        name={"integer"}
                        onClick={this.handleIntegerChange}
                        selected={gridParams.integer}>{gridParams.integer ? "int" : "float"}</ButtonSelect>
                    <ButtonNumberCF
                        integer={gridParams.integer}
                        path={`patterns.${this.props.patternId}.repeating.params.gridParams.x`}
                        name={"x"}
                        value={gridParams.x}
                        range={repeatingRange}
                        valueD={repeatingValueD}
                        onChange={this.handleGridParamsChange}/>
                    <ButtonNumberCF
                        integer={gridParams.integer}
                        path={`patterns.${this.props.patternId}.repeating.params.gridParams.y`}
                        name={"y"}
                        value={gridParams.y}
                        range={repeatingRange}
                        valueD={repeatingValueD}
                        onChange={this.handleGridParamsChange}/>
                    <ButtonNumberCF
                        integer={gridParams.integer}
                        path={`patterns.${this.props.patternId}.repeating.params.gridParams.xOut`}
                        name={"xOut"}
                        value={gridParams.xOut}
                        range={repeatingOutRange}
                        valueD={repeatingValueD}
                        onChange={this.handleGridParamsChange}/>
                    <ButtonNumberCF
                        integer={gridParams.integer}
                        path={`patterns.${this.props.patternId}.repeating.params.gridParams.yOut`}
                        name={"yOut"}
                        value={gridParams.yOut}
                        range={repeatingOutRange}
                        valueD={repeatingValueD}
                        onChange={this.handleGridParamsChange}/>
                    <BezierCurve
                        xn={gridParams.x}
                        yn={gridParams.y}
                        value={gridParams.bezierPoints}
                        onChange={this.handleBezierChange}/>
                </>)}
            </div>
        );
    }
}