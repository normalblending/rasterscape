import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {ButtonNumber, ButtonNumberProps} from "./ButtonNumber";
import {objectToSelectItems} from "../../utils/utils";
import {ChangeFunctionsState} from "../../store/changeFunctions/reducer";
import {Button} from "./Button";
import {SelectDrop} from "./SelectDrop";
import {setValueInChangingList} from "../../store/changingValues/actions";
import {ChangingValuesState} from "../../store/changingValues/reducer";

export interface ButtonNumberCFStateProps {
    changeFunctions: ChangeFunctionsState
    changingValues: ChangingValuesState
}

export interface ButtonNumberCFActionProps {
    setValueInChangingList(
        path: string,
        changeFunctionId: string,
        range: [number, number],
        startValue: number)
}

export interface ButtonNumberCFOwnProps extends ButtonNumberProps {
    path: string
}

export interface ButtonNumberCFProps extends ButtonNumberCFStateProps, ButtonNumberCFActionProps, ButtonNumberCFOwnProps {

}

export interface ButtonNumberCFState {
}

class ButtonNumberCFComponent extends React.PureComponent<ButtonNumberCFProps, ButtonNumberCFState> {

    handleCFChange = ({value: changeFunctionId}) => {
        const {setValueInChangingList, path, range, value} = this.props;
        setValueInChangingList(path, changeFunctionId, range, value);
    };

    handleCFReset = () => {
        const {setValueInChangingList, path, range, value} = this.props;
        setValueInChangingList(path, null, range, value);
    };

    handleChange = (...args) => {
        // тут надо менять старт валуе
        this.props.onChange(...args);
    };

    render() {
        const {changeFunctions, changingValues, onChange, ...buttonNumberProps} = this.props;
        console.log("render b cf");


        return (
            <>
                <ButtonNumber
                    {...buttonNumberProps}
                    onChange={this.handleChange}/>
                <SelectDrop
                    value={changingValues[this.props.path] && changingValues[this.props.path].changeFunctionId}
                    onChange={this.handleCFChange}
                    // todo вынести отсюда
                    items={objectToSelectItems(changeFunctions, ({id}) => id, ({id}) => id)}/>
                <Button onClick={this.handleCFReset}>0</Button>
            </>
        );
    }
}

const mapStateToProps: MapStateToProps<ButtonNumberCFStateProps, {}, AppState> = state => ({
    changeFunctions: state.changeFunctions,
    changingValues: state.changingValues
});

const mapDispatchToProps: MapDispatchToProps<ButtonNumberCFActionProps, ButtonNumberCFOwnProps> = {
    setValueInChangingList
};

export const ButtonNumberCF = connect<ButtonNumberCFStateProps, ButtonNumberCFActionProps, ButtonNumberCFOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(ButtonNumberCFComponent);