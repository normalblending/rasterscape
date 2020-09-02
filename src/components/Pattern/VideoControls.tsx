import * as React from "react";
import {ButtonSelect} from "../_shared/buttons/ButtonSelect";
import {VideoParams} from "../../store/patterns/video/types";
import {SelectDrop} from "../_shared/buttons/SelectDrop";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {ECFType} from "../../store/changeFunctions/types";
import {ChangeFunctions} from "../../store/changeFunctions/reducer";
import {pause, play, setVideoParams, start, stop} from "../../store/patterns/video/actions";
import {getCFs, getChangeFunctionsSelectItemsVideo} from "../../store/changeFunctions/selectors";
import {EdgeMode, SlitMode} from "../../store/patterns/video/services";
import {StackType} from "../../store/patterns/video/capture/pixels";
import '../../styles/videoControls.scss';
import {CycledToggle} from "../_shared/buttons/CycledToggle/CycledToggle";
import {SelectItem} from "../../utils/utils";
import {setCFHighlights, setCFTypeHighlights} from "../../store/changeFunctionsHighlights";
import {SelectButtonsEventData} from "../_shared/buttons/SelectButtons";
import {CycledToggleHK} from "../_shared/buttons/CycledToggle/CycledToggleHK";
import {ButtonHK} from "../_shared/buttons/ButtonHK";

export interface VideoControlsStateProps {

    videoParams: VideoParams

    changeFunctionsSelectItems: SelectItem[]
}

export interface VideoControlsActionProps {
    start
    stop

    pause
    play

    setVideoParams(id: string, value: VideoParams, noHistory?: boolean)

    setCFHighlights(cfName?: string)

    setCFTypeHighlights(cfType?: ECFType[])
}

export interface VideoControlsOwnProps {
    patternId: string
}

export interface VideoControlsProps extends VideoControlsStateProps, VideoControlsActionProps, VideoControlsOwnProps {

}

export interface VideoControlsState {
    pause: boolean
}

const availableCFTypes = [ECFType.FXY, ECFType.DEPTH];

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
        }, selected);
        this.setState({pause: selected})
    };

    handleChangeParam = (data) => {
        const {setVideoParams, videoParams, patternId} = this.props;
        const {value, name} = data;
        console.log(data);
        setVideoParams(patternId, {
            ...videoParams,
            [name]: value
        });
    };

    handleChangeSlitModeParam = (data) => {
        const {setVideoParams, videoParams, patternId} = this.props;
        const {selected} = data;
        setVideoParams(patternId, {
            ...videoParams,
            slitMode: !selected ? SlitMode.FRONT : SlitMode.SIDE
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

    availableChangeTypes = [ECFType.FXY, ECFType.DEPTH];

    handleCFValueMouseEnter = () => {
        const {setCFTypeHighlights, changeFunctionsSelectItems} = this.props;
        if (!changeFunctionsSelectItems.length)
            setCFTypeHighlights(availableCFTypes);
    };
    handleCFValueMouseLeave = () => {
        const {setCFTypeHighlights} = this.props;
        setCFTypeHighlights(null);
    };

    handleCFMouseEnter = (data: SelectButtonsEventData) => {
        const {setCFHighlights} = this.props;
        setCFHighlights(data?.value?.value);
    };
    handleCFMouseLeave = () => {
        const {setCFHighlights} = this.props;
        setCFHighlights(null);
    };

    render() {
        const {changeFunctionsSelectItems, videoParams: params, patternId} = this.props;
        const {on} = params;

        return (
            <div className={"video-controls"}>
                <ButtonHK
                    path={`pattern.${patternId}.video.slitMode`}
                    className={'slit-mode'}
                    name={'slitMode'}
                    selected={params.slitMode === SlitMode.FRONT}
                    onClick={this.handleChangeSlitModeParam}>
                    {params.slitMode === SlitMode.FRONT
                        ? "front"
                        : "side"}
                </ButtonHK>

                <CycledToggleHK
                    path={`pattern.${patternId}.video.edgeMode`}
                    className={'edge-mode'}
                    getValue={(id) => id}
                    getText={(id) => id}
                    items={Object.values(EdgeMode)}
                    value={params.edgeMode}
                    name={"edgeMode"}
                    onChange={this.handleChangeParam}/>

                <CycledToggleHK
                    path={`pattern.${patternId}.video.stackType`}
                    className={'stack-type'}
                    getValue={(id) => id}
                    getText={(id) => id}
                    items={Object.values(StackType)}
                    value={params.stackType}
                    name={"stackType"}
                    onChange={this.handleChangeParam}/>

                <ButtonHK
                    path={`pattern.${patternId}.video.on`}
                    className={'on-off'}
                    selected={on}
                    name={'on'}
                    onClick={this.handleChangeOnParam}
                >
                    {on ? "stop" : "start"}
                </ButtonHK>

                <ButtonHK
                    path={`pattern.${patternId}.video.pause`}
                    className={'pause-play'}
                    disabled={!on}
                    selected={this.state.pause && on}
                    name={'pause'}
                    onClick={this.handlePause}
                >{this.state.pause ? "play" : "pause"}</ButtonHK>

                <SelectDrop
                    className={'cut-function'}
                    nullAble
                    nullText={'-'}
                    onValueMouseEnter={this.handleCFValueMouseEnter}
                    onValueMouseLeave={this.handleCFValueMouseLeave}
                    onItemMouseEnter={this.handleCFMouseEnter}
                    onItemMouseLeave={this.handleCFMouseLeave}
                    name={"changeFunctionId"}
                    value={params.changeFunctionId}
                    items={changeFunctionsSelectItems}
                    onChange={this.handleChangeParam}/>

            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<VideoControlsStateProps, VideoControlsOwnProps, AppState> = (state, {patternId}) => ({
    changeFunctionsSelectItems: getChangeFunctionsSelectItemsVideo(state),
    videoParams: state.patterns[patternId]?.video?.params || null
});

const mapDispatchToProps: MapDispatchToProps<VideoControlsActionProps, VideoControlsOwnProps> = {
    start,
    stop,
    pause,
    play,

    setVideoParams,

    setCFHighlights,
    setCFTypeHighlights
};

export const VideoControls = connect<VideoControlsStateProps, VideoControlsActionProps, VideoControlsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(VideoControlsComponent);