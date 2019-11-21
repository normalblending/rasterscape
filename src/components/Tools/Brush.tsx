import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {BrushParams} from "../../store/brush/types";
import {setBrushParams} from "../../store/brush/actions";
import {ParamConfig, Params} from "../_shared/Params";
import {ButtonNumberCF} from "../_shared/ButtonNumberCF";
import {ValueD} from "../_shared/ButtonNumber";

export interface BrushStateProps {
    paramsConfig: ParamConfig[]
    paramsValue: BrushParams
}

export interface BrushActionProps {
    setBrushParams(params: BrushParams)
}

export interface BrushOwnProps {

}

export interface BrushProps extends BrushStateProps, BrushActionProps, BrushOwnProps {

}

const sizeRange = [1, 200] as [number, number];
const sizeValueD = ValueD.VerticalLinear(.5);

class BrushComponent extends React.PureComponent<BrushProps> {

    handleSizeChange = ({value}) => {
        console.log(value);
        this.props.setBrushParams({
            ...this.props.paramsValue,
            size: value
        })
    };

    render() {

        const {paramsConfig, paramsValue, setBrushParams} = this.props;
        return (
            <>
                <ButtonNumberCF
                    value={paramsValue.size}
                    name={"size"}
                    onChange={this.handleSizeChange}
                    range={sizeRange}
                    valueD={sizeValueD}/>
                <Params
                    data={paramsConfig}
                    value={paramsValue}
                    onChange={setBrushParams}/>
            </>
        );
    }
}

const mapStateToProps: MapStateToProps<BrushStateProps, BrushOwnProps, AppState> = state => ({
    paramsConfig: state.brush.paramsConfig,
    paramsValue: state.brush.params,
});

const mapDispatchToProps: MapDispatchToProps<BrushActionProps, BrushOwnProps> = {
    setBrushParams
};

export const Brush = connect<BrushStateProps, BrushActionProps, BrushOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(BrushComponent);