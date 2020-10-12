import * as React from "react";
import '../../../styles/inputFile.scss';
import {readImageFile} from "./helpers";

export interface FileProps {
    onChange(image)
    name: string
    children: string
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

    render() {
        const { name, children } = this.props;
        return (
            <div className={'input-file'}>
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