import * as React from "react";
import {ButtonSelect} from "../_shared/buttons/ButtonSelect";
import {VideoParams} from "../../store/patterns/video/types";
import * as P5 from 'p5';
import {get, PixelsStack, set} from "../../store/patterns/video/capture/pixels";
import {SelectDrop} from "../_shared/buttons/SelectDrop";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {ECFType} from "../../store/changeFunctions/types";
import {ChangeFunctionsState} from "../../store/changeFunctions/reducer";
import {createCapture} from "../../store/patterns/video/capture/createCapture";
import {pause, play, start, stop} from "../../store/patterns/video/actions";

export interface VideoControlsStateProps {
    changeFunctions: ChangeFunctionsState
}

export interface VideoControlsActionProps {
    start
    stop

    pause
    play
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

// todo нужно нормально сделать состояния в редаксе и экшены-свитчи
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

            this.props.start(this.props.patternId);

        }
        if (prevProps.params.on && !this.props.params.on) {
            this.props.stop(this.props.patternId);
        }
    }

    handleChangeOnParam = (data) => {
        console.log(1, data);
        const {selected} = data;
        this.props.onParamsChange({
            ...this.props.params,
            on: !selected
        });
        this.setState({pause: selected})
    };

    handleChangeParam = (data) => {
        const {value, name} = data;
        this.props.onParamsChange({
            ...this.props.params,
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
        const {changeFunctions, params} = this.props;
        const {on} = this.props.params;
        console.log('render video control ', this.props);
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

const mapStateToProps: MapStateToProps<VideoControlsStateProps, VideoControlsOwnProps, AppState> = state => ({
    changeFunctions: state.changeFunctions
});

const mapDispatchToProps: MapDispatchToProps<VideoControlsActionProps, VideoControlsOwnProps> = {
    start,
    stop,
    pause,
    play
};

export const VideoControls = connect<VideoControlsStateProps, VideoControlsActionProps, VideoControlsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(VideoControlsComponent);