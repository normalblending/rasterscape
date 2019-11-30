import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store/index";
import {ChangeFunctionsState} from "../../store/changeFunctions/reducer";
import {addCF, changeCFParams} from "../../store/changeFunctions/actions";
import {SinCF} from "./SinCF";
import {ECFType} from "../../store/changeFunctions/types";
import {Button} from "../_shared/Button";

export interface ChangeFStateProps {
    cfs: ChangeFunctionsState
}

export interface ChangeFActionProps {
    changeCFParams(id: string, params: any)
    addCF(cfType: ECFType)
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

    render() {
        const {cfs} = this.props;
        return (
            <>
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
            </>
        );
    }
}

const mapStateToProps: MapStateToProps<ChangeFStateProps, {}, AppState> = state => ({
    cfs: state.changeFunctions
});

const mapDispatchToProps: MapDispatchToProps<ChangeFActionProps, ChangeFOwnProps> = {
    changeCFParams, addCF
};

export const ChangeF = connect<ChangeFStateProps, ChangeFActionProps, ChangeFOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(ChangeFComponent);