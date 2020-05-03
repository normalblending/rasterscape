import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../../store";
import * as classNames from "classnames";
import {ButtonNumber, ButtonNumberProps} from "./ButtonNumber";
import {SelectItem} from "../../../utils/utils";
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
import {HoverHideable} from "../HoverHideable";
import {ShortcutInput} from "../ShortcutInput";
import {getChangeFunctionsSelectItemsNumber} from "../../../store/changeFunctions/selectors";
import {ChangeFunction} from "../../../store/changeFunctions/types";
import {addHotkey} from "../../../store/hotkeys";
import {HelpTooltip} from "../../tutorial/HelpTooltip";
import {HotkeyHelp} from "../../tutorial/tooltips/HotkeyHelp";
import {ChangeFunctionsHelp} from "../../tutorial/tooltips/ChangeFunctionHelp";

export interface ButtonNumberCFStateProps {
    changeFunctionsSelectItems: SelectItem[]
    changeFunction: ChangeFunction
    changingValues: ChangingValuesState
    hotkey: string
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

    addHotkey(path: string, value: string)
}

export interface ButtonNumberCFOwnProps extends ButtonNumberProps {
    path: string
    buttonWrapper?
}

export interface ButtonNumberCFProps extends ButtonNumberCFStateProps, ButtonNumberCFActionProps, ButtonNumberCFOwnProps {

}

export interface ButtonNumberCFState {
    active: boolean
    shortcut: string
}

class ButtonNumberCFComponent extends React.PureComponent<ButtonNumberCFProps, ButtonNumberCFState> {

    state = {
        active: false,
        shortcut: null
    };

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

    handleShortcutChange = (shortcut, e) => {
        if (shortcut === null || shortcut.length === 1) {
            this.props.addHotkey(this.props.path, shortcut);
            e.target.blur();
        }
    };

    render() {
        const {
            changeFunction,
            changeFunctionsSelectItems,
            changingValues,
            path,
            className,
            hotkey,
            buttonWrapper,
            ...buttonNumberProps
        } = this.props;

        const {
            onChange,
            onMouseDown,
            onMouseUp,
            onPress,
            onRelease,
            ...othersButtonNumberProps
        } = buttonNumberProps;

        console.log("render b cf", buttonNumberProps.name, changeFunctionsSelectItems);

        const changingValueData = changingValues[path];
        const changingStartValue = changingValueData && changingValueData.startValue;
        const changeFunctionId = changingValueData && changingValues[path].changeFunctionId;
        const changingParams = changingValueData && changeFunction.params;
        const changingType = changingValueData && changeFunction.type;

        const button = (
            <ButtonNumber
                {...othersButtonNumberProps}

                shortcut={hotkey}

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
        );

        return (
            <HoverHideable
                className={classNames("button-number-cf", className)}
                button={buttonWrapper ? buttonWrapper(button) : button}>
                {!this.state.active &&
                <HoverHideable
                    className={"button-number-cf-settings"}
                    button={<div className="button-number-cf-settings-handler">
                        <div></div>
                    </div>}>

                    <HelpTooltip component={HotkeyHelp}>
                        <ShortcutInput
                            placeholder={'hotkey'}
                            value={hotkey}
                            onChange={this.handleShortcutChange}/>
                    </HelpTooltip>

                    <HelpTooltip component={ChangeFunctionsHelp} componentProps={{path}}>
                        <SelectDrop
                            name={buttonNumberProps.name + '-select-cf'}
                            nullAble
                            className={"button-number-cf-select"}
                            value={changingValues[this.props.path] && changingValues[this.props.path].changeFunctionId}
                            onChange={this.handleCFChange}
                            items={changeFunctionsSelectItems}/>
                    </HelpTooltip>
                </HoverHideable>
                }
            </HoverHideable>
        );
    }
}

const mapStateToProps: MapStateToProps<ButtonNumberCFStateProps, ButtonNumberCFOwnProps, AppState> = (state, {path}) => ({
    changeFunctionsSelectItems: getChangeFunctionsSelectItemsNumber(state),
    changeFunction: state.changeFunctions.functions[state.changingValues[path]?.changeFunctionId],
    changingValues: state.changingValues,
    hotkey: state.hotkeys.keys[path],
});

const mapDispatchToProps: MapDispatchToProps<ButtonNumberCFActionProps, ButtonNumberCFOwnProps> = {
    setValueInChangingList, deactivateValueChanging, activateValueChanging, toStartValue, setStartValue, addHotkey
};

export const ButtonNumberCF = connect<ButtonNumberCFStateProps, ButtonNumberCFActionProps, ButtonNumberCFOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(ButtonNumberCFComponent);