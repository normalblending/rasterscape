import * as React from "react";
import * as classNames from "classnames";
import {ButtonSelect, ButtonSelectProps, ButtonSelectEventData} from "./ButtonSelect";
import {ButtonEventData} from "./Button";
import {Key} from "./Key";

export const ValueD = {
    VerticalLinear: (step: number) => (oldValue: any, dx: number, dy) => oldValue - dy / step,
};

export interface ButtonNumberEventData extends ButtonSelectEventData {
}

export interface ButtonNumberProps extends ButtonSelectProps {
    text?: string

    getText?(value?: any): string

    range?: [number, number]

    shortcut?: string | string[]


    valueD?(oldValue: any, dx: number, dy: number): any

    onChange?(data?: ButtonNumberEventData)

    onMouseDown?(data?: ButtonNumberEventData)

    onClick?(data?: ButtonNumberEventData)

    onPress?(data?: ButtonNumberEventData)

    onRelease?(data?: ButtonNumberEventData)


}

export interface ButtonNumberState {
    value?: any
    startPoint: [number, number]
    startValue?: any
}

export class ButtonNumber extends React.Component<ButtonNumberProps, ButtonNumberState> {

    constructor(props) {
        super(props);

        const {range} = props;

        this.state = {
            value: props.value || range[0],
            startPoint: null,
            startValue: null,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.value !== this.state.value;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return !prevState.startPoint && nextProps.value !== prevState.value ? {
            value: nextProps.value
        } : null
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

    handleUp = (e) => {
        const {onClick, name, selected} = this.props;
        const value = this.calcValue(e);

        onClick && onClick({value, name, e, selected});

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
        const {range, valueD = ValueD.VerticalLinear(100)} = this.props;

        let nextValue = valueD(this.state.startValue, e.clientX - this.state.startPoint[0], e.clientY - this.state.startPoint[1]);
        nextValue = Math.min(Math.max(nextValue, range[0]), range[1]);
        return nextValue;
    };

    render() {
        const {range, className, getText, text, shortcut, ...otherProps} = this.props;
        const {value = 0, startValue} = this.state;

        // console.log("number button render", value);

        return (
            <ButtonSelect
                {...otherProps}
                className={classNames("button-number", className, {
                    ["button-number-active"]: !!startValue
                })}
                onMouseDown={this.handleDown}>
                <div
                    className={"button-number-value"}
                    style={{width: (value - range[0]) / (range[1] - range[0]) * 100 + "%"}}>
                    {getText ? getText(value) : text}
                </div>
                {shortcut &&
                <Key
                    keys={shortcut}
                    onPress={this.handlePress}
                    onRelease={this.handleRelease}/>}
            </ButtonSelect>
        );
    }
}