import * as React from "react";
import {ButtonSelect} from "../_shared/ButtonSelect";
import {VideoParams} from "../../store/patterns/video/types";

export interface VideoControlsProps {
    patternId: string
    params: VideoParams
    onParamsChange(value: VideoParams)
}

export interface VideoControlsState {

}

export class VideoControls extends React.PureComponent<VideoControlsProps, VideoControlsState> {

    handleChangeOnParam = (data) => {
        console.log(1, data);
        const {selected} = data;
        this.props.onParamsChange({
            on: !selected
        })
    };

    render() {
        const {on}= this.props.params;
        console.log('render video control ', this.props);
        return (
            <>
                <ButtonSelect
                    selected={on}
                    name={'on'}
                    onClick={this.handleChangeOnParam}
                />
            </>
        );
    }
}