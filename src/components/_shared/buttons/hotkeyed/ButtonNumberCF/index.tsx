import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "store";
import * as classNames from "classnames";
import {ButtonNumber, ButtonNumberProps} from "../../complex/ButtonNumber";
import {SelectItem} from "utils/utils";
import {SelectDrop, SelectDropImperativeHandlers} from "../../complex/SelectDrop";
import {
    activateValueChanging,
    deactivateValueChanging,
    setStartValue,
    setValueInChangingList
} from "store/changingValues/actions";
import {toStartValue} from "store/change/actions";
import "./styles.scss";
import {HoverHideable} from "../../../HoverHideable/HoverHideable";
import {ShortcutInput} from "../../../inputs/ShortcutInput";
import {getChangeFunctionsSelectItemsNumber} from "../../../../../store/changeFunctions/selectors";
import {ChangeFunction, ECFType} from "../../../../../store/changeFunctions/types";
import {addHotkey, HotkeyControlType, HotkeyValue} from "../../../../../store/hotkeys";
import {ChangingValue} from "../../../../../store/changingValues/types";
import {WithTranslation, withTranslation} from "react-i18next";
import {SelectButtonsEventData} from "../../complex/SelectButtons";
import {setCFHighlights, setCFTypeHighlights} from "../../../../../store/changeFunctionsHighlights";

export interface ButtonNumberCFStateProps {
    changeFunctionsSelectItems: SelectItem[]
    changeFunction: ChangeFunction
    changingValue: ChangingValue
    hotkey: HotkeyValue
    settingMode: boolean
    highlightedPath: string
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

    addHotkey: typeof addHotkey

    setCFHighlights(cfName?: string)

    setCFTypeHighlights(cfType?: ECFType[])
}

export interface ButtonNumberCFOwnProps extends ButtonNumberProps {
    path: string
    hkLabel?: string
    buttonWrapper?
    withoutCF?: boolean
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
        hkLabel,
        highlightedPath,
    } = props;

    const {
        changeFunction,
        changeFunctionsSelectItems,
        changingValue,
        // path,
        className,
        hotkey,
        buttonWrapper: ButtonWrapper,
        withoutCF,
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

    const selectDropRef = React.useRef<SelectDropImperativeHandlers>(null);

    const [_redOpen, setRedOpen] = React.useState(false);
    const [_menuOpen, setMenuOpen] = React.useState(false);

    const [active, setActive] = React.useState();

    const handleCFChange = React.useCallback(({value: changeFunctionId}) => {

        setValueInChangingList(path, changeFunctionId, range, value);

    }, [setValueInChangingList, path, range, value]);

    const handleChange = React.useCallback((data) => {

        onChange(data);

        setStartValue(path, value);
    }, [onChange, setStartValue, path, value]);

    const handleMouseDown = React.useCallback((e) => { //handleStartManualChanging
        deactivateValueChanging(path);
        setActive(true);
        onMouseDown?.(e);
    }, [deactivateValueChanging, path, onMouseDown]);

    const handleMouseUp = React.useCallback((e) => { //handleStopManualChanging
        activateValueChanging(path);
        setActive(false);
        onMouseUp?.(e);
    }, [activateValueChanging, path, onMouseUp]);

    const handlePress = React.useCallback((e) => { //handleStartManualChanging
        deactivateValueChanging(path);
        setActive(true);
        onPress?.(e);
    }, [deactivateValueChanging, path, onPress]);

    const handleRelease = React.useCallback((e) => { //handleStopManualChanging
        activateValueChanging(path);
        setActive(false);
        onRelease?.(e);
    }, [activateValueChanging, path, onRelease]);

    const handleShortcutChange = React.useCallback((shortcut) => {
        if (shortcut === null || shortcut.length === 1) {
            addHotkey(path, shortcut, HotkeyControlType.Number, hkLabel || path);
        }
    }, [addHotkey, path, hkLabel, path]);


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

    const buttonNumberRef = React.useRef(null);

    const button = (
        <>
            <ButtonNumber
                ref={buttonNumberRef}
                {...othersButtonNumberProps}

                shortcut={hotkey?.key}
                hotkeyDisabled={settingMode}

                className={buttonClassName}

                changeFunctionId={changeFunctionId}
                changeFunctionType={changingType}
                changingStartValue={changingStartValue}
                changeFunctionParams={changingParams}

                onChange={handleChange}

                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onPress={handlePress}
                onRelease={handleRelease}
            />
            {settingMode && (
                <ShortcutInput
                    placeholder={t('buttonNumberCF.hotkey')}
                    value={hotkey?.key}
                    onChange={handleShortcutChange}/>
            )}
            {!settingMode && hotkey?.key && (
                <div className={'hotkey-key'}>{hotkey?.key}</div>
            )}
        </>
    );

    const buttonElement = React.useMemo(() =>
        ButtonWrapper
            ? <ButtonWrapper button={button}/>
            : button,
        [ButtonWrapper, button]
    );

    const handleKeyPress = React.useCallback((e) => {
        if (e.key === 'Enter') {
            e.stopPropagation();
            setRedOpen(true);
            setMenuOpen(true);

            //это можно коментить чтобы не открывалось автоматм
            setTimeout(selectDropRef.current.focus, 0);
        }
    }, []);

    // const handleCFSelectDropFocus = React.useCallback(() => {
    //
    // }, []);
    const timer = React.useRef(null);
    const handleCFSelectDropBlur = React.useCallback(() => {
        console.log('SELECT DROP BLUR')
        setTimeout(() => {
             setRedOpen(false);
             setMenuOpen(false);
        }, 150)
        buttonNumberRef.current.focus();
    }, [setRedOpen, setMenuOpen]);
    //
    //
    //
    // const handleContainerFocus = React.useCallback(() => {
    //     setRedOpen(false);
    //     setMenuOpen(false);
    //
    // }, [setRedOpen, setMenuOpen]);
    //
    // const handleContainerBlur = React.useCallback(() => {
    //     setRedOpen(false);
    //     setMenuOpen(false);
    //
    // }, [setRedOpen, setMenuOpen]);





    return withoutCF ? <div className={classNames("button-number-cf", className)}>{buttonElement}</div> : (
        <HoverHideable
            open={_redOpen}
            onKeyPress={handleKeyPress}
            className={classNames("button-number-cf", {
                ['hotkey-highlighted']: highlightedPath === hotkey?.path
            }, className)}
            button={buttonElement}>
            {!active && (
                <HoverHideable
                    open={_menuOpen}
                    className={"button-number-cf-settings"}
                    button={<div className="button-number-cf-settings-handler">
                        <div></div>
                    </div>}>
                    <SelectDrop
                        ref={selectDropRef}
                        onBlur={handleCFSelectDropBlur}
                        // onFocus={}
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
    highlightedPath: state.hotkeys.highlightedPath,
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