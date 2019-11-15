import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {ParamConfig, Params} from "../_shared/Params";
import {LineParams} from "../../store/line/types";
import {setLineParams} from "../../store/line/actions";

export interface LineStateProps {
    paramsConfig: ParamConfig[]
    paramsValue: LineParams
}

export interface LineActionProps {
    setLineParams(params: LineParams)
}

export interface LineOwnProps {

}

export interface LineProps extends LineStateProps, LineActionProps, LineOwnProps {

}

const LineComponent: React.FC<LineProps> = ({paramsConfig, paramsValue, setLineParams}) => {

    return (
        <Params
            data={paramsConfig}
            value={paramsValue}
            onChange={setLineParams}/>
    );
};

const mapStateToProps: MapStateToProps<LineStateProps, LineOwnProps, AppState> = state => ({
    paramsConfig: state.line.paramsConfig,
    paramsValue: state.line.params,
});

const mapDispatchToProps: MapDispatchToProps<LineActionProps, LineOwnProps> = {
    setLineParams
};

export const Line = connect<LineStateProps, LineActionProps, LineOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(LineComponent);