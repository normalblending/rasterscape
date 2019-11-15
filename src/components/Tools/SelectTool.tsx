import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {Params} from "../_shared/Params";
import {setSelectToolParams} from "../../store/selectTool/actions";
import {SelectToolParams} from "../../store/selectTool/types";

export interface SelectToolStateProps {
    paramsConfig: object
    paramsValue: object
}

export interface SelectToolActionProps {
    setSelectToolParams(params: SelectToolParams)
}

export interface SelectToolOwnProps {

}

export interface SelectToolProps extends SelectToolStateProps, SelectToolActionProps, SelectToolOwnProps {

}

const SelectToolComponent: React.FC<SelectToolProps> = ({paramsValue, paramsConfig, setSelectToolParams}) => {

    console.log(paramsConfig);
    return (
        <Params
            data={paramsConfig}
            value={paramsValue}
            onChange={setSelectToolParams}/>
    );
};

const mapStateToProps: MapStateToProps<SelectToolStateProps, SelectToolOwnProps, AppState> = state => ({
    paramsConfig: state.selectTool.paramsConfig,
    paramsValue: state.selectTool.params,
});

const mapDispatchToProps: MapDispatchToProps<SelectToolActionProps, SelectToolOwnProps> = {
    setSelectToolParams
};

export const SelectTool = connect<SelectToolStateProps, SelectToolActionProps, SelectToolOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(SelectToolComponent);