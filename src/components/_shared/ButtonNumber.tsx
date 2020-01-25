import * as React from "react";
import * as classNames from "classnames";
import {ButtonSelect, ButtonSelectProps, ButtonSelectEventData} from "./ButtonSelect";
import {Key} from "./Key";
import {mousePositionElement} from "../../utils/mouse";
import {range} from "d3-array";
import {ECFType} from "../../store/changeFunctions/types";
import {Canvas} from "./Canvas";
import {createCanvas} from "../../utils/canvas/canvas";
import {coordHelper} from "../Area/canvasPosition.servise";
import {getOffset} from "../../utils/offset";

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
        const {value = 0, startValue, startPoint} = this.state;

        console.log("number button render", getText(value));


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

const amplitudeComponent = {
    [ECFType.SIN]: ({range, params, changingStartValue, changeFunctionId, changing, buttonWidth}) => {
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
    [ECFType.LOOP]: ({range, params, changingStartValue, changeFunctionId, changing, buttonWidth}) => {

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
    [ECFType.XY]: (props) => {
        const {range, params, changingStartValue, changeFunctionId, changing, buttonWidth} = props;


        const ampWidth = params.end * (1 - (changingStartValue - range[0]) / (range[1] - range[0]));

        const startVPerc = (changingStartValue  - range[0])/ (range[1] - range[0]);

        // console.log(props);
        const width = Math.round(buttonWidth * ampWidth);

        if (width <= 1) {
            return (
                <div
                    style={{
                        width: ampWidth * 100 + "%",
                        left: `${startVPerc * 100}%`
                    }}
                    className={classNames("button-number-xy-amplitude", {["button-number-xy-amplitude-changing"]: changing})}>
                    <span>{changeFunctionId}</span>
                </div>);
        }

        const height = 20;
        const {canvas, context} = createCanvas(width, height);
        const imageData = context.getImageData(0, 0, width, height);

        const cf = (x, y) => {
            return ((params, range, pattern) =>
                (startValue, time, position) => {
                    const {x: X, y: Y, c: C, xa, ya, start, end} = params;
                    // console.log(params, range);
                    const z = Math.pow(position.x - pattern.current.width / 2, 2) / X * xa
                        + Math.pow(position.y - pattern.current.height / 2, 2) * ya / Y;

                    const m = Math.pow(-pattern.current.width / 2, 2) / X * xa
                        + Math.pow(-pattern.current.height / 2, 2) * ya / Y;


                    const startValueNormalized = startValue / (range[1] - range[0]);
                    return Math.max(
                        Math.min(
                            (+z / m * (1 - startValueNormalized)) * (range[1] - range[0]) + startValue,
                            range[1]),
                        range[0]
                    );
                })(params, [0, 1], {
                current: {
                    width, height
                }
            })(0, null, {x, y})
        };

        console.log(width, height, imageData)
        // noise
        for (let i = 0; i < imageData.data.length; i += 4) {
            const x = (i / 4) % width;
            const y = Math.floor((i / 4) / width);
            const a = cf(x, y);
            // console.log(a);
            imageData.data[i] = a * 255;//Math.random() * 100;
            imageData.data[i + 1] = 0;//Math.random() * 100;
            imageData.data[i + 2] = 0;//Math.random() * 100;
            imageData.data[i + 3] = a * 255;//Math.random() * 100;
        }


        return (
            <Canvas
                style={{
                    width: ampWidth * 100 + "%",
                    left: `${startVPerc * 100}%`
                }}
                className={classNames("button-number-xy-amplitude", {["button-number-xy-amplitude-changing"]: changing})}
                width={width}
                height={height}
                value={imageData}>
                <span>{changeFunctionId}</span>
            </Canvas>
        );
    },
};

