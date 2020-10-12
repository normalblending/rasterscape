import * as React from "react";
import {RefObject} from "react";
import * as classNames from "classnames";
import {ButtonSelect} from "../../simple/ButtonSelect";
import {ButtonEventData} from "../../simple/Button";
import '../../../../../styles/selectButtonsStyles.scss';
import {ButtonHK} from "../../hotkeyed/ButtonHK";

export interface SelectButtonsEventData extends ButtonEventData {
    item: any
    items: any[]
}

export interface SelectButtonsProps {
    className?: string
    itemClassName?: (item?: any) => string
    name?: string
    items: any[]
    value?: any

    nullAble?: boolean

    br?: number
    width?: number

    onChange?(data?: SelectButtonsEventData)

    onBlur?()

    onFocus?()

    onItemClick?(data?: SelectButtonsEventData)

    onItemMouseEnter?(data?: SelectButtonsEventData)

    onItemMouseLeave?(data?: SelectButtonsEventData)

    getValue?(item?: any)

    getText?(item?: any)

    getHKLabel?(item?: any)

    HK?: boolean
    path?: string
    hkLabel?: string
    hkByValue?: boolean
}

export const defaultGetValue = (item) => item?.value;
export const defaultGetText = (item) => item?.text;

export interface SelectButtonsImperativeHandlers {
    focus(e?: any): boolean

    nextValue()

    prevValue()
}

export const SelectButtons = React.forwardRef<SelectButtonsImperativeHandlers, SelectButtonsProps>((props, ref) => {
    const {
        className,
        itemClassName,
        items,
        value,
        name,
        getValue = defaultGetValue,
        getText = defaultGetText,
        getHKLabel = defaultGetValue,
        br,
        width,
        onItemClick,
        onItemMouseEnter,
        onItemMouseLeave,
        HK = true,
        path,
        hkLabel,
        hkByValue = true,
        onChange,
        nullAble,
        onBlur,
        onFocus,
    } = props;


    const handleClick = React.useCallback(({value: item, selected, e}) => {
        let newValue = getValue(item);

        if (nullAble && value === newValue) {
            newValue = null
        }

        onChange && onChange({
            value: newValue,
            e, item, items, name
        });

        onItemClick?.({
            value: newValue,
            e, item, items, name
        });
    }, [onChange, onItemClick, name, items, getValue, nullAble, value]);


    const divRef = React.useRef<HTMLDivElement>(null);

    const timer = React.useRef(null);
    const handleFocus = React.useCallback(() => {
        timer.current && clearTimeout(timer.current);

        onFocus?.();
    }, [onFocus, timer.current]);

    const handleBlur = React.useCallback(() => {
        timer.current = setTimeout(() => {
            onBlur?.();
        }, 100);
    }, [onBlur, timer.current]);


    React.useImperativeHandle(ref, () => ({
        focus: () => {
            const selectedButton = divRef?.current.getElementsByClassName('button-select-selected')[0] as HTMLElement;

            if (selectedButton) {
                selectedButton.focus();

                return true;

            } else {
                const firstButton = divRef?.current.getElementsByClassName('button')[0] as HTMLElement;

                if (firstButton) {
                    firstButton.focus();
                    return true;
                } else {
                    return false;
                }
            }
        },
        nextValue: (e?) => {
            const currentValueIndex = items.findIndex((item) => getValue(item) === value);

            if (currentValueIndex === -1) {
                const item = items[0];
                let newValue = getValue(item);

                onChange && onChange({
                    value: newValue,
                    e, item, items, name
                });
            } else if (currentValueIndex < items.length - 1) {
                const item = items[currentValueIndex + 1];
                let newValue = getValue(item);

                onChange && onChange({
                    value: newValue,
                    e, item, items, name
                });
            } else if (currentValueIndex >= items.length - 1) {
                const item = items[0];
                let newValue = nullAble
                    ? null
                    : getValue(item);

                onChange && onChange({
                    value: newValue,
                    e, item, items, name
                });
            }
        },
        prevValue: (e?) => {
            const currentValueIndex = items.findIndex((item) => getValue(item) === value);

            if (currentValueIndex === -1) {
                const item = items[items.length - 1];
                let newValue = getValue(item);

                onChange && onChange({
                    value: newValue,
                    e, item, items, name
                });
            } else if (currentValueIndex === 0) {
                const item = items[items.length - 1];
                let newValue = nullAble
                    ? null
                    : getValue(item);

                onChange && onChange({
                    value: newValue,
                    e, item, items, name
                });
            } else if (currentValueIndex <= items.length - 1) {
                const item = items[currentValueIndex - 1];
                let newValue = getValue(item);

                onChange && onChange({
                    value: newValue,
                    e, item, items, name
                });
            }
        }
    }), [value, handleFocus, items, nullAble]);

    const ButtonComponent = HK ? ButtonHK : ButtonSelect;

    return (
        <div
            className={classNames(className, "select-buttons")}
            style={{width: br ? br * (+width || 70) : 'auto'}}
            ref={divRef}
        >
            <div className={"select-buttons-items"}>
                {items.map((item, index) => (
                    <ButtonComponent
                        className={itemClassName?.(item)}
                        path={`${path || name}.${getValue(item)}`}
                        hkLabel={hkByValue
                            ? `${hkLabel}.${getValue(item)}`
                            : hkLabel}
                        hkData1={item}
                        name={`${path || name}.${getValue(item)}`}
                        width={width}
                        value={item}
                        key={index}
                        selected={getValue(item) === value}
                        onMouseEnter={onItemMouseEnter}
                        onMouseLeave={onItemMouseLeave}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        onClick={handleClick}
                    >
                        {getText(item)}
                    </ButtonComponent>
                ))}
            </div>
        </div>
    );
});