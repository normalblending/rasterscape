import * as React from "react";
import {ButtonSelect} from "../_shared/ButtonSelect";
import {VideoParams} from "../../store/patterns/video/types";
import * as P5 from 'p5';
import {get, PixelsStack, set} from "../../store/patterns/video/capture/pixels";
import {SelectDrop} from "../_shared/SelectDrop";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {ECFType} from "../../store/changeFunctions/types";
import {ChangeFunctionsState} from "../../store/changeFunctions/reducer";
import {createCapture} from "../../store/patterns/video/capture/createCapture";

export interface VideoControlsStateProps {
    changeFunctions: ChangeFunctionsState
}

export interface VideoControlsActionProps {
}

export interface VideoControlsOwnProps {
    patternId: string
    params: VideoParams

    onParamsChange(value: VideoParams)

    onNewFrame(imageData: ImageData)
}

export interface VideoControlsProps extends VideoControlsStateProps, VideoControlsActionProps, VideoControlsOwnProps {

}

export interface VideoControlsState {
    pause: boolean
}




export class VideoControlsComponent extends React.PureComponent<VideoControlsProps, VideoControlsState> {

    capture;
    sketch;
    stream;

    state = {
        pause: false
    };

    componentDidMount(): void {

    }

    componentDidUpdate(prevProps: Readonly<VideoControlsProps>, prevState: Readonly<VideoControlsState>, snapshot?: any): void {
        if (!prevProps.params.on && this.props.params.on) {

            const p5 = createCapture(this.handleNewFrame, stream => this.stream = stream);

            console.log(p5);
            const {capture, sketch} = p5;
            this.capture = capture;
            this.sketch = sketch;

        }
        if (prevProps.params.on && !this.props.params.on) {
            this.sketch.noLoop();
            console.log(this.stream.getTracks());
            this.sketch.remove();
            this.stream.getTracks()[0].stop();
        }
    }

    handleNewFrame = pixels => {
        this.props.onNewFrame(new ImageData(pixels, 320));
    };

    handleChangeOnParam = (data) => {
        console.log(1, data);
        const {selected} = data;
        this.props.onParamsChange({
            on: !selected
        });
        this.setState({pause: selected})
    };

    handlePause = () => {
        if (this.state.pause) {
            this.sketch.loop();
            this.setState({pause: false})
        } else {
            this.sketch.noLoop();
            this.setState({pause: true})
        }
    };

    componentWillUnmount(): void {
        this.sketch.remove();
        this.capture.remove();
    }

    availableChangeTypes  = [ECFType.XY_PARABOLOID];

    render() {
        const {changeFunctions} = this.props;
        const {on} = this.props.params;
        console.log('render video control ', this.props);
        return (
            <>
                <ButtonSelect
                    selected={on}
                    name={'on'}
                    onClick={this.handleChangeOnParam}
                >{on ? "off" : "on"}</ButtonSelect>

                {on &&
                <ButtonSelect
                    selected={this.state.pause}
                    name={'pause'}
                    onClick={this.handlePause}
                >{this.state.pause ? "play" : "pause"}</ButtonSelect>}

                <SelectDrop
                    getValue={({id}) => id}
                    getText={({id}) => id}
                    items={Object.values(changeFunctions)
                        .filter((value) => this.availableChangeTypes.indexOf(value.type) !== -1)}/>
            </>
        );
    }
}

const mapStateToProps: MapStateToProps<VideoControlsStateProps, VideoControlsOwnProps, AppState> = state => ({
    changeFunctions: state.changeFunctions
});

const mapDispatchToProps: MapDispatchToProps<VideoControlsActionProps, VideoControlsOwnProps> = {};

export const VideoControls = connect<VideoControlsStateProps, VideoControlsActionProps, VideoControlsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(VideoControlsComponent);