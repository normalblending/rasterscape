import * as React from "react";
import "../../../styles/fxyChangeFunction.scss";
import {ValueD} from "../../_shared/buttons/ButtonNumber";
import {HelpTooltip} from "../../tutorial/HelpTooltip";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {changeCFParams} from "../../../store/changeFunctions/actions";
import {AppState} from "../../../store";
import {AnyFxyParams, FxyParams, FxyType} from "../../../store/changeFunctions/functions/fxy";
import {ParabCF} from "./Parab";
import {SelectDrop} from "bbuutoonnss";
import {arrayToSelectItems} from "../../../utils/utils";

// import {FxyHelp} from "../tutorial/tooltips/FxyHelp";

export interface FxyCFStateProps {

    tutorial: boolean
    params: FxyParams
}

export interface FxyCFActionProps {
    onChange(name: string, value: FxyParams)

}

export interface FxyCFOwnProps {
    name: string
}

export interface FxyCFProps extends FxyCFStateProps, FxyCFActionProps, FxyCFOwnProps {

}

export interface FxyCFState {

}

const aRange = [0, 1] as [number, number];
const aVD = ValueD.VerticalLinear(100);

const tRange = [0, 40000] as [number, number];

const oRange = [0, 1] as [number, number];
const oVD = ValueD.VerticalLinear(100);

const valueText2 = value => value.toFixed(2);

export class FxyCFComponent extends React.PureComponent<FxyCFProps, FxyCFState> {

    handleParamChange = (value: AnyFxyParams) => {
        const {onChange, params, name} = this.props;
        onChange(name, {
            ...params,
            typeParams: {
                ...params.typeParams,
                [params.type]: value,
            }
        })
    };

    handleTypeChange = ({value}) => {
        const {onChange, params, name} = this.props;
        onChange(name, {
            ...params,
            type: value
        });
    };

    buttonWrapper = (message) => {
        const {name, tutorial} = this.props;
        return tutorial ? button => (
            <HelpTooltip
                // componentProps={{name}}
                // getY={() => 27}
                // offsetX={25}
                message={message}
            >{button}</HelpTooltip>) : null
    };

    fxyComponentsByType = {
        [FxyType.Parab]: ParabCF,
    };
    selectItems = arrayToSelectItems([FxyType.Parab]);


    render() {
        const {params, name, tutorial} = this.props;

        const FxyComponent = this.fxyComponentsByType[params.type];
        return (
            // <HelpTooltip component={FxyHelp} getY={() => 27} offsetX={40}>
            <div className={"fxy-change-function"}>
                <SelectDrop
                    className={'select-type'}
                    value={params.type}
                    onChange={this.handleTypeChange}
                    items={this.selectItems}/>
                {FxyComponent &&
                <FxyComponent
                    name={name}
                    tutorial={tutorial}
                    params={params.typeParams[params.type]}
                    onChange={this.handleParamChange}
                />}
            </div>
            // </HelpTooltip>
        );
    }
}

const mapStateToProps: MapStateToProps<FxyCFStateProps, FxyCFOwnProps, AppState> = (state, {name}) => ({
    params: state.changeFunctions.functions[name].params,
    tutorial: state.tutorial.on
});

const mapDispatchToProps: MapDispatchToProps<FxyCFActionProps, FxyCFOwnProps> = {
    onChange: changeCFParams
};

export const FxyCF = connect<FxyCFStateProps, FxyCFActionProps, FxyCFOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(FxyCFComponent);
