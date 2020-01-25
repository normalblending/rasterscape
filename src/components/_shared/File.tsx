import * as React from "react";
import '../../styles/inputFile.scss';
import {Button} from "./Button";

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

    handleFile = e => {
        var reader = new FileReader();
        reader.onload = (event) => {
            var img = new Image();
            img.onload = () => {
                this.props.onChange(img);
                // this.refs.canvas.ctx.drawImage(img, 0, 0, this.props.value.w, this.props.value.h);
                // this.updateMaskedImage();
            };
            img.src = event.target.result as string;
            this.inputRef.current.value = null;
        };
        if (e.target.files[0])
            reader.readAsDataURL(e.target.files[0]);
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