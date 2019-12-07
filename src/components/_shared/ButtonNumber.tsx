import * as React from "react";
import * as classNames from "classnames";
import {ButtonSelect, ButtonSelectProps, ButtonSelectEventData} from "./ButtonSelect";
import {Key} from "./Key";
import {mousePositionElement} from "../../utils/mouse";
import {range} from "d3-array";
import {ECFType} from "../../store/changeFunctions/types";

const DEFAULT_WIDTH = 70;
const defaultGetText = value => value.toFixed(1);

export const ValueD = {
    VerticalLinear: (step: number) => (oldValue: any, dx: number, dy) => oldValue - dy / step,
};

export interface ButtonNumberEventData extends ButtonSelectEventData {
}

export interface ButtonNumberProps extends ButtonSelectProps {

    integer?: boolean

    width?: number
    precision?: number

    text?: string

    getText?(value?: any): string

    range?: [number, number]

    shortcut?: string | string[]


    valueD?(oldValue: any, dx: number, dy: number): any

    onChange?(data?: ButtonNumberEventData)

    onMouseDown?(data?: ButtonNumberEventData)

    onMouseUp?(data?: ButtonNumberEventData)

    onClick?(data?: ButtonNumberEventData)

    onPress?(data?: ButtonNumberEventData)

    onRelease?(data?: ButtonNumberEventData)


    changeFunctionId?: string
    changeFunctionType?: ECFType
    changingStartValue?: number
    changeFunctionParams?: any

}

export interface ButtonNumberState {
    value?: any
    startPoint: [number, number]
    startValue?: any
    changing: boolean
}

export class ButtonNumber extends React.Component<ButtonNumberProps, ButtonNumberState> {

    constructor(props) {
        super(props);

        const {range} = props;

        this.state = {
            value: props.value || range[0],
            startPoint: null,
            startValue: null,
            changing: false,
        };


    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.value !== this.state.value
            || nextProps.changingStartValue !== this.props.changingStartValue
            || nextProps.changeFunctionParams !== this.props.changeFunctionParams
            || nextProps.changeFunctionId !== this.props.changeFunctionId
            || nextProps.shortcut !== this.props.shortcut
            || nextProps.className !== this.props.className;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            ...(!prevState.startPoint && nextProps.value !== prevState.value ? {
                value: nextProps.value
            } : {}),
        };
    }

    handleDown = data => {

        console.log("down");


        if (this.state.startValue) {
            return;
        }

        const {e} = data;
        e.persist();

        const {onMouseDown, name, selected} = this.props;
        const {value} = this.state;

        onMouseDown && onMouseDown({e, value, name, selected});

        this.setState(({value}) => ({
            startValue: value,
            startPoint: [e.clientX, e.clientY]
        }), () => {
            document.addEventListener("mousemove", this.handleMove);
            document.addEventListener("mouseup", this.handleUp);
        });
    };

    handleMove = e => {
        const {onChange, name, selected} = this.props;
        const value = this.calcValue(e);


        console.log("move", value);

        onChange && onChange({e, value, name, selected});

        this.setState({value});
    };


    handleUp = (e) => {
        // //  modulation


        const {changingStartValue, onClick, onMouseUp, onChange, name, selected, width = DEFAULT_WIDTH, precision = 100, range} = this.props;
        let value = this.calcValue(e);


        const one = (range[1] - range[0]) / precision;
//!changingStartValue &&
        if (Math.abs(value - this.state.startValue) < one) {

            const y = mousePositionElement(e).x;
            console.log("11111", y, width / 2, this.state.startValue);
            value = Math.min(Math.max(
                this.state.startValue + (y > width / 2 ? one : -one)
                , range[0]), range[1]);

            console.log(value, "=", this.state.startValue, "+", (y > width / 2 ? 1 : -1));
            onChange && onChange({e, value, name, selected});
        } else {
            onMouseUp && onMouseUp({e, value, name, selected});

            onClick && onClick({value, name, e, selected});

        }


        this.setState({
            value,
            startValue: null,
            startPoint: null
        }, () => {
            document.removeEventListener("mousemove", this.handleMove);
            document.removeEventListener("mouseup", this.handleUp);
        });


    };


    handlePress = e => {
        if (this.state.startValue) {
            return;
        }

        const {onPress, name, selected} = this.props;
        const {value} = this.state;

        onPress && onPress({e, value, name, selected});

        this.setState(({value}) => ({
            startValue: value,
            startPoint: null
        }), () => {
            document.addEventListener("mousemove", this.handlePressed);
        });
    };

    handlePressed = e => {
        if (!this.state.startPoint) {
            this.setState({
                startPoint: [e.clientX, e.clientY]
            });
        } else {
            const {onChange, name, selected} = this.props;
            const value = this.calcValue(e);

            onChange && onChange({e, value, name, selected});

            this.setState({value});
        }
    };

    handleRelease = e => {
        const {onRelease, name, selected} = this.props;
        const {value} = this.state;

        onRelease && onRelease({value, name, e, selected});

        this.setState({
            value,
            startValue: null,
            startPoint: null
        }, () => {
            document.removeEventListener("mousemove", this.handlePressed);
        });
    };

    calcValue = e => {
        console.log(this.state.startValue);
        const {range, valueD = ValueD.VerticalLinear(5), integer} = this.props;

        let nextValue = valueD(this.state.startValue, e.clientX - this.state.startPoint[0], e.clientY - this.state.startPoint[1]);
        nextValue = Math.min(Math.max(nextValue, range[0]), range[1]);

        if (integer) {
            nextValue = Math.round(nextValue);
        }
        return nextValue;
    };

    render() {
        const {changingStartValue, changeFunctionId, changeFunctionType, changeFunctionParams, range, width = DEFAULT_WIDTH, className, getText = defaultGetText, text, shortcut, ...otherProps} = this.props;
        const {value = 0, startValue} = this.state;

        console.log("number button render", getText(value));


        const Amplitude = amplitudeComponent[changeFunctionType];


        return (
            <ButtonSelect
                {...otherProps}
                className={classNames("button-number", className, {
                    ["button-number-active"]: !!startValue,
                })}
                width={width}
                onMouseDown={this.handleDown}>
                <div
                    className={"button-number-value"}
                    style={{width: (value - range[0]) / (range[1] - range[0]) * 100 + "%"}}>
                    {getText ? getText(value) : text}
                </div>

                {changeFunctionId &&
                <Amplitude
                    range={range}
                    params={changeFunctionParams}
                    changingStartValue={changingStartValue}
                    changeFunctionId={changeFunctionId}/>}

                {shortcut &&
                <Key
                    keys={shortcut}
                    onPress={this.handlePress}
                    onRelease={this.handleRelease}/>}
            </ButtonSelect>
        );
    }
}

const amplitudeComponent = {
    [ECFType.SIN]: ({range, params, changingStartValue, changeFunctionId}) => {
        const startVPerc = (changingStartValue / (range[1] - range[0]));

        const ampWidth = (Math.min(startVPerc, params.a) + Math.min(1 - startVPerc, params.a));

        return (
            <div
                className={"button-number-amplitude"}
                style={{
                    width: ampWidth * 100 + "%",
                    left: `calc(${(Math.max(startVPerc - params.a, 0)) * 100}%)`
                }}>
                    <span>
                    {changeFunctionId}
                    </span>
            </div>
        );
    },
    [ECFType.LOOP]: ({range, params, changingStartValue, changeFunctionId}) => {

        return (
            <div
                className={"button-number-amplitude"}
                style={{
                    width: (params.end - params.start) * 100 + "%",
                    left: `${params.start * 100}%`
                }}>
                    <span>
                    {changeFunctionId}
                    </span>
            </div>
        );
    },
};