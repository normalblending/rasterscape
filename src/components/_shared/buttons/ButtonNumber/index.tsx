import * as React from "react";
import * as classNames from "classnames";
import {ButtonSelect, ButtonSelectProps, ButtonSelectEventData} from "../ButtonSelect";
import {Key} from "../../Key";
import {ECFType} from "../../../../store/changeFunctions/types";
import {getOffset} from "../../../../utils/offset";
import {LoopAmplitude} from "./LoopAmplitude";
import {ParaboloidAmplitude} from "./ParaboloidAmplitude";
import {SinAmplitude} from "./SinAmplitude";

const DEFAULT_WIDTH = 70;
const defaultGetText = value => value.toFixed(1);

export const ValueD = {
    VerticalLinear: (step: number) => (oldValue: any, dx: number, dy) => oldValue - dy / step,
};

const amplitudeComponent = {
    [ECFType.SIN]: SinAmplitude,
    [ECFType.LOOP]: LoopAmplitude,
    [ECFType.XY_PARABOLOID]: ParaboloidAmplitude,
};

export interface ButtonNumberEventData extends ButtonSelectEventData {
}

export interface ButtonNumberProps extends ButtonSelectProps {

    integer?: boolean

    width?: number
    precision?: number | ((value?: any) => number)

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
}

export class ButtonNumber extends React.Component<ButtonNumberProps, ButtonNumberState> {

    buttonRef;

    constructor(props) {
        super(props);

        const {range} = props;

        this.state = {
            value: props.value || range[0],
            startPoint: null,
            startValue: null,
        };

        this.buttonRef = React.createRef();

    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.value !== this.state.value
            || !!nextState.startPoint || !!this.state.startPoint
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

        onChange && onChange({e, value, name, selected});

        this.setState({value});
    };

    calculateOneStep = (value) => {
        const {precision = 100, range} = this.props;
        if (typeof precision === "function") {
            return (range[1] - range[0]) / precision(value)
        } else {
            return (range[1] - range[0]) / precision
        }
    };

    handleUp = (e) => {
        // //  modulation


        const {changingStartValue, onClick, onMouseUp, onChange, name, selected, width = DEFAULT_WIDTH, precision = 100, range} = this.props;
        let value = this.calcValue(e);



        const one = this.calculateOneStep(value);
        if (Math.abs(value - this.state.startValue) < one) {

            const {left} = getOffset(e.target);

            value = Math.min(Math.max(
                this.state.startValue + (left + width / 2 < e.pageX ? one : -one)
                , range[0]), range[1]);

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
        // console.log(this.state.startValue);
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
        const {value = 0, startValue, startPoint} = this.state;

        console.log("number button ", getText(value));


        const Amplitude = amplitudeComponent[changeFunctionType];


        return (
            <ButtonSelect
                {...otherProps}
                className={classNames("button-number", className, {
                    ["button-number-active"]: !!startValue,
                })}
                width={width}
                ref={this.buttonRef}
                onMouseDown={this.handleDown}>
                <div
                    className={"button-number-value"}
                    style={{width: (value - range[0]) / (range[1] - range[0]) * 100 + "%"}}>
                    {getText ? getText(value) : text}
                </div>

                {changeFunctionId &&
                <Amplitude
                    changing={!!startPoint}
                    range={range}
                    buttonWidth={width}
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

