import * as React from "react";
import {ButtonSelect} from "../_shared/buttons/simple/ButtonSelect";
import {VideoParams} from "../../store/patterns/video/types";
import {SelectDrop} from "../_shared/buttons/complex/SelectDrop";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {ECFType} from "../../store/changeFunctions/types";
import {ChangeFunctions} from "../../store/changeFunctions/reducer";
import {
    pause,
    play, setChangeFunction, setCutOffset,
    setEdgeMode,
    setSlitMode, setStackSize,
    setStackType,
    start,
    stop, updateVideo
} from "../../store/patterns/video/actions";
import {getCFs, getChangeFunctionsSelectItemsVideo} from "../../store/changeFunctions/selectors";
import {EdgeMode, SlitMode} from "../../store/patterns/video/services";
import {StackType} from "../../store/patterns/video/capture/pixels";
import '../../styles/videoControls.scss';
import {CycledToggle} from "../_shared/buttons/simple/CycledToggle";
import {SelectItem} from "../../utils/utils";
import {setCFHighlights, setCFTypeHighlights} from "../../store/changeFunctionsHighlights";
import {SelectButtonsEventData} from "../_shared/buttons/complex/SelectButtons";
import {CycledToggleHK} from "../_shared/buttons/hotkeyed/CycledToggleHK";
import {ButtonHK} from "../_shared/buttons/hotkeyed/ButtonHK";
import {ButtonNumberCF} from "../_shared/buttons/hotkeyed/ButtonNumberCF";
import {WaveType} from "../../store/changeFunctions/functions/wave";
import {HoverHideable} from "../_shared/HoverHideable";
import {Button} from "../_shared/buttons/simple/Button";
import {ButtonNumber} from "../_shared/buttons/complex/ButtonNumber";

export interface VideoControlsStateProps {

    videoParams: VideoParams

    changeFunctionsSelectItems: SelectItem[]
    videoDisabled: boolean
    changeFunctionParams: any
}

export interface VideoControlsActionProps {
    start
    stop

    pause
    play

    setCFHighlights(cfName?: string)

    setCFTypeHighlights(cfType?: ECFType[])

    setSlitMode(id: string, value: SlitMode)

    setEdgeMode(id: string, value: EdgeMode)

    setStackType(id: string, value: StackType)

    setChangeFunction(id: string, value: string)

    setStackSize(id: string, value: number)

    setCutOffset(id: string, value: number)

    updateVideo(id: string)
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

const percentRange = [0, 1] as [number, number];

// todo нужно нормально сделать состояния в редаксе и экшены-свитчи
export class VideoControlsComponent extends React.PureComponent<VideoControlsProps, VideoControlsState> {

    capture;
    sketch;
    stream;

    state = {
        pause: false
    };


    componentDidUpdate(prevProps: Readonly<VideoControlsProps>, prevState: Readonly<VideoControlsState>, snapshot?: any): void {

        const {changeFunctionParams, updateVideo, patternId} = this.props;

        if (changeFunctionParams !== prevProps.changeFunctionParams) {
            updateVideo(patternId);
        }
    }

    handleChangeOnParam = (data) => {
        const {videoParams, patternId} = this.props;
        videoParams.on
            ? this.props.stop(patternId)
            : this.props.start(patternId);
    };

    handlePause = () => {
        const {videoParams, patternId} = this.props;
        videoParams.pause
            ? this.props.play(patternId)
            : this.props.pause(patternId);
    };

    handleChangeSlitModeParam = (data) => {
        const {setSlitMode, patternId} = this.props;
        const {value} = data;
        setSlitMode(patternId, value);
    };

    handleChangeEdgeMode = (data) => {
        const {setEdgeMode, patternId} = this.props;
        const {value} = data;
        setEdgeMode(patternId, value);
    };

    handleChangeStackType = (data) => {
        const {setStackType, patternId} = this.props;
        const {value} = data;
        setStackType(patternId, value);
    };

    handleChangeChangeFunction = (data) => {
        const {setChangeFunction, patternId} = this.props;
        const {value} = data;
        setChangeFunction(patternId, value);
    };

    handleClearChangeFunction = () => {
        const {setChangeFunction, patternId} = this.props;
        setChangeFunction(patternId, null);
    };

    handleChangeStackSize = (data) => {
        const {setStackSize, patternId} = this.props;
        const {value} = data;
        setStackSize(patternId, value);
    };

    handleChangeCutOffset = (data) => {
        const {setCutOffset, patternId} = this.props;
        const {value} = data;
        setCutOffset(patternId, value);
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
        const {changeFunctionsSelectItems, videoParams: params, patternId, videoDisabled} = this.props;
        const {on, pause} = params;

        return (
            <div className={"video-controls"}>

                <SelectDrop
                    path={`pattern.${patternId}.video.slitMode`}
                    className={'slit-mode'}
                    getValue={(id) => id}
                    getText={(id) => id}
                    items={Object.values(SlitMode)}
                    value={params.slitMode}
                    name={"slitMode"}
                    onChange={this.handleChangeSlitModeParam}
                />


                <div>
                    {params.changeFunctionId ? (
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
                            onChange={this.handleChangeChangeFunction}/>
                    ) : (
                        <HoverHideable
                            className={'cut'}
                            button={(
                                <ButtonNumberCF
                                    pres={2}
                                    path={`patterns.${patternId}.video.params.cutOffset`}
                                    hkLabel={`p${patternId} video cut`}
                                    name={"radius"}
                                    value={params.cutOffset}
                                    range={percentRange}
                                    onChange={this.handleChangeCutOffset}
                                />
                            )}>
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
                                onChange={this.handleChangeChangeFunction}/>
                        </HoverHideable>
                    )}

                </div>

                <CycledToggleHK
                    path={`pattern.${patternId}.video.stackType`}
                    className={'stack-type'}
                    getValue={(id) => id}
                    getText={(id) => id}
                    items={Object.values(StackType)}
                    value={params.stackType}
                    name={"stackType"}
                    onChange={this.handleChangeStackType}/>

                <ButtonHK
                    path={`pattern.${patternId}.video.on`}
                    className={'on-off'}
                    selected={on}
                    name={'on'}
                    disabled={videoDisabled}
                    onClick={this.handleChangeOnParam}
                >
                    {on ? "stop" : "start"}
                </ButtonHK>

                <ButtonHK
                    path={`pattern.${patternId}.video.pause`}
                    className={'pause-play'}
                    disabled={!on}
                    selected={pause && on}
                    name={'pause'}
                    onClick={this.handlePause}
                >{pause ? "play" : "pause"}</ButtonHK>


                <ButtonNumberCF
                    withoutCF
                    pres={2}
                    path={`patterns.${patternId}.video.params.stackSize`}
                    hkLabel={`p${patternId} video stack size`}
                    name={"stackSize"}
                    value={params.stackSize}
                    range={percentRange}
                    onChange={this.handleChangeStackSize}
                />
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<VideoControlsStateProps, VideoControlsOwnProps, AppState> = (state, {patternId}) => ({
    changeFunctionsSelectItems: getChangeFunctionsSelectItemsVideo(state),
    videoParams: state.patterns[patternId]?.video?.params || null,
    changeFunctionParams: state.changeFunctions.functions[state.patterns[patternId]?.video?.params?.changeFunctionId]?.params || null,
    videoDisabled: !!state.patterns[patternId]?.room?.value?.connected && !state.patterns[patternId]?.room?.value?.meDrawer,
});

const mapDispatchToProps: MapDispatchToProps<VideoControlsActionProps, VideoControlsOwnProps> = {
    start,
    stop,
    pause,
    play,

    setSlitMode,
    setEdgeMode,
    setStackType,
    setChangeFunction,
    setStackSize,
    setCutOffset,
    updateVideo,

    setCFHighlights,
    setCFTypeHighlights
};

export const VideoControls = connect<VideoControlsStateProps, VideoControlsActionProps, VideoControlsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(VideoControlsComponent);