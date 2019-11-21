import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {ButtonNumber, ButtonNumberProps} from "./ButtonNumber";
import {SelectButtons} from "./SelectButtons";
import {objectToSelectItems} from "../../utils/utils";
import {ChangeFunctionsState} from "../../store/changeFunctions/reducer";
import {changeFunctionByType} from "../../store/changeFunctions/helpers";
import {Button} from "./Button";

export interface ButtonNumberCFStateProps {
    cfs: ChangeFunctionsState
    changing: boolean
}

export interface ButtonNumberCFActionProps {
}

export interface ButtonNumberCFOwnProps extends ButtonNumberProps {

}

export interface ButtonNumberCFProps extends ButtonNumberCFStateProps, ButtonNumberCFActionProps, ButtonNumberCFOwnProps {

}

export interface ButtonNumberCFState {
    cfId: string

}

class ButtonNumberCFComponent extends React.PureComponent<ButtonNumberCFProps, ButtonNumberCFState> {

    state = {
        cfId: null
    };

    handleCFChange = ({value}) => {
        this.setState({cfId: value});
    };

    handleCFReset = () => {
        this.setState({cfId: null});
    };

    render() {
        const {cfs, changing, ...bnProps} = this.props;
        console.log("render b cf", changing);
        const cf = cfs[this.state.cfId];


        return (
            <>
                <ButtonNumber
                    {...bnProps}
                    isChanging={changing}
                    changeFunctionParams={cf ? cf.params : null}
                    changeFunction={cf ? changeFunctionByType[cf.type] : null}/>
                <SelectButtons
                    value={this.state.cfId}
                    onChange={this.handleCFChange}
                    items={objectToSelectItems(cfs, ({id}) => id, ({id}) => id)}/>
                <Button onClick={this.handleCFReset}>0</Button>
            </>
        );
    }
}

const mapStateToProps: MapStateToProps<ButtonNumberCFStateProps, {}, AppState> = state => ({
    cfs: state.changeFunctions,
    changing: state.changing
});

const mapDispatchToProps: MapDispatchToProps<ButtonNumberCFActionProps, ButtonNumberCFOwnProps> = {};

export const ButtonNumberCF = connect<ButtonNumberCFStateProps, ButtonNumberCFActionProps, ButtonNumberCFOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(ButtonNumberCFComponent);