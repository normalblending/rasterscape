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
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {setMaskParams, updateMask} from "../../store/patterns/mask/actions";
import {createRoom} from "../../store/patterns/room/actions";
import {addPattern, removePattern} from "../../store/patterns/actions";
import {doublePattern, editConfig, setHeight, setWidth, updateImage} from "../../store/patterns/pattern/actions";
import {
    createPatternFromSelection,
    cutPatternBySelection,
    updateSelection
} from "../../store/patterns/selection/actions";
import {redo, undo} from "../../store/patterns/history/actions";
import {setRotation} from "../../store/patterns/rotating/actions";
import {setRepeating} from "../../store/patterns/repeating/actions";
import {load, save, setImportParams} from "../../store/patterns/import/actions";
import {onNewFrame, setVideoParams} from "../../store/patterns/video/actions";
import {PatternsActionProps, PatternsOwnProps, PatternsStateProps} from "../Patterns";
import ts from "typescript/lib/tsserverlibrary";
import {RoomControls} from "./RoomControls";

export interface PatternComponentStateProps {


    config: PatternConfig
    selection: SelectionState

    imageValue: ImageData
    maskValue?: ImageData
    maskParams?: MaskParams
    rotation?: RotationValue
    importParams: ImportParams

    height: number
    width: number
}

export interface PatternComponentActionProps {

    updateImage(id: string, imageData: ImageData)

    updateMask(id: string, imageData: ImageData)

    editConfig(id: string, config: PatternConfig)
    setImportParams(id: string, value: ImportParams)

}

export interface PatternComponentOwnProps {
    id: string
}

export interface PatternComponentProps extends PatternComponentStateProps, PatternComponentActionProps, PatternComponentOwnProps, WithTranslation {



    connected?: string

    store: StoreState

    resultImage: HTMLCanvasElement

    onImageChange(id: string, imageData: ImageData)

    onMaskChange(id: string, imageData: ImageData)

    onMaskParamsChange(id: string, params: MaskParams)

    onSelectionChange(id: string, selectionValue: Segments, bBox: SVGRect)

    onRemove(id: string)

    onDouble(id: string)

    onSetWidth(id: string, width: number)

    onSetHeight(id: string, height: number)

    onCreateRoom(id: string, name: string)


    onLoad(id: string, image)

    onSave(id: string)

    onCreatePatternFromSelection(id: string)

    onCutBySelection(id: string)
}

export interface PatternComponentState {
}

const inputNumberProps = {min: 0, max: 500, step: 1, delay: 1000, notZero: true};

export class PatternComponent extends React.PureComponent<PatternComponentProps, PatternComponentState> {


    handleImageChange = imageData => this.props.onImageChange(this.props.id, imageData);

    handleMaskChange = imageData => this.props.onMaskChange(this.props.id, imageData);

    handleSelectionChange = (value, bBox: SVGRect) =>
        this.props.onSelectionChange(this.props.id, value, bBox);

    handleClearSelection = () =>
        this.props.onSelectionChange(this.props.id, [], null);

    handleRemove = () => this.props.onRemove(this.props.id);

    handleDouble = () => this.props.onDouble(this.props.id);

    handleSetWidth = width => this.props.onSetWidth(this.props.id, width);

    handleSetHeight = height => this.props.onSetHeight(this.props.id, height);


    handleMaskParamsChange = (params: MaskParams) =>
        this.props.onMaskParamsChange(this.props.id, params);

    handleCreateRoom = (roomName) => {
        this.props.onCreateRoom(this.props.id, roomName);
    };

    handleConfigToggle = (data) => {
        this.props.editConfig(this.props.id, {
            ...this.props.config,
            [data.name]: !data.selected
        })
    };

    handleLoad = (image) => {
        this.props.onLoad(this.props.id, image)
    };
    handleSave = () => {
        this.props.onSave(this.props.id)
    };
    handleFitChange = (data) => {
        const {importParams, id} = this.props;
        const {selected} = data;
        this.props.setImportParams(id, {
            ...importParams,
            fit: !selected
        });
    };

    handleCreatePatternFromSelection = () => {
        this.props.onCreatePatternFromSelection(this.props.id)
    };
    handleCutBySelection = () => {
        this.props.onCutBySelection(this.props.id)
    };

    render() {
        const {
            imageValue, maskValue,
            height, width, id, config, selection, rotation, importParams,
            t
        } = this.props;

        console.log("pattern render ", id, rotation);
        return (
            <div className="pattern">
                <div className="left">
                    <div className="plugins">

                        {config.repeating &&
                        <RepeatingControls patternId={id}/>}

                        {config.video &&
                        <VideoControls patternId={id}/>}

                        {config.rotation &&
                        <RotationControls patternId={id}/>}

                        {config.room &&
                        <RoomControls patternId={id}/>}

                        <div className={'plugins-toggles'}>
                            <ButtonSelect
                                name={"mask"}
                                selected={config.mask}
                                onClick={this.handleConfigToggle}>{t('plugins.mask')}</ButtonSelect>
                            <ButtonSelect
                                name={"repeating"}
                                selected={config.repeating}
                                onClick={this.handleConfigToggle}>{t('plugins.repeating')}</ButtonSelect>
                            <ButtonSelect
                                name={"rotation"}
                                selected={config.rotation}
                                onClick={this.handleConfigToggle}>{t('plugins.rotating')}</ButtonSelect>
                            <ButtonSelect
                                name={"room"}
                                selected={config.room}
                                onClick={this.handleConfigToggle}>{t('plugins.room')}</ButtonSelect>
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
                                    selected={this.props.importParams.fit}
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
                    <HistoryControls patternId={id}/>}
                </div>

            </div>
        );
    }
}


const mapStateToProps: MapStateToProps<PatternComponentStateProps, PatternComponentOwnProps, AppState> = (state, {id}) => {
    const pattern = state.patterns[id];
    return {
        importParams: pattern.import.params,
        config: pattern.config,
        width: pattern.current.width,
        height: pattern.current.height,
        selection: pattern?.selection,
        rotation: pattern?.rotation?.value,
        imageValue: pattern?.current?.imageData || null,
        maskValue: pattern?.mask?.value?.imageData || null,
    }
};

const mapDispatchToProps: MapDispatchToProps<PatternComponentActionProps, PatternComponentOwnProps> = {
    updateImage,
    updateMask,
    editConfig,
    setImportParams
};

export const Pattern = connect<PatternComponentStateProps, PatternComponentActionProps, PatternComponentOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation("common")(PatternComponent));

