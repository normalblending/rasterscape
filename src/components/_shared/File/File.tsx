import * as React from "react";
import './inputFile.scss';
import {readImageFile} from "./helpers";

export interface FileProps {
    onChange(image)

    name: string
    children: string

    autofocus?: boolean
    autoblur?: boolean

    onMouseEnter?(e)
    onMouseMove?(e)
    onMouseLeave?(e)
}

export interface FileState {

}

export class File extends React.PureComponent<FileProps, FileState> {

    inputRef;

    constructor(props) {
        super(props);

        this.inputRef = React.createRef();
    }

    handleFile = async e => {
        try {
            const image = await readImageFile(e.target.files?.[0]);

            this.props.onChange?.(image);
            this.inputRef.current.value = null;
        } catch (e) {

        }
    };


    handleMouseEnter = e => {

        const { autofocus, onMouseEnter } = this.props;
        if (autofocus)
            this.inputRef.current?.focus();

        onMouseEnter?.(e);

    }

    handleMove = e => {
        const { autofocus, onMouseMove } = this.props;
        if (autofocus && document.activeElement !== this.inputRef.current)
            this.inputRef.current?.focus();

        onMouseMove?.(e);

    }

    handleMouseLeave = e => {
        const { autoblur, onMouseLeave } = this.props;
        if (autoblur)
            this.inputRef.current?.blur();

        onMouseLeave?.(e);

    }

    render() {
        const {name, children} = this.props;
        return (
            <div
                className={'input-file'}
                onMouseEnter={this.handleMouseEnter}
                onMouseMove={this.handleMove}
                onMouseLeave={this.handleMouseLeave}
            >
                <input
                    type="file"
                    name={name}
                    id={name}
                    ref={this.inputRef}
                    onChange={this.handleFile}/>
                <label htmlFor={name}>{children}</label>
            </div>
        );
    }
}