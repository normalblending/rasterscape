import * as React from "react";
import * as cn from 'classnames';
import {VideoParams} from "../../../store/patterns/video/types";
import {SelectDrop} from "../../_shared/buttons/complex/SelectDrop";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../../store";
import {ChangeFunctionState, ECFType} from "../../../store/changeFunctions/types";
import {

    setChangeFunction,
    setCutOffset, setDevice,
    setEdgeMode,
    setMirrorMode,
    setSlitMode,
    setStackSize,
    setStackType,
    startCamera,
    stopCamera,
    start,
    stop,
    updateVideo
} from "../../../store/patterns/video/actions";
import {getChangeFunctionsSelectItemsVideo} from "../../../store/changeFunctions/selectors";
import {EdgeMode, MirrorMode, SlitMode} from "../../../store/patterns/video/services";
import {StackType} from "../../../store/patterns/video/_old/capture/pixels";
import './videoControls.scss';
import {SelectItem} from "../../../utils/utils";
import {setCFHighlights, setCFTypeHighlights} from "../../../store/changeFunctionsHighlights";
import {SelectButtonsEventData} from "../../_shared/buttons/complex/SelectButtons";
import {CycledToggleHK} from "../../_shared/buttons/hotkeyed/CycledToggleHK";
import {ButtonHK} from "../../_shared/buttons/hotkeyed/ButtonHK";
import {ButtonNumberCF} from "../../_shared/buttons/hotkeyed/ButtonNumberCF";
import {WithTranslation, withTranslation} from "react-i18next";
import {LabelFormatter} from "../../../store/hotkeys/label-formatters";
import {Translations} from "../../../store/language/helpers";
import {SelectVideoDevice} from "./SelectVideoDevice";

export interface VideoControlsStateProps {

    videoParams: VideoParams

    changeFunctionsSelectItems: ChangeFunctionState[]
    videoDisabled: boolean
    changeFunctionParams: any
}

export interface VideoControlsActionProps {
    start(id: string)

    stop(id: string)

    startCamera(id: string)

    stopCamera(id: string)

    setCFHighlights(cfName?: string)

    setCFTypeHighlights(cfType?: ECFType[])

    setDevice(id: string, value: MediaDeviceInfo)

    setSlitMode(id: string, value: SlitMode)

    setEdgeMode(id: string, value: EdgeMode)

    setMirrorMode(id: string, value: MirrorMode)

    setStackType(id: string, value: StackType)

    setChangeFunction(id: string, value: string)

    setStackSize(id: string, value: number)

    setCutOffset(id: string, value: number)

    updateVideo(id: string)
}

export interface VideoControlsOwnProps {
    patternId: string
}

export interface VideoControlsProps extends VideoControlsStateProps, VideoControlsActionProps, VideoControlsOwnProps, WithTranslation {

}

export interface VideoControlsState {
    pause: boolean
}

const availableCFTypes = [ECFType.FXY, ECFType.DEPTH];

const percentRange = [0, 1] as [number, number];
const offsetRange = [-1, 0] as [number, number];
const stackTypeClassNames = {
    [StackType.Right]: 'rightStack',
    [StackType.Left]: 'leftStack',
    [StackType.FromCenter]: 'toCenterStack',
    [StackType.ToCenter]: 'fromCenterStack',
};

// todo нужно нормально сделать состояния в редаксе и экшены-свитчи
export class VideoControlsComponent extends React.PureComponent<VideoControlsProps, VideoControlsState> {

    capture;
    sketch;
    stream;

    state = {
        pause: false,
        cutOffsetStyles: null,
    };


    componentDidUpdate(prevProps: Readonly<VideoControlsProps>, prevState: Readonly<VideoControlsState>, snapshot?: any): void {

        // const {changeFunctionParams, updateVideo, patternId} = this.props;
        //
        // if (changeFunctionParams !== prevProps.changeFunctionParams) {
        //     updateVideo(patternId);
        // }
        // это теперь в экшенах
    }

    handleChangeCameraOnParam = (data) => {
        const {videoParams, patternId} = this.props;
        videoParams.cameraOn
            ? this.props.stopCamera(patternId)
            : this.props.startCamera(patternId);
    };

    handleChangeUpdatingOnParam = (data) => {
        const {videoParams, patternId} = this.props;
        videoParams.updatingOn
            ? this.props.stop(patternId)
            : this.props.start(patternId);
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

    handleChangeMirrorMode = (data) => {
        const {setMirrorMode, patternId} = this.props;
        const {value} = data;
        setMirrorMode(patternId, data.selected ? MirrorMode.NO : MirrorMode.HORIZONTAL);
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
        setCFHighlights(data?.value?.id);
    };
    handleCFMouseLeave = () => {
        const {setCFHighlights} = this.props;
        setCFHighlights(null);
    };

    stackSizeText = (value) => {
        return value.toFixed(2) + 'w'
    };

    dynamicCutBG = (slitMode: SlitMode, stackType: StackType) => {
        const {videoParams: {cutOffset}} = this.props;
        if (slitMode === SlitMode.FRONT) {
            switch (stackType) {

                case StackType.Right:
                    return {background: `rgba(255, 255, 255, ${(cutOffset + 1).toFixed(2)})`};
                case StackType.Left:
                    return {background: `rgba(255, 255, 255, ${(-cutOffset).toFixed(2)})`};
                case StackType.FromCenter:
                    return {background: `rgba(255, 255, 255, ${((-Math.abs(2 * cutOffset + 1) + 1)).toFixed(2)})`};
                case StackType.ToCenter:
                    return {background: `rgba(255, 255, 255, ${Math.abs(1 + 2 * cutOffset).toFixed(2)})`};


            }
        }
        if (slitMode === SlitMode.BACK) {
            switch (stackType) {

                case StackType.Right:
                    return {background: `rgba(255, 255, 255, ${(-cutOffset).toFixed(2)})`};
                case StackType.Left:
                    return {background: `rgba(255, 255, 255, ${(cutOffset + 1).toFixed(2)})`};
                case StackType.FromCenter:
                    return {background: `rgba(255, 255, 255, ${((-Math.abs(2 * cutOffset + 1) + 1)).toFixed(2)})`};
                case StackType.ToCenter:
                    return {background: `rgba(255, 255, 255, ${Math.abs(1 + 2 * cutOffset).toFixed(2)})`};


            }
        }
        return null;
    };

    edgeModeGetValue = id => id;
    edgeModeGetText = (id) => {
        const {t} = this.props;
        return t('pattern.video.edgeMode.' + id);
    };

    slitModeGetValue = id => id;
    slitModeGetText = (id) => {
        const {t} = this.props;
        return t('pattern.video.slitMode.' + id);
    };

    stackTypeGetValue = id => id;

    cfGetValue = (item: ChangeFunctionState) => item.id;
    cfGetText = (item: ChangeFunctionState) => {
        const {t} = this.props;
        return Translations.cfName(t)(item);
    }

    handleDeviceSelect = (device: MediaDeviceInfo) => {
        this.props.setDevice(this.props.patternId, device);

    };

    render() {
        const {changeFunctionsSelectItems, videoParams: params, patternId, videoDisabled, t} = this.props;
        const {cameraOn, updatingOn} = params;

        return (
            <div className={"video-controls"}>

                <SelectVideoDevice
                    value={params.device?.deviceId}
                    onSelect={this.handleDeviceSelect}
                />
                <ButtonHK
                    hkLabel={'pattern.hotkeysDescription.video.cameraOn'}
                    hkData1={patternId}
                    path={`pattern.${patternId}.video.cameraOn`}
                    className={'on-off'}
                    selected={cameraOn}
                    name={'cameraOn'}
                    disabled={videoDisabled}
                    onClick={this.handleChangeCameraOnParam}
                >
                    {cameraOn ? t("pattern.video.stop") : t("pattern.video.start")}
                </ButtonHK>

                <br/>
                <ButtonHK
                    hkLabel={'pattern.hotkeysDescription.video.updatingOn'}
                    hkData1={patternId}
                    path={`pattern.${patternId}.video.updatingOn`}
                    className={'on-off'}
                    selected={updatingOn}
                    name={'updatingOn'}
                    disabled={videoDisabled}
                    onClick={this.handleChangeUpdatingOnParam}
                >
                    {updatingOn ? t("pattern.video.stop") : t("pattern.video.start")}
                </ButtonHK>


                <ButtonHK
                    hkLabel={'pattern.hotkeysDescription.video.mirror'}
                    hkData1={patternId}
                    path={`pattern.${patternId}.video.mirrorMode`}
                    className={'mirror-mode'}
                    name={"mirrorMode"}
                    onClick={this.handleChangeMirrorMode}
                    selected={params.mirrorMode === MirrorMode.HORIZONTAL}
                ><span>{t('pattern.video.mirror')}</span></ButtonHK>

                <CycledToggleHK
                    hkLabel={'pattern.hotkeysDescription.video.edgeMode'}
                    hkData1={patternId}
                    path={`pattern.${patternId}.video.edgeMode`}
                    className={'edge-mode'}
                    getValue={this.edgeModeGetValue}
                    getText={this.edgeModeGetText}
                    items={Object.values(EdgeMode)}
                    value={params.edgeMode}
                    name={"edgeMode"}
                    onChange={this.handleChangeEdgeMode}/>

                <ButtonNumberCF
                    hkLabel={'pattern.hotkeysDescription.video.stackSize'}
                    hkData1={patternId}
                    withoutCF
                    pres={2}
                    className={cn('stack-size', {
                        [params.edgeMode]: true,
                        [stackTypeClassNames[params.stackType]]: true
                    })}
                    path={`patterns.${patternId}.video.params.stackSize`}
                    name={"stackSize"}
                    getText={this.stackSizeText}
                    value={params.stackSize}
                    range={percentRange}
                    onChange={this.handleChangeStackSize}
                />

                <ButtonNumberCF
                    pres={2}
                    path={`patterns.${patternId}.video.params.cutOffset`}
                    hkLabel={'pattern.hotkeysDescription.video.cutOffset'}
                    hkData1={patternId}
                    name={"radius"}
                    className={cn('cut-offset', {
                        [stackTypeClassNames[params.stackType]]: true,
                        [params.slitMode]: true,
                    })}
                    style={this.dynamicCutBG(params.slitMode, params.stackType)}
                    value={params.cutOffset}
                    range={offsetRange}
                    onChange={this.handleChangeCutOffset}
                />


                <SelectDrop
                    path={`pattern.${patternId}.video.slitMode`}
                    className={'slit-mode'}
                    hkLabel={'pattern.hotkeysDescription.video.slitMode'}
                    hkData1={patternId}
                    getValue={this.slitModeGetValue}
                    getText={this.slitModeGetText}
                    items={Object.values(SlitMode)}
                    value={params.slitMode}
                    name={"slitMode"}
                    onChange={this.handleChangeSlitModeParam}
                />


                <CycledToggleHK
                    path={`pattern.${patternId}.video.stackType`}
                    className={'stack-type'}
                    hkLabel={'pattern.hotkeysDescription.video.stackType'}
                    hkData1={patternId}
                    getValue={this.stackTypeGetValue}
                    getText={this.stackTypeGetValue}
                    items={Object.values(StackType)}
                    value={params.stackType}
                    name={"stackType"}
                    onChange={this.handleChangeStackType}/>
                <SelectDrop

                    hkByValue={false}
                    hkLabel={'pattern.hotkeysDescription.video.cutFunction'}
                    hkLabelFormatter={LabelFormatter.ChangeFunction}
                    hkData1={patternId}

                    className={'cut-function'}

                    nullAble
                    nullText={'-'}
                    onValueMouseEnter={this.handleCFValueMouseEnter}
                    onValueMouseLeave={this.handleCFValueMouseLeave}
                    onItemMouseEnter={this.handleCFMouseEnter}
                    onItemMouseLeave={this.handleCFMouseLeave}
                    name={"changeFunctionId"}
                    value={params.changeFunctionId}
                    getText={this.cfGetText}
                    getValue={this.cfGetValue}
                    items={changeFunctionsSelectItems}
                    onChange={this.handleChangeChangeFunction}/>
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
    startCamera,
    stopCamera,

    setDevice,
    setSlitMode,
    setEdgeMode,
    setMirrorMode,
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
)(withTranslation('common')(VideoControlsComponent));
