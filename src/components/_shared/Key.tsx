import * as React from "react";
import * as keyboardjs from "keyboardjs";
import {NodeType} from "../../utils/consts";

export interface KeyProps {
    keys: string | string[]
    emptyKeys?: boolean

    onPress?(e?: any, keys?: string | string[], data?: any)

    onRelease?(e?: any, keys?: string | string[], data?: any)

    data?: any

    name?: string
}

export interface KeyState {
}

export class Key extends React.PureComponent<KeyProps, KeyState> {

    handlePress = e => {
        if (document.activeElement.nodeName === NodeType.Input) {
            return;
        }

        e.preventRepeat();
        const {onPress, keys, data} = this.props;
        onPress && onPress(e, keys, data);
    };

    handleRelease = e => {
        if (document.activeElement.nodeName === NodeType.Input) {
            return;
        }

        const {onRelease, keys, data} = this.props;
        onRelease && onRelease(e, keys, data);
    };

    componentDidMount() {
        const {keys, emptyKeys} = this.props;
        if (keys || emptyKeys)
            keyboardjs.bind(keys, this.handlePress, this.handleRelease)
    }

    componentDidUpdate(prevProps) {
        const {keys, name, emptyKeys} = this.props;


        if (prevProps.keys !== keys) {
            keyboardjs.unbind(prevProps.keys, this.handlePress, this.handleRelease);

            if (keys || emptyKeys)
                keyboardjs.bind(keys, this.handlePress, this.handleRelease);
        }
    }

    componentWillUnmount() {
        keyboardjs.unbind(this.props.keys, this.handlePress, this.handleRelease);
    }

    render() {
        return <></>;
    }
}