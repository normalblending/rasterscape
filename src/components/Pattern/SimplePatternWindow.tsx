import * as React from "react";
import {CanvasDraw} from "../_shared/CanvasDraw";
import {Button} from "../_shared/Button";
import "../../styles/pattern.scss";

export interface SimplePatternWindowProps {
    id: number
    imageValue: ImageData
    height: number
    width: number

    onImageChange(id: number, imageData: ImageData)
    onRemove(id: number)
}

export interface SimplePatternWindowState {

}

export class SimplePatternWindow extends React.PureComponent<SimplePatternWindowProps, SimplePatternWindowState> {


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
            <div className="pattern">
                <CanvasDraw
                    value={imageValue}
                    width={width}
                    height={height}
                    onChange={this.handleImageChange}/>
                <div className="pattern-controls">
                    <Button onClick={this.handleRemove}>del</Button> {id}
                </div>

            </div>
        );
    }
}