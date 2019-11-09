import * as React from "react";
import {CanvasDraw} from "../_shared/CanvasDraw";
import {Button} from "../_shared/Button";

export interface MainWindowProps {
    id: number

    onImageChange(id: number, imageData: ImageData)
    onRemove(id: number)

    imageValue: ImageData
    height: number
    width: number
}

export interface MainWindowState {

}

export class MainWindow extends React.PureComponent<MainWindowProps, MainWindowState> {


    handleImageChange = (imageData) => {
        const {id, onImageChange} = this.props;

        onImageChange(id, imageData);
    };

    handleRemove = () => {
        const {id, onRemove} = this.props;

        onRemove(id);
    };

    render() {
        const {imageValue, height, width, id} = this.props;
        return (
            <div>
                <CanvasDraw
                    value={imageValue}
                    width={width}
                    height={height}
                    onChange={this.handleImageChange}/>
                <Button onClick={this.handleRemove}>del</Button> {id}
            </div>
        );
    }
}