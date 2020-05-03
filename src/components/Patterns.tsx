import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../store";
import {Button} from "./_shared/buttons/Button";
import {
    addPattern,
    removePattern
} from "../store/patterns/actions";
import {Pattern} from "./Pattern/";
import {PatternConfig} from "../store/patterns/pattern/types";
import {setMaskParams, updateMask} from "../store/patterns/mask/actions";
import {createPatternFromSelection, cutPatternBySelection, updateSelection} from "../store/patterns/selection/actions";
import {redo, undo} from "../store/patterns/history/actions";
import {setRotation} from "../store/patterns/rotating/actions";
import {setRepeating} from "../store/patterns/repeating/actions";
import {load, save, setImportParams} from "../store/patterns/import/actions";
import {createRoom} from "../store/patterns/room/actions";
import {doublePattern, editConfig, setHeight, setWidth, updateImage} from "../store/patterns/pattern/actions";
import {EPatternType} from "../store/patterns/types";
import {MaskParams} from "../store/patterns/mask/types";
import {Segments} from "../store/patterns/selection/types";
import {RotationValue} from "../store/patterns/rotating/types";
import {RepeatingParams} from "../store/patterns/repeating/types";
import {ImportParams} from "../store/patterns/import/types";
import {onNewFrame, setVideoParams} from "../store/patterns/video/actions";
import {VideoParams} from "../store/patterns/video/types";
import {withTranslation, WithTranslation} from "react-i18next";
import {AddPatternHelp} from "./tutorial/tooltips/AddPatternHelp";

export interface PatternsStateProps {
    patterns: any
}

export interface PatternsActionProps {
    addPattern(config?: PatternConfig)

    removePattern(id: string)

    doublePattern(id: string)

    updateImage(id: string, imageData: ImageData)

    updateMask(id: string, imageData: ImageData)

    setMaskParams(id: string, params: MaskParams)

    updateSelection(id: string, value: Segments, bBox: SVGRect)

    setWidth(id: string, value: number)

    setHeight(id: string, value: number)


    createRoom(id: string, name: string)


    save(id: string)

    load(id: string, image)

    createPatternFromSelection(id: string)

    cutPatternBySelection(id: string)

}

export interface PatternsOwnProps {

}

export interface PatternsProps extends PatternsStateProps, PatternsActionProps, PatternsOwnProps, WithTranslation {

}

export interface PatternsState {

}

class PatternsComponent extends React.PureComponent<PatternsProps, PatternsState> {

    handleAddClick = () => this.props.addPattern({history: true, selection: true, rotation: true, repeating: false});

    render() {
        const {
            patterns,
            createRoom, removePattern, updateImage, updateMask,
            setMaskParams, updateSelection, setWidth,
            setHeight,
            save, load,
            createPatternFromSelection, doublePattern, cutPatternBySelection,
            t,
        } = this.props;
        return (
            <>
                {patterns.map(({id, current, mask, config, store, selection, connected, resultImage, rotation, import: loading}) => {
                    return (
                        <Pattern
                            key={id}
                            id={id}

                            connected={connected}

                            store={store}
                            resultImage={resultImage}




                            onImageChange={updateImage}
                            onMaskChange={updateMask}
                            onMaskParamsChange={setMaskParams}
                            onSelectionChange={updateSelection}
                            onRemove={removePattern}
                            onSetWidth={setWidth}
                            onSetHeight={setHeight}
                            onCreateRoom={createRoom}

                            onSave={save}
                            onLoad={load}
                            onCreatePatternFromSelection={createPatternFromSelection}
                            onDouble={doublePattern}
                            onCutBySelection={cutPatternBySelection}
                        />
                    );
                })}
                <div className={'zero-pattern'}>
                    <Button onClick={this.handleAddClick}>{t("add")}</Button>
                    <AddPatternHelp/>
                </div>
            </>
        );
    }
}

const mapStateToProps: MapStateToProps<PatternsStateProps, {}, AppState> = state => ({
    patterns: Object.values(state.patterns)
});

const mapDispatchToProps: MapDispatchToProps<PatternsActionProps, PatternsOwnProps> = {
    setMaskParams,
    createRoom,
    addPattern,
    removePattern,
    updateImage,
    updateSelection,
    setWidth,
    setHeight,
    updateMask,
    save,
    load,
    createPatternFromSelection,
    doublePattern,
    cutPatternBySelection,
};

export const Patterns = connect<PatternsStateProps, PatternsActionProps, PatternsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation("common")(PatternsComponent));