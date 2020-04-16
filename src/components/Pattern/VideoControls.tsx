import * as React from "react";
import {ButtonSelect} from "../_shared/buttons/ButtonSelect";
import {VideoParams} from "../../store/patterns/video/types";
import * as P5 from 'p5';
import {get, PixelsStack, set} from "../../store/patterns/video/capture/pixels";
import {SelectDrop} from "../_shared/buttons/SelectDrop";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {ECFType} from "../../store/changeFunctions/types";
import {ChangeFunctions} from "../../store/changeFunctions/reducer";
import {createCapture} from "../../store/patterns/video/capture/createCapture";
import {onNewFrame, pause, play, setVideoParams, start, stop} from "../../store/patterns/video/actions";
import {getCFs} from "../../store/changeFunctions/selectors";

export interface VideoControlsStateProps {

    videoParams: VideoParams

    changeFunctions: ChangeFunctions
}

export interface VideoControlsActionProps {
    start
    stop

    pause
    play

    setVideoParams(id: string, value: VideoParams)

    onNewVideoFrame(id: string, imageData: ImageData)
}

export interface VideoControlsOwnProps {
    patternId: string
}

export interface VideoControlsProps extends VideoControlsStateProps, VideoControlsActionProps, VideoControlsOwnProps {

}

export interface VideoControlsState {
    pause: boolean
}

// todo нужно нормально сделать состояния в редаксе и экшены-свитчи
export class VideoControlsComponent extends React.PureComponent<VideoControlsProps, VideoControlsState> {

    capture;
    sketch;
    stream;

    state = {
        pause: false
    };


    componentDidUpdate(prevProps: Readonly<VideoControlsProps>, prevState: Readonly<VideoControlsState>, snapshot?: any): void {

        if (!prevProps.videoParams.on && this.props.videoParams.on) {
            this.props.start(this.props.patternId);
        }

        if (prevProps.videoParams.on && !this.props.videoParams.on) {
            this.props.stop(this.props.patternId);
        }
    }

    handleChangeOnParam = (data) => {
        const {setVideoParams, videoParams, patternId} = this.props;
        const {selected} = data;
        setVideoParams(patternId, {
            ...videoParams,
            on: !selected
        });
        this.setState({pause: selected})
    };

    handleChangeParam = (data) => {
        const {setVideoParams, videoParams, patternId} = this.props;
        const {value, name} = data;
        setVideoParams(patternId, {
            ...videoParams,
            [name]: value
        });
    };

    handlePause = () => {
        if (this.state.pause) {
            this.props.play(this.props.patternId);
            this.setState({pause: false})
        } else {
            this.props.pause(this.props.patternId);
            this.setState({pause: true})
        }
    };

    componentWillUnmount(): void {
        this.props.stop(this.props.patternId);
    }

    availableChangeTypes = [ECFType.XY_PARABOLOID];

    render() {
        const {changeFunctions, videoParams: params} = this.props;
        const {on} = params;

        return (
            <div className={"video-controls"}>
                <ButtonSelect
                    selected={on}
                    name={'on'}
                    onClick={this.handleChangeOnParam}
                >{on ? "off" : "on"}</ButtonSelect>

                <ButtonSelect
                    disabled={!on}
                    selected={this.state.pause && on}
                    name={'pause'}
                    onClick={this.handlePause}
                >{this.state.pause ? "play" : "pause"}</ButtonSelect>

                <SelectDrop
                    nullAble
                    getValue={({id}) => id}
                    getText={({id}) => id}
                    name={"changeFunctionId"}
                    value={params.changeFunctionId}
                    items={Object.values(changeFunctions)
                        .filter((value) => this.availableChangeTypes.indexOf(value.type) !== -1)}
                    onChange={this.handleChangeParam}/>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<VideoControlsStateProps, VideoControlsOwnProps, AppState> = (state, {patternId}) => ({
    changeFunctions: getCFs(state),
    videoParams: state.patterns[patternId]?.video?.params || null
});

const mapDispatchToProps: MapDispatchToProps<VideoControlsActionProps, VideoControlsOwnProps> = {
    start,
    stop,
    pause,
    play,

    setVideoParams,
    onNewVideoFrame: onNewFrame
};

export const VideoControls = connect<VideoControlsStateProps, VideoControlsActionProps, VideoControlsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(VideoControlsComponent);