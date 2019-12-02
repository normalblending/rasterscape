import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {ChangeFunctionsState} from "../../store/changeFunctions/reducer";
import {addCF, changeCFParams} from "../../store/changeFunctions/actions";
import {SinCF} from "./SinCF";
import {ECFType} from "../../store/changeFunctions/types";
import {Button} from "../_shared/Button";
import {startChanging, stopChanging} from "../../store/changing/actions";

export interface ChangeFStateProps {
    cfs: ChangeFunctionsState
}

export interface ChangeFActionProps {
    changeCFParams(id: string, params: any)
    addCF(cfType: ECFType)
    startChanging()
    stopChanging()
}

export interface ChangeFOwnProps {

}

export interface ChangeFProps extends ChangeFStateProps, ChangeFActionProps, ChangeFOwnProps {

}

export interface ChangeFState {

}

const CFComponentByType = {
    [ECFType.SIN]: SinCF
};

class ChangeFComponent extends React.PureComponent<ChangeFProps, ChangeFState> {

    handleChange = (value, name) => {
        this.props.changeCFParams(name, value);
    };

    handleAddSin = () => {
        this.props.addCF(ECFType.SIN);
    };

    handleStartChange = () => {
        this.props.startChanging();
    };

    handleStopChange = () => {
        this.props.stopChanging();
    };

    render() {
        const {cfs} = this.props;
        return (
            <div>
                {Object.values(cfs).map(cf => {
                    const {type, id, params, paramsConfig} = cf;
                    const Component = CFComponentByType[type];
                    return (
                        <Component
                            key={id}
                            name={id}
                            params={params}
                            paramsConfig={paramsConfig}
                            onChange={this.handleChange}/>);
                })}
                <Button onClick={this.handleAddSin}>sin</Button>
                <Button onClick={this.handleStartChange}>start</Button>
                <Button onClick={this.handleStopChange}>stop</Button>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<ChangeFStateProps, {}, AppState> = state => ({
    cfs: state.changeFunctions
});

const mapDispatchToProps: MapDispatchToProps<ChangeFActionProps, ChangeFOwnProps> = {
    changeCFParams, addCF, startChanging, stopChanging
};

export const ChangeF = connect<ChangeFStateProps, ChangeFActionProps, ChangeFOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(ChangeFComponent);