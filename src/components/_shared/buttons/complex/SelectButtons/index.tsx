import * as React from "react";
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
    name?: string
    items: any[]
    value?: any

    nullAble?: boolean

    br?: number
    width?: number

    onChange?(data?: SelectButtonsEventData)

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

export class SelectButtons extends React.PureComponent<SelectButtonsProps> {


    handleClick = ({value: item, selected, e}) => {
        const {name, items, onChange, getValue = defaultGetValue, nullAble, value: oldValue} = this.props;
        let value = getValue(item);

        if (nullAble && oldValue === value) {
            value = null
        }

        onChange && onChange({
            value,
            e, item, items, name
        });
    };

    render() {
        const {
            className,
            items,
            value,
            name,
            getValue = defaultGetValue,
            getText = defaultGetText,
            getHKLabel = defaultGetValue,
            br,
            width,
            onItemMouseEnter,
            onItemMouseLeave,
            HK = true,
            path,
            hkLabel,
            hkByValue = true,
        } = this.props;

        const ButtonComponent = HK ? ButtonHK : ButtonSelect;

        return (
            <div className={classNames(className, "select-buttons")} style={{width: br ? br * (+width || 70) : 'auto'}}>
                <div className={"select-buttons-items"}>
                    {items.map((item, index) => (
                        <ButtonComponent
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

                            onClick={this.handleClick}>
                            {getText(item)}
                        </ButtonComponent>
                    ))}
                </div>
            </div>
        );
    }
}