import * as React from "react";
import * as keyboardjs from "keyboardjs";

export interface KeyProps {
    keys: string | string[]

    onPress?(e?: any, keys?: string | string[])

    onRelease?(e?: any, keys?: string | string[])
}

export interface KeyState {
    keys: string
}

export class Key extends React.PureComponent<KeyProps, KeyState> {

    // state = {
    //     keys: null
    // };

    handlePress = e => {
        e.preventRepeat();
        const {onPress, keys} = this.props;
        onPress && onPress(e, keys)
    };

    handleRelease = e => {
        const {onRelease, keys} = this.props;
        onRelease && onRelease(e, keys)
    };

    // static getDerivedStateFromProps(props, state) {
    //     if (props.keys !== state.keys) {
    //         return {keys: props.keys};
    //     }
    //     return;
    // }

    componentDidMount() {
        const {keys} = this.props;
        console.log(this.props);
        keyboardjs.bind(keys, this.handlePress, this.handleRelease)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.keys !== this.props.keys) {
            keyboardjs.unbind(prevProps.keys, this.handlePress, this.handleRelease);
            keyboardjs.bind(this.props.keys, this.handlePress, this.handleRelease);
        }
    }

    componentWillUnmount() {
        keyboardjs.unbind(this.props.keys, this.handlePress, this.handleRelease);
    }

    render() {
        console.log("keys render", this.props.keys);
        return <></>;
    }
}