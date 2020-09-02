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
    setStartValue,
    setValueInChangingList
} from "../../../store/changingValues/actions";
import {toStartValue} from "../../../store/change/actions";
import "../../../styles/buttonNumberCF.scss";
import {HoverHideable} from "../HoverHideable";
import {ShortcutInput} from "../ShortcutInput";
import {getChangeFunctionsSelectItemsNumber} from "../../../store/changeFunctions/selectors";
import {ChangeFunction, ECFType} from "../../../store/changeFunctions/types";
import {addHotkey} from "../../../store/hotkeys";
import {ChangingValue} from "../../../store/changingValues/types";
import {WithTranslation, withTranslation} from "react-i18next";
import {SelectButtonsEventData} from "./SelectButtons";
import {setCFHighlights, setCFTypeHighlights} from "../../../store/changeFunctionsHighlights";

export interface ButtonNumberCFStateProps {
    changeFunctionsSelectItems: SelectItem[]
    changeFunction: ChangeFunction
    changingValue: ChangingValue
    hotkey: string
    settingMode: boolean
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

    setCFHighlights(cfName?: string)

    setCFTypeHighlights(cfType?: ECFType[])
}

export interface ButtonNumberCFOwnProps extends ButtonNumberProps {
    path: string
    buttonWrapper?
}

export interface ButtonNumberCFProps extends ButtonNumberCFStateProps, ButtonNumberCFActionProps, ButtonNumberCFOwnProps, WithTranslation {

}

const availableCFTypes = [ECFType.FXY, ECFType.WAVE];

const ButtonNumberCFComponent: React.FunctionComponent<ButtonNumberCFProps> = React.memo((props) => {

    const {
        onChange,
        setStartValue, path, value,
        deactivateValueChanging,
        activateValueChanging,
        addHotkey,
        setValueInChangingList, range,
        setCFHighlights, setCFTypeHighlights,
        t,
        settingMode,
    } = props;

    const {
        changeFunction,
        changeFunctionsSelectItems,
        changingValue,
        // path,
        className,
        hotkey,
        buttonWrapper: ButtonWrapper,
        ...buttonNumberProps
    } = props;

    const {
        // onChange,
        onMouseDown,
        onMouseUp,
        onPress,
        onRelease,
        ...othersButtonNumberProps
    } = buttonNumberProps;
    //
    // React.useEffect(() => coordHelper2.writeln('changeFunctionsSelectItems'), [changeFunctionsSelectItems]);
    // React.useEffect(() => coordHelper2.writeln('changeFunction'), [changeFunction]);
    // React.useEffect(() => coordHelper2.writeln('changingValue'), [changingValue]);
    // React.useEffect(() => coordHelper2.writeln('hotkey'), [hotkey]);

    const [active, setActive] = React.useState();

    const handleCFChange = React.useCallback(({value: changeFunctionId}) => {

        setValueInChangingList(path, changeFunctionId, range, value);

    }, [setValueInChangingList, path, range, value]);

    const handleChange = React.useCallback((data) => {

        onChange(data);

        setStartValue(path, value);
    }, [onChange, setStartValue, path, value]);

    const handleStartManualChanging = React.useCallback(() => {
        deactivateValueChanging(path);
        setActive(true);
    }, [deactivateValueChanging, path]);

    const handleStopManualChanging = React.useCallback(() => {
        activateValueChanging(path);
        setActive(false);
        // console.log('-----------------------------------------',this);
    }, [activateValueChanging, path]);

    const handleShortcutChange = React.useCallback((shortcut, e) => {
        if (shortcut === null || shortcut.length === 1) {
            addHotkey(path, shortcut);
            // if (shortcut !== null)
            //     e.target.blur();
        }
    }, [addHotkey, path]);


    const handleCFMouseEnter = React.useCallback((data: SelectButtonsEventData) => {
        setCFHighlights(data?.value?.value);
    }, [setCFHighlights]);
    const handleCFMouseLeave = React.useCallback((data: SelectButtonsEventData) => {
        setCFHighlights(null);
    }, [setCFHighlights]);

    const handleCFValueMouseEnter = React.useCallback(() => {
        if (!changeFunctionsSelectItems.length)
            setCFTypeHighlights(availableCFTypes);
    }, [setCFTypeHighlights, changeFunctionsSelectItems]);
    const handleCFValueMouseLeave = React.useCallback(() => {
        setCFTypeHighlights(null);
    }, [setCFTypeHighlights]);


    // console.log("render b cf", buttonNumberProps.name, changeFunctionsSelectItems);

    const changingValueData = changingValue;
    const changingStartValue = changingValueData && changingValueData.startValue;
    const changeFunctionId = changingValueData && changingValue.changeFunctionId;
    const changingParams = changingValueData && changeFunction.params;
    const changingType = changingValueData && changeFunction.type;


    const buttonClassName = React.useMemo(() => classNames('button-number-cf-value', {
        ["button-number-cf-value-active"]: active
    }), [active]);

    const button = (
        <>
            <ButtonNumber
                {...othersButtonNumberProps}

                shortcut={hotkey}
                hotkeyDisabled={settingMode}

                className={buttonClassName}

                changeFunctionId={changeFunctionId}
                changeFunctionType={changingType}
                changingStartValue={changingStartValue}
                changeFunctionParams={changingParams}

                onChange={handleChange}
                onMouseDown={handleStartManualChanging}
                onPress={handleStartManualChanging}
                onMouseUp={handleStopManualChanging}
                onRelease={handleStopManualChanging}/>
            {settingMode && (
                <ShortcutInput
                    placeholder={t('buttonNumberCF.hotkey')}
                    value={hotkey}
                    onChange={handleShortcutChange}/>
            )}
        </>
    );

    const buttonElement = React.useMemo(() => ButtonWrapper ?
        <ButtonWrapper button={button}/> : button, [ButtonWrapper, button]);

    return (
        <HoverHideable
            className={classNames("button-number-cf", className)}
            button={buttonElement}>
            {!active && (
                <HoverHideable
                    className={"button-number-cf-settings"}
                    button={<div className="button-number-cf-settings-handler">
                        <div></div>
                    </div>}>
                    <SelectDrop
                        name={buttonNumberProps.name + '-select-cf'}
                        nullAble
                        nullText={'-'}
                        onValueMouseEnter={handleCFValueMouseEnter}
                        onValueMouseLeave={handleCFValueMouseLeave}
                        className={"button-number-cf-select"}
                        value={changingValue?.changeFunctionId}
                        onItemMouseEnter={handleCFMouseEnter}
                        onItemMouseLeave={handleCFMouseLeave}
                        onChange={handleCFChange}
                        items={changeFunctionsSelectItems}
                    />
                </HoverHideable>
            )}
        </HoverHideable>
    );

});

const mapStateToProps: MapStateToProps<ButtonNumberCFStateProps, ButtonNumberCFOwnProps, AppState> = (state, {path}) => ({
    changeFunctionsSelectItems: getChangeFunctionsSelectItemsNumber(state),
    changeFunction: state.changeFunctions.functions[state.changingValues[path]?.changeFunctionId],
    changingValue: state.changingValues[path],
    hotkey: state.hotkeys.keys[path],
    settingMode: state.hotkeys.setting,
});

const mapDispatchToProps: MapDispatchToProps<ButtonNumberCFActionProps, ButtonNumberCFOwnProps> = {
    setValueInChangingList,
    deactivateValueChanging,
    activateValueChanging,
    toStartValue,
    setStartValue,
    addHotkey,
    setCFHighlights,
    setCFTypeHighlights,
};

export const ButtonNumberCF = connect<ButtonNumberCFStateProps, ButtonNumberCFActionProps, ButtonNumberCFOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(ButtonNumberCFComponent));