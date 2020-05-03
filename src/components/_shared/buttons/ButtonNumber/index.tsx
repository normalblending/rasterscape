import * as React from "react";
import * as classNames from "classnames";
import {ButtonSelect, ButtonSelectProps, ButtonSelectEventData} from "../ButtonSelect";
import {Key} from "../../Key";
import {ECFType} from "../../../../store/changeFunctions/types";
import {getOffset} from "../../../../utils/offset";
import {LoopAmplitude} from "./LoopAmplitude";
import {ParaboloidAmplitude} from "./ParaboloidAmplitude";
import {SinAmplitude} from "./SinAmplitude";
import '../../../../styles/buttonNumber.scss';
import {startPoint} from "./startPoint";
import {coordHelper} from "../../../Area/canvasPosition.servise";
import {WaveType} from "../../../../store/changeFunctions/functions/wave";
import {FxyType} from "../../../../store/changeFunctions/functions/fxy";

const DEFAULT_WIDTH = 70;

const dd = (x, y) => (-x + y) / Math.sqrt(2);
export const ValueD = {
    VerticalLinear: (step: number) => {
        return (oldValue: any, dx: number, dy: number) => {

            const d = dd(dx, dy);
            return oldValue - d / step
        }
    },
};

const amplitudeComponent = {
    [WaveType.Sin]: SinAmplitude,
    [WaveType.Saw]: LoopAmplitude,
    [FxyType.Parab]: ParaboloidAmplitude,
};

export interface ButtonNumberEventData extends ButtonSelectEventData {
}

export interface ButtonNumberProps extends ButtonSelectProps {

    integer?: boolean

    width?: number
    pres?: number
    precision?: number | ((value?: any) => number)
    precisionGain?: number

    text?: string

    getText?(value?: any): string

    range?: [number, number]

    shortcut?: string | string[]


    valueD?: ((oldValue: any, dx: number, dy: number) => any) | number

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


        startPoint.set(e.clientX, e.clientY);

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
        const {pres = 0} = this.props;
        return Math.pow(10, -pres);
    };

    handleUp = (e) => {
        // //  modulation

        startPoint.hide();

        const {
            changingStartValue,
            onClick,
            onMouseUp,
            onChange,
            name,
            selected,
            width = DEFAULT_WIDTH,
            precisionGain = 2,
            range
        } = this.props;
        let value = this.calcValue(e);


        const one = this.calculateOneStep(value);
        const d = Math.abs(value - this.state.startValue);
        if (d < one) {

            const {left} = getOffset(e.target);

            const increment = (left + width / 2) < e.pageX
                ? ((left + width * 3 / 4) < e.pageX ? (precisionGain * one) : one)
                : ((left + width / 4) < e.pageX ? -one : (-precisionGain * one));

            value = Math.min(Math.max(
                this.state.startValue + increment
                , range[0]), range[1]);

            onChange && onChange({e, value, name, selected});
        } else {
            onClick && onClick({value, name, e, selected});
        }

        onMouseUp && onMouseUp({e, value, name, selected});


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
            startPoint.set(e.clientX, e.clientY);
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

        startPoint.hide();

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
        const {range, integer} = this.props;
        let valueD = this.props.valueD;

        if (!valueD) {
            valueD = ValueD.VerticalLinear(5)
        } else if (typeof valueD === 'number') {
            valueD = ValueD.VerticalLinear(valueD);
        }

        let nextValue = valueD(this.state.startValue, e.clientX - this.state.startPoint[0], e.clientY - this.state.startPoint[1]);
        nextValue = Math.min(Math.max(nextValue, range[0]), range[1]);

        if (integer) {
            nextValue = Math.round(nextValue);
        }
        return nextValue;
    };

    getText = (value) => {
        const {getText, pres} = this.props;
        return (getText || (value => value.toFixed(pres)))(value);
    };

    render() {
        const {changingStartValue, changeFunctionId, changeFunctionType, changeFunctionParams, range, width = DEFAULT_WIDTH, className, text, shortcut, ...otherProps} = this.props;
        const {value = 0, startValue, startPoint} = this.state;


        const Amplitude = amplitudeComponent[changeFunctionParams?.type || changeFunctionType];

        const amplitudeParams = changeFunctionParams?.type
            ? changeFunctionParams.typeParams[changeFunctionParams.type]
            : changeFunctionParams;


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
                    {this.getText(value)}
                </div>

                {changeFunctionId && Amplitude &&
                <Amplitude
                    changing={!!startPoint}
                    range={range}
                    buttonWidth={width}
                    params={amplitudeParams}
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

