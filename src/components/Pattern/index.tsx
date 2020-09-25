import * as React from "react";
import {Button} from "../_shared/buttons/simple/Button";
import "../../styles/pattern.scss";
import {HistoryControls} from "./HistoryControls";
import {Area} from "../Area";
import {InputNumber} from "../_shared/inputs/InputNumber";
import {ButtonSelect} from "../_shared/buttons/simple/ButtonSelect";
import {RotationControls} from "./RotatingControls";
import {RepeatingControls} from "./RepeatingControls";
import {SelectionControls} from "./SelectionControls";
import {MaskParams} from "../../store/patterns/mask/types";
import {RotationValue} from "../../store/patterns/rotating/types";
import {ImportParams} from "../../store/patterns/import/types";
import {PatternConfig, UpdateOptions} from "../../store/patterns/pattern/types";
import {StoreState} from "../../store/patterns/store/types";
import {Segments, SelectionState} from "../../store/patterns/selection/types";
import {VideoControls} from "./VideoControls";
import {withTranslation, WithTranslation} from "react-i18next";
import {File} from "../_shared/File";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {updateMask} from "../../store/patterns/mask/actions";
import {doublePattern, editConfig, updateImage} from "../../store/patterns/pattern/actions";
import {setImportParams} from "../../store/patterns/import/actions";
import {RoomControls} from "./Room/RoomControls";
import {BlurControls} from "./BlurControls";
import '../../styles/inputNumber.scss';
import {HelpTooltip} from "../tutorial/HelpTooltip";
import {createPatternFromSelection, cutPatternBySelection} from "../../store/patterns/selection/actions";
import {ButtonHK} from "../_shared/buttons/hotkeyed/ButtonHK";
import {setDemonstrationEnabled} from "../../store/patterns/demonstration/actions";

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

    meDrawer: boolean

    demonstration: boolean
}

export interface PatternComponentActionProps {

    updateImage(options: UpdateOptions)

    updateMask(id: string, imageData: ImageData)

    editConfig(id: string, config: PatternConfig)

    setImportParams(id: string, value: ImportParams)

    doublePattern(id: string)

    createPatternFromSelection(id: string)

    cutPatternBySelection(id: string)

    setDemonstrationEnabled(id: string, enabled: boolean)

}

export interface PatternComponentOwnProps {
    id: string
    onMouseEnter?(patternId: string, e?)
}

export interface PatternComponentProps extends PatternComponentStateProps, PatternComponentActionProps, PatternComponentOwnProps, WithTranslation {


    connected?: string

    store: StoreState

    resultImage: HTMLCanvasElement

    onSelectionChange(id: string, selectionValue: Segments, bBox: SVGRect)

    onRemove(id: string)

    onSetWidth(id: string, width: number)

    onSetHeight(id: string, height: number)


    onLoad(id: string, image)

    onSave(id: string)
}

export interface PatternComponentState {
}

const inputNumberProps = {min: 0, max: 500, step: 1, delay: 1000, notZero: true};

export class PatternComponent extends React.PureComponent<PatternComponentProps, PatternComponentState> {


    handleImageChange = imageData => this.props.updateImage({id: this.props.id, imageData});

    handleMaskChange = imageData => this.props.updateMask(this.props.id, imageData);

    handleSelectionChange = (value, bBox: SVGRect) =>
        this.props.onSelectionChange(this.props.id, value, bBox);

    handleClearSelection = () =>
        this.props.onSelectionChange(this.props.id, [], null);

    handleRemove = () => this.props.onRemove(this.props.id);

    handleDouble = () => this.props.doublePattern(this.props.id);

    handleSetWidth = width => this.props.onSetWidth(this.props.id, width);

    handleSetHeight = height => this.props.onSetHeight(this.props.id, height);


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
        this.props.createPatternFromSelection(this.props.id)
    };
    handleCutBySelection = () => {
        this.props.cutPatternBySelection(this.props.id)
    };

    handleMouseEnter = (e) => {
        const {onMouseEnter, id} = this.props;

        onMouseEnter?.(id, e);
    };

    handleDemonstrationUnload = () => {

        const {setDemonstrationEnabled, id} = this.props;

        setDemonstrationEnabled?.(id, false);
    };

    render() {
        const {
            imageValue, maskValue,
            height, width, id, config, selection, rotation, importParams,
            meDrawer, demonstration,
            t,
        } = this.props;

        console.log("pattern render ", id, rotation);
        return (
            <div className="pattern" onMouseEnter={this.handleMouseEnter}>
                <div className="left">
                    <div className="flex-col">

                        {config.repeating &&
                        <RepeatingControls patternId={id}/>}

                        {config.video &&
                        <VideoControls patternId={id}/>}

                        {config.rotation &&
                        <RotationControls patternId={id}/>}

                        {config.blur &&
                        <BlurControls patternId={id}/>}

                        {config.room &&
                        <RoomControls patternId={id}/>}

                        <div className={'flex-row'}>
                            <ButtonHK
                                path={`pattern.${id}.mask`}
                                name={"mask"}
                                selected={config.mask}
                                onClick={this.handleConfigToggle}>{t('plugins.mask')}</ButtonHK>
                            <ButtonHK
                                path={`pattern.${id}.repeating`}
                                name={"repeating"}
                                selected={config.repeating}
                                onClick={this.handleConfigToggle}>{t('plugins.repeating')}</ButtonHK>
                            <ButtonHK
                                path={`pattern.${id}.rotation`}
                                name={"rotation"}
                                selected={config.rotation}
                                onClick={this.handleConfigToggle}>{t('plugins.rotating')}</ButtonHK>
                            <ButtonHK
                                path={`pattern.${id}.blur`}
                                name={"blur"}
                                selected={config.blur}
                                onClick={this.handleConfigToggle}>{t('plugins.blur')}</ButtonHK>
                            <ButtonHK
                                path={`pattern.${id}.room`}
                                name={"room"}
                                selected={config.room}
                                onClick={this.handleConfigToggle}>{t('plugins.room')}</ButtonHK>
                            <ButtonHK
                                path={`pattern.${id}.video`}
                                name={"video"}
                                selected={config.video}
                                onClick={this.handleConfigToggle}>{t('plugins.video')}</ButtonHK>
                        </div>

                    </div>
                    <div className={'flex-row'}>
                        {config.history &&
                        <HistoryControls patternId={id}/>}
                        <div className={'flex-col'}>
                            <div className={'flex-row'}>
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
                            <div className={'flex-row'}>
                                <ButtonSelect
                                    selected={this.props.importParams.fit}
                                    onClick={this.handleFitChange}>{t('patternControls.stretch')}</ButtonSelect>
                                <File
                                    name={id + '-fileInput'}
                                    onChange={this.handleLoad}>{t('patternControls.load')}</File>
                            </div>
                        </div>

                    </div>
                    <div className="flex-row">

                        <Button
                            onDoubleClick={this.handleRemove}
                            className={'pattern-delete-button'}>{t('patternControls.delete')}</Button>
                        <Button
                            onClick={this.handleDouble}>{t('patternControls.double')}</Button>
                        <Button onClick={this.handleSave}>{t('patternControls.save')}</Button>

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

                            disabled={!meDrawer}

                            name={id}
                            width={width}
                            height={height}

                            rotation={rotation}

                            imageValue={imageValue}

                            selectionValue={selection.value.segments}
                            selectionParams={selection.params}

                            onImageChange={this.handleImageChange}
                            onSelectionChange={this.handleSelectionChange}

                            demonstration={demonstration}
                            onDemonstrationUnload={this.handleDemonstrationUnload}
                        />
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
                </div>

            </div>
        );
    }
}


const mapStateToProps: MapStateToProps<PatternComponentStateProps, PatternComponentOwnProps, AppState> = (state, {id}) => {
    const pattern = state.patterns[id];
    return {
        importParams: pattern.import.params,
        meDrawer: !pattern.room?.value?.connected || pattern.room?.value?.meDrawer,
        config: pattern.config,
        width: pattern.current.imageData.width,
        height: pattern.current.imageData.height,
        selection: pattern?.selection,
        rotation: pattern.config.rotation ? pattern?.rotation?.value : null,
        imageValue: pattern?.current?.imageData || null,
        maskValue: pattern?.mask?.value?.imageData || null,
        demonstration: pattern?.demonstration?.value?.enabled
    }
};

const mapDispatchToProps: MapDispatchToProps<PatternComponentActionProps, PatternComponentOwnProps> = {
    updateImage,
    updateMask,
    editConfig,
    setImportParams,
    doublePattern,
    createPatternFromSelection,
    cutPatternBySelection,
    setDemonstrationEnabled,
};

export const Pattern = connect<PatternComponentStateProps, PatternComponentActionProps, PatternComponentOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation("common")(PatternComponent));

