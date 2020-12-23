import * as React from "react";
import "../../styles/pattern.scss";
import {HistoryControls} from "./HistoryControls";
import {Area} from "../Area";
import {InputNumber} from "../_shared/inputs/InputNumber";
import {RotationControls} from "./Rotating/RotatingControls";
import {RepeatingControls} from "./Repeating/RepeatingControls";
import {SelectionControls} from "./SelectionControls";
import {MaskParams} from "../../store/patterns/mask/types";
import {RotationValue} from "../../store/patterns/rotating/types";
import {ImportParams} from "../../store/patterns/import/types";
import {PatternConfig, UpdateOptions} from "../../store/patterns/pattern/types";
import {StoreState} from "../../store/patterns/store/types";
import {Segments, SelectionState} from "../../store/patterns/selection/types";
import {VideoControls} from "./VideoControls";
import {withTranslation, WithTranslation} from "react-i18next";
import {File} from "../_shared/File/File";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {updateMask} from "../../store/patterns/mask/actions";
import {doublePattern, editConfig, updateImage} from "../../store/patterns/pattern/actions";
import {setImportParams} from "../../store/patterns/import/actions";
import {RoomControls} from "./Room/RoomControls";
import {BlurControls} from "./Blur/BlurControls";
import '../../styles/inputNumber.scss';
import {createPatternFromSelection, cutPatternBySelection} from "../../store/patterns/selection/actions";
import {ButtonHK} from "../_shared/buttons/hotkeyed/ButtonHK";
import {setDemonstrationEnabled} from "../../store/patterns/demonstration/actions";
import {MaskControls} from "./Mask/MaskControls";
import {DragAndDrop} from "../_shared/File/DragAndDrop/DragAndDrop";
import {readImageFile} from "../_shared/File/helpers";
import {setDrawer} from "../../store/patterns/room/actions";
import {DeleteButton} from "../_shared/buttons/complex/DeleteButton/DeleteButton";

export interface PatternComponentStateProps {

    error?: any
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

    persistDrawer: boolean

    autofocus: boolean
    autoblur: boolean
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

    setDrawer(patternId: string, persist?: boolean)

}

export interface PatternComponentOwnProps {
    id: string
    index: number

    onMouseEnter?(patternId: string, e?)

    onMouseLeave?(patternId: string, e?)
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
    error?
}

const inputNumberProps = {min: 0, max:null, step: 1, delay: 1000, notZero: true};

export class PatternComponent extends React.PureComponent<PatternComponentProps, PatternComponentState> {

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.log(error);
        this.setState({error});
    }

    handleImageChange = imageData => this.props.updateImage({id: this.props.id, imageData});

    handleMaskChange = imageData => this.props.updateMask(this.props.id, imageData);

    handleSelectionChange = (value, bBox: SVGRect) =>
        this.props.onSelectionChange(this.props.id, value, bBox);

    handleRemove = () => this.props.onRemove(this.props.id);

    handleDouble = () => this.props.doublePattern(this.props.id);

    handleSetWidth = newWidth => {
        const {onSetWidth, width, id} = this.props;
        if (width !== newWidth) {
            onSetWidth(id, newWidth)
        }
    };

    handleSetHeight = newHeight => {
        const {onSetHeight, height, id} = this.props;
        if (height !== newHeight) {
            onSetHeight(id, newHeight)
        }
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
        this.props.createPatternFromSelection(this.props.id)
    };
    handleCutBySelection = () => {
        this.props.cutPatternBySelection(this.props.id)
    };

    handleMouseEnter = (e) => {
        const {onMouseEnter, id} = this.props;

        onMouseEnter?.(id, e);
    };

    handleMouseLeave = (e) => {
        const {onMouseLeave, id} = this.props;

        onMouseLeave?.(id, e);
    };

    handleDemonstrationUnload = () => {

        const {setDemonstrationEnabled, id} = this.props;

        setDemonstrationEnabled?.(id, false);
    };

    handleDropFiles = async (files) => {
        const {onLoad, id} = this.props;
        const image = await readImageFile(files?.[0]);

        onLoad?.(id, image)
    };

    handleEnterDraw = () => {
        const {setDrawer, id, persistDrawer} = this.props;
        !persistDrawer && setDrawer(id);
    };
    handleLeaveDraw = () => {
        const {setDrawer, id, persistDrawer} = this.props;
        !persistDrawer && setDrawer(id);
    };

    render() {
        if (this.state?.error || this.props.error) return 'error';
        const {
            imageValue, maskValue,
            height, width,
            id, index,
            config, selection, rotation,
            meDrawer,
            demonstration,
            t,
            autoblur, autofocus
        } = this.props;

        return (
            <DragAndDrop onDrop={this.handleDropFiles}>
                <div
                    className="pattern"
                    id={'pattern' + id}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                >
                    <div className="left">

                        <div className="flex-col">

                            {config.repeating &&
                            <RepeatingControls patternId={id}/>}

                            {config.video &&
                            <VideoControls patternId={id}/>}

                            {config.blur &&
                            <BlurControls patternId={id}/>}

                            {config.rotation &&
                            <RotationControls patternId={id}/>}

                            {config.room &&
                            <RoomControls patternId={id}/>}

                            <div className={'flex-row'}>
                                <ButtonHK
                                    path={`pattern.${id}.repeating`}
                                    name={"repeating"}
                                    hkLabel={'pattern.hotkeysDescription.config.repeating'}
                                    hkData1={id}
                                    selected={config.repeating}
                                    onClick={this.handleConfigToggle}
                                >
                                    {t('plugins.repeating')}</ButtonHK>
                                <ButtonHK
                                    path={`pattern.${id}.room`}
                                    name={"room"}
                                    hkLabel={'pattern.hotkeysDescription.config.room'}
                                    hkData1={id}
                                    selected={config.room}
                                    onClick={this.handleConfigToggle}
                                >
                                    {t('plugins.room')}</ButtonHK>
                                <ButtonHK
                                    path={`pattern.${id}.video`}
                                    name={"video"}
                                    hkLabel={'pattern.hotkeysDescription.config.video'}
                                    hkData1={id}
                                    selected={config.video}
                                    onClick={this.handleConfigToggle}
                                >
                                    {t('plugins.video')}</ButtonHK>
                                <ButtonHK
                                    path={`pattern.${id}.rotation`}
                                    name={"rotation"}
                                    hkLabel={'pattern.hotkeysDescription.config.rotation'}
                                    hkData1={id}
                                    selected={config.rotation}
                                    onClick={this.handleConfigToggle}
                                >
                                    {t('plugins.rotating')}</ButtonHK>
                                <ButtonHK
                                    path={`pattern.${id}.mask`}
                                    name={"mask"}
                                    hkLabel={'pattern.hotkeysDescription.config.mask'}
                                    hkData1={id}
                                    selected={config.mask}
                                    onClick={this.handleConfigToggle}
                                >
                                    {t('plugins.mask')}</ButtonHK>
                                <ButtonHK
                                    path={`pattern.${id}.blur`}
                                    name={"blur"}
                                    hkLabel={'pattern.hotkeysDescription.config.blur'}
                                    hkData1={id}
                                    selected={config.blur}
                                    onClick={this.handleConfigToggle}
                                >
                                    {t('plugins.blur')}</ButtonHK>
                            </div>

                        </div>
                        <div className={'flex-row'}>
                            {config.history &&
                            <HistoryControls patternId={id}/>}
                            <div className={'flex-col'}>
                                <div className={'flex-row'}>
                                    <InputNumber
                                        autoblur={autoblur}
                                        autofocus={autofocus}
                                        className={"size-input-number"}
                                        onChange={this.handleSetWidth}
                                        value={width}
                                        {...inputNumberProps}/>
                                    <InputNumber
                                        autoblur={autoblur}
                                        autofocus={autofocus}
                                        className={"size-input-number"}
                                        onChange={this.handleSetHeight}
                                        value={height}
                                        {...inputNumberProps}/>
                                </div>
                                <div className={'flex-row'}>
                                    <ButtonHK
                                        selected={this.props.importParams.fit}
                                        onClick={this.handleFitChange}>{t('patternControls.stretch')}</ButtonHK>
                                    <File
                                        autofocus={autofocus}
                                        autoblur={autofocus}

                                        name={id + '-fileInput'}
                                        onChange={this.handleLoad}>{t('patternControls.load')}</File>
                                </div>
                            </div>

                        </div>
                        <div className="flex-row">

                            <DeleteButton
                                title={`${index + 1} ${t('utils.p')}${id}`}
                                deleteText={t('utils.delete')}
                                onDoubleClick={this.handleRemove}
                            />
                            <ButtonHK
                                hkLabel={'pattern.hotkeysDescription.double'}
                                hkData1={id}
                                path={`pattern.${id}.double`}
                                onClick={this.handleDouble}>{t('patternControls.double')}</ButtonHK>
                            <ButtonHK
                                hkLabel={'pattern.hotkeysDescription.save'}
                                hkData1={id}
                                path={`pattern.${id}.save`}
                                onClick={this.handleSave}>{t('patternControls.save')}</ButtonHK>

                        </div>
                    </div>

                    <div className="right">
                        <SelectionControls
                            patternId={id}
                        />

                        <div className={"areas"}>
                            <Area
                                // onEnterDraw={this.handleEnterDraw}
                                // onLeaveDraw={this.handleLeaveDraw}

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
                            {config.mask && (
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
                                    onImageChange={this.handleMaskChange}
                                >

                                    <MaskControls
                                        patternId={id}
                                    />
                                </Area>
                            )}
                        </div>
                    </div>

                </div>
            </DragAndDrop>
        );
    }
}


const mapStateToProps: MapStateToProps<PatternComponentStateProps, PatternComponentOwnProps, AppState> = (state, {id}) => {
    const pattern = state.patterns[id];
    return {
        error: pattern.error,
        importParams: pattern.import.params,
        meDrawer: !pattern.room?.value?.connected || pattern.room?.value?.meDrawer,
        config: pattern.config,
        width: pattern.current.imageData.width,
        height: pattern.current.imageData.height,
        selection: pattern?.selection,
        rotation: pattern.config.rotation ? pattern?.rotation?.value : null,
        imageValue: pattern?.current?.imageData || null,
        maskValue: pattern?.mask?.value?.imageData || null,
        demonstration: pattern?.demonstration?.value?.enabled,
        persistDrawer: pattern?.room?.value?.persistMeDrawer,
        autofocus: state.hotkeys.autofocus,
        autoblur: state.hotkeys.autoblur,
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
    setDrawer
};

export const Pattern = connect<PatternComponentStateProps, PatternComponentActionProps, PatternComponentOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation("common")(PatternComponent));

