import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../../store";
import * as classNames from "classnames";
import {ButtonNumber, ButtonNumberProps} from "./ButtonNumber";
import {objectToSelectItems} from "../../../utils/utils";
import {ChangeFunctionsState} from "../../../store/changeFunctions/reducer";
import {Button} from "./Button";
import {SelectDrop} from "./SelectDrop";
import {
    activateValueChanging,
    deactivateValueChanging,
    setValueInChangingList,
    setStartValue
} from "../../../store/changingValues/actions";
import {ChangingValuesState} from "../../../store/changingValues/reducer";
import {toStartValue} from "../../../store/change/actions";
import "../../../styles/buttonNumberCF.scss";
import {SelectButtons} from "./SelectButtons";
import {HoverHideable} from "../HoverHideable";
import {ShortcutInput} from "../ShortcutInput";

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

    deactivateValueChanging(path: string)

    activateValueChanging(path: string)

    toStartValue(path: string)

    setStartValue(path: string, startValue: number)
}

export interface ButtonNumberCFOwnProps extends ButtonNumberProps {
    path: string
}

export interface ButtonNumberCFProps extends ButtonNumberCFStateProps, ButtonNumberCFActionProps, ButtonNumberCFOwnProps {

}

export interface ButtonNumberCFState {
    changeFunctionsItems: any[],
    changeFunctions: ChangeFunctionsState
    active: boolean
    shortcut: string
}

class ButtonNumberCFComponent extends React.PureComponent<ButtonNumberCFProps, ButtonNumberCFState> {

    state = {
        changeFunctionsItems: [],
        changeFunctions: null,
        active: false,
        shortcut: null
    };

    static getDerivedStateFromProps(props, state) {
        if (props.changeFunctions !== state.changeFunctions) {
            return {
                changeFunctions: props.changeFunctions,
                changeFunctionsItems: objectToSelectItems(props.changeFunctions, ({id}) => id, ({id}) => id)
            }
        }
        return null;
    }

    handleCFChange = ({value: changeFunctionId}) => {
        const {setValueInChangingList, path, range, value} = this.props;
        setValueInChangingList(path, changeFunctionId, range, value);
    };

    handleChange = (data) => {

        this.props.onChange(data);

        const {setStartValue, path, value} = this.props;
        setStartValue(path, value);
    };

    handleStartManualChanging = () => {
        const {deactivateValueChanging, path} = this.props;
        deactivateValueChanging(path);
        this.setState({active: true});
    };

    handleStopManualChanging = () => {
        const {activateValueChanging, path} = this.props;
        activateValueChanging(path);
        this.setState({active: false});
    };

    handleShortcutChange = shortcut => this.setState({shortcut});

    render() {
        const {changeFunctions, changingValues, path, className, ...buttonNumberProps} = this.props;

        const {onChange, onMouseDown, onMouseUp, onPress, onRelease, ...othersButtonNumberProps} = buttonNumberProps;

        console.log("render b cf");

        const changingValueData = changingValues[path];
        const changingStartValue = changingValueData && changingValueData.startValue;
        const changeFunctionId = changingValueData && changingValues[path].changeFunctionId;
        const changingParams = changingValueData && changeFunctions[changeFunctionId].params;
        const changingType = changingValueData && changeFunctions[changeFunctionId].type;

        return (
            <HoverHideable
                className={classNames("button-number-cf", className)}
                button={
                    <ButtonNumber
                        {...othersButtonNumberProps}

                        shortcut={this.state.shortcut}

                        className={classNames('button-number-cf-value', {
                            ["button-number-cf-value-active"]: this.state.active
                        })}

                        changeFunctionId={changeFunctionId}
                        changeFunctionType={changingType}
                        changingStartValue={changingStartValue}
                        changeFunctionParams={changingParams}

                        onChange={this.handleChange}
                        onMouseDown={this.handleStartManualChanging}
                        onPress={this.handleStartManualChanging}
                        onMouseUp={this.handleStopManualChanging}
                        onRelease={this.handleStopManualChanging}/>
                }>
                {!this.state.active &&
                <HoverHideable
                    className={"button-number-cf-settings"}
                    button={<div className="button-number-cf-settings-handler"><div></div></div>}>

                    <ShortcutInput
                        placeholder={'hotkey'}
                        value={this.state.shortcut}
                        onChange={this.handleShortcutChange}/>
                    <SelectDrop
                        nullAble
                        className={"button-number-cf-select"}
                        value={changingValues[this.props.path] && changingValues[this.props.path].changeFunctionId}
                        onChange={this.handleCFChange}
                        items={this.state.changeFunctionsItems}/>
                </HoverHideable>
                }
            </HoverHideable>
        );
    }
}

const mapStateToProps: MapStateToProps<ButtonNumberCFStateProps, {}, AppState> = state => ({
    changeFunctions: state.changeFunctions,
    changingValues: state.changingValues
});

const mapDispatchToProps: MapDispatchToProps<ButtonNumberCFActionProps, ButtonNumberCFOwnProps> = {
    setValueInChangingList, deactivateValueChanging, activateValueChanging, toStartValue, setStartValue
};

export const ButtonNumberCF = connect<ButtonNumberCFStateProps, ButtonNumberCFActionProps, ButtonNumberCFOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(ButtonNumberCFComponent);