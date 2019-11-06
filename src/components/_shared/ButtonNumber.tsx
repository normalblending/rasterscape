import * as React from "react";
import * as classNames from "classnames";

export const ValueD = {
    VerticalLinear: (step: number) => (oldValue: any, dx: number, dy) => oldValue - dy / step,
};

export interface ButtonNumberProps {
    name?: string
    text?: string
    className?: string
    classNameSelected?: string
    selected?: boolean
    width?: number

    range?: [number, number]

    value?: any

    valueD?(oldValue: any, dx: number, dy: number): any

    onChange?(value: any, name?: string)

    onClick?(value: any, name?: string)

}

export interface ButtonNumberState {
    value?: any
    startPoint: [number, number]
    startValue?: any
}

export class ButtonNumber extends React.Component<ButtonNumberProps, ButtonNumberState> {

    constructor(props) {
        super(props);

        console.log(props);

        this.state = {
            startPoint: null,
            value: props.value || props.range[0]
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.value !== this.state.value
            || nextProps.selected !== this.props.selected
            || nextProps.value !== this.props.value;
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("U P D ", prevProps.value, this.props.value);
        if (prevProps.value !== this.props.value) {
            this.setState({value: this.props.value || 0})
        }
    }

    handleDown = (e) => {
        e.persist();

        const {onClick, name} = this.props;

        onClick && onClick(this.state.value, name);

        this.setState(({value}) => ({
            startValue: value,
            startPoint: [e.clientX, e.clientY]
        }), () => {
            document.addEventListener("mousemove", this.handleMove);
            document.addEventListener("mouseup", this.handleUp);
        });
    };

    handleMove = (e) => {
        const {onChange, name} = this.props;
        const value = this.calcValue(e);

        onChange && onChange(value, name);

        this.setState({
            value
        }, () =>
            console.log(this.state.value));
    };

    handleUp = (e) => {
        const {onClick, name} = this.props;
        const value = this.calcValue(e);

        onClick && onClick(value, name);

        this.setState({
            value,
            startValue: null,
            startPoint: null
        }, () => {
            document.removeEventListener("mousemove", this.handleMove);
            document.removeEventListener("mouseup", this.handleUp);
        });
    };

    calcValue = e => {
        const {range = [0, 1], valueD = ValueD.VerticalLinear(100)} = this.props;

        let nextValue = valueD(this.state.startValue, e.clientX - this.state.startPoint[0], e.clientY - this.state.startPoint[1]);
        nextValue = Math.min(Math.max(nextValue, range[0]), range[1]);
        return nextValue;
    };

    render() {
        const {range = [0, 1], className, classNameSelected, selected, text} = this.props;
        const {value = 0} = this.state;
        console.log("number button render");
        return (
            <div
                className={classNames(
                    "value-button",
                    className,
                    {["value-button-selected"]: selected, [classNameSelected]: selected})}
                onMouseDown={this.handleDown}>
                <div
                    className={"value-button-value"}
                    style={{width: (value - range[0]) / (range[1] - range[0]) * 100 + "%"}}>
                    {text}
                </div>
            </div>
        );
    }
}