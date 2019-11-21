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

    changeFunction?(params: any, range: [number, number]): ((startValue: any, time: number) => any)

    changeFunctionParams?: any

    isChanging?: boolean

}

export interface ButtonNumberState {
    value?: any
    startPoint: [number, number]
    startValue?: any
    changing: boolean
    changingStartValue: any
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
            changingStartValue: null
        };


    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.value !== this.state.value || nextProps.isChanging !== this.props.isChanging;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            ...(!prevState.startPoint && nextProps.value !== prevState.value ? {
                value: nextProps.value
            } : {}),
        };
    }

    int;
    interval;

    componentDidUpdate(prevProps: ButtonNumberProps, prevState) {
        console.log("---------------------", !prevProps.isChanging && this.props.isChanging)
        if (!prevProps.isChanging && this.props.isChanging) {

            if (this.props.changeFunction) {
                const {value} = this.state;
                const startValue = value;
                let time = 0;
                this.int = true;
                this.setState({changingStartValue: startValue});
                this.interval = setInterval(() => {
                    const {onChange, name, selected, changeFunction} = this.props;
                    if (!changeFunction) {
                        clearInterval(this.interval);
                        this.interval = null;
                        this.int = false;
                        this.setState({changingStartValue: null, value: startValue})
                    } else {
                        const value = this.calcValueInterval(startValue, time * 2);

                        onChange && onChange({e: null, value, name, selected});

                        this.setState({value});

                        time += 20;
                    }
                }, 20)
            }

            // console.log("uppppppp, ", this.props.changeFunction)
            // if (this.props.changeFunction) {
            //     console.log("mouse-up", this.interval, this.state.startValue);
            //     if (this.interval) {
            //         clearInterval(this.interval);
            //         this.interval = null;
            //         this.setState({startValue: null})
            //     } else if (this.int) {
            //         this.int = false;
            //     } else {
            //
            //     }
            //
            // }
        } else if (prevProps.isChanging && !this.props.isChanging) {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
                console.log(this.state.changingStartValue);

                const {onChange, name, selected} = this.props;

                onChange && onChange({e: null, value: this.state.changingStartValue, name, selected});
                this.setState({changingStartValue: null});
            }
        }
    }

    handleDown = data => {

        console.log("down");

        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            this.setState({startValue: null})
        }

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

    calcValueInterval = (startValue, time) => {
        const {range, changeFunction, changeFunctionParams} = this.props;
        if (changeFunction) {
            let nextValue = changeFunction(changeFunctionParams, range)(startValue, time);
            nextValue = Math.min(Math.max(nextValue, range[0]), range[1]);
            return nextValue;
        } else {
            return startValue;
        }
    };

    calcValue = e => {
        console.log(this.state.startValue);
        const {range, valueD = ValueD.VerticalLinear(100)} = this.props;

        let nextValue = valueD(this.state.startValue, e.clientX - this.state.startPoint[0], e.clientY - this.state.startPoint[1]);
        nextValue = Math.min(Math.max(nextValue, range[0]), range[1]);
        return nextValue;
    };

    render() {
        const {range, className, getText, text, shortcut, ...otherProps} = this.props;
        const {value = 0, startValue} = this.state;

        console.log("number button render", this.state.value, this.props.name);

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