import * as React from "react";
import {Button} from "../_shared/buttons/Button";
import "../../styles/pattern.scss";
import {HistoryControls} from "./HistoryControls";
import {Area} from "../Area";
import {InputNumber} from "../_shared/InputNumber";
import {ButtonSelect} from "../_shared/buttons/ButtonSelect";
import {RotationControls} from "./RotatingControls";
import {RepeatingControls} from "./RepeatingControls";
import {SelectionControls} from "./SelectionControls";
import {MaskParams} from "../../store/patterns/mask/types";
import {RotationValue} from "../../store/patterns/rotating/types";
import {RepeatingParams} from "../../store/patterns/repeating/types";
import {ImportParams} from "../../store/patterns/import/types";
import {PatternConfig} from "../../store/patterns/pattern/types";
import {HistoryState} from "../../store/patterns/history/types";
import {StoreState} from "../../store/patterns/store/types";
import {Segments, SelectionState} from "../../store/patterns/selection/types";
import {VideoControls} from "./VideoControls";
import {VideoParams} from "../../store/patterns/video/types";
import {withTranslation, WithTranslation} from "react-i18next";
import {File} from "../_shared/File";

export interface PatternWindowProps extends WithTranslation {
    id: string
    imageValue: ImageData
    maskValue?: ImageData
    maskParams?: MaskParams
    rotation?: RotationValue
    repeating?: RepeatingParams
    loading: ImportParams
    video: VideoParams

    height: number
    width: number

    connected?: string

    config: PatternConfig
    history: HistoryState
    store: StoreState
    selection: SelectionState

    resultImage: HTMLCanvasElement

    onImageChange(id: string, imageData: ImageData)

    onMaskChange(id: string, imageData: ImageData)

    onMaskParamsChange(id: string, params: MaskParams)

    onSelectionChange(id: string, selectionValue: Segments, bBox: SVGRect)

    onRemove(id: string)

    onDouble(id: string)

    onUndo(id: string)

    onRedo(id: string)

    onSetWidth(id: string, width: number)

    onSetHeight(id: string, height: number)

    onCreateRoom(id: string, name: string)

    onConfigChange(id: string, value: PatternConfig)

    onRotationChange(id: string, value: RotationValue)

    onRepeatingChange(id: string, value: RepeatingParams)

    onLoad(id: string, image)

    onSave(id: string)

    onLoadingParamsChange(id: string, params: ImportParams)

    onCreatePatternFromSelection(id: string)

    onCutBySelection(id: string)

    onVideoParamsChange(id: string, params: VideoParams)

    onNewVideoFrame(id: string, imageData: ImageData)
}

export interface PatternWindowState {
}

const inputNumberProps = {min: 0, max: 500, step: 1, delay: 1000, notZero: true};

export class PatternComponent extends React.PureComponent<PatternWindowProps, PatternWindowState> {


    handleImageChange = imageData => this.props.onImageChange(this.props.id, imageData);

    handleMaskChange = imageData => this.props.onMaskChange(this.props.id, imageData);

    handleSelectionChange = (value, bBox: SVGRect) =>
        this.props.onSelectionChange(this.props.id, value, bBox);

    handleClearSelection = () =>
        this.props.onSelectionChange(this.props.id, [], null);

    handleRemove = () => this.props.onRemove(this.props.id);

    handleDouble = () => this.props.onDouble(this.props.id);

    handleUndo = () => this.props.onUndo(this.props.id);

    handleRedo = () => this.props.onRedo(this.props.id);

    handleSetWidth = width => this.props.onSetWidth(this.props.id, width);

    handleSetHeight = height => this.props.onSetHeight(this.props.id, height);


    handleMaskParamsChange = (params: MaskParams) =>
        this.props.onMaskParamsChange(this.props.id, params);

    handleCreateRoom = (roomName) => {
        this.props.onCreateRoom(this.props.id, roomName);
    };

    handleConfigToggle = (data) => {
        this.props.onConfigChange(this.props.id, {
            ...this.props.config,
            [data.name]: !data.selected
        })
    };

    handleRotationChange = (rotation: RotationValue) => {
        this.props.onRotationChange(this.props.id, rotation)
    };

    handleRepeatingChange = (repeating: RepeatingParams) => {
        this.props.onRepeatingChange(this.props.id, repeating)
    };

    handleLoad = (image) => {
        this.props.onLoad(this.props.id, image)
    };
    handleSave = () => {
        this.props.onSave(this.props.id)
    };
    handleFitChange = (data) => {
        const {loading, id} = this.props;
        const {selected} = data;
        this.props.onLoadingParamsChange(id, {
            ...loading,
            fit: !selected
        });
    };

    handleCreatePatternFromSelection = () => {
        this.props.onCreatePatternFromSelection(this.props.id)
    };
    handleCutBySelection = () => {
        this.props.onCutBySelection(this.props.id)
    };

    handleVideoParamsChange = (params) => {
        this.props.onVideoParamsChange(this.props.id, params)
    };

    handleNewVideoFrame = (imageData: ImageData) => {
        this.props.onNewVideoFrame(this.props.id, imageData)
    };

    render() {
        const {
            imageValue, maskValue,
            height, width, id, config,
            history, selection, rotation, repeating, loading, video,
            t
        } = this.props;

        console.log("pattern render ", id, rotation);
        return (
            <div className="pattern">
                <div className="left">
                    <div className="plugins">

                        {config.repeating &&
                        <RepeatingControls
                            patternId={id}
                            repeating={repeating}
                            onChange={this.handleRepeatingChange}/>}

                        {config.video &&
                        <VideoControls
                            patternId={id}
                            params={video}
                            onNewFrame={this.handleNewVideoFrame}
                            onParamsChange={this.handleVideoParamsChange}/>}

                        {config.rotation &&
                        <RotationControls
                            patternId={id}
                            rotation={rotation}
                            onChange={this.handleRotationChange}/>}

                        {/*{config.room &&*/}
                        {/*<RoomControls*/}
                        {/*    onRoomCreate={this.handleCreateRoom}*/}
                        {/*    connected={connected}/>}*/}

                        <div className={'plugins-toggles'}>
                            {/*<ButtonSelect*/}
                            {/*    name={"mask"}*/}
                            {/*    selected={config.mask}*/}
                            {/*    onClick={this.handleConfigToggle}>mask</ButtonSelect>*/}
                            <ButtonSelect
                                name={"repeating"}
                                selected={config.repeating}
                                onClick={this.handleConfigToggle}>{t('plugins.repeating')}</ButtonSelect>
                            <ButtonSelect
                                name={"rotation"}
                                selected={config.rotation}
                                onClick={this.handleConfigToggle}>{t('plugins.rotating')}</ButtonSelect>
                            <ButtonSelect
                                name={"video"}
                                selected={config.video}
                                onClick={this.handleConfigToggle}>{t('plugins.video')}</ButtonSelect>
                        </div>
                    </div>
                    <div className="pattern-controls">

                        <Button onClick={this.handleRemove}>{t('patternControls.delete')}</Button>
                        <Button onClick={this.handleDouble}>{t('patternControls.double')}</Button>
                        <div className={'save-load-sizes'}>
                            <div>
                                <Button onClick={this.handleSave}>{t('patternControls.save')}</Button>
                                <File
                                    name={id + '-fileInput'}
                                    onChange={this.handleLoad}>{t('patternControls.load')}</File>
                                <ButtonSelect
                                    selected={this.props.loading.fit}
                                    onClick={this.handleFitChange}>{t('patternControls.stretch')}</ButtonSelect>
                            </div>
                            <div className={'pattern-sizes'}>
                                <InputNumber
                                    className={"size-input-number"}
                                    onChange={this.handleSetWidth}
                                    value={width}
                                    {...inputNumberProps}/>
                                <InputNumber
                                    className={"size-input-number"}
                                    onChange={this.handleSetHeight}
                                    value={height}
                                    {...inputNumberProps}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="right">

                    <SelectionControls
                        selectionValue={selection.value}
                        onCreatePattern={this.handleCreatePatternFromSelection}
                        onClear={this.handleClearSelection}
                        onCut={this.handleCutBySelection}/>

                    <div className={"areas"}>
                        <Area
                            name={id}
                            width={width}
                            height={height}

                            rotation={rotation}

                            imageValue={imageValue}

                            selectionValue={selection.value.segments}
                            selectionParams={selection.params}

                            onImageChange={this.handleImageChange}
                            onSelectionChange={this.handleSelectionChange}/>
                        {config.mask &&
                        <Area
                            mask
                            name={id}
                            rotation={rotation}
                            imageValue={maskValue}

                            selectionValue={selection.value.segments}
                            selectionParams={selection.params}

                            width={width}
                            height={height}
                            onSelectionChange={this.handleSelectionChange}
                            onImageChange={this.handleMaskChange}/>}
                    </div>

                    {config.history &&
                    <HistoryControls
                        history={history.value}
                        onUndo={this.handleUndo}
                        onRedo={this.handleRedo}/>}
                </div>

            </div>
        );
    }
}

export const Pattern = withTranslation("common")(PatternComponent);