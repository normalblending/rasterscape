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
import {load, save} from "../store/patterns/import/actions";
import {doublePattern, setHeight, setWidth, updateImage} from "../store/patterns/pattern/actions";
import {MaskParams} from "../store/patterns/mask/types";
import {Segments} from "../store/patterns/selection/types";
import {withTranslation, WithTranslation} from "react-i18next";
import {AddPatternHelp} from "./tutorial/tooltips/AddPatternHelp";
import {whyDidYouRender} from "../utils/props";
import {Resizable, ResizableBox} from 'react-resizable';
import 'react-resizable/css/styles.css';

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

    componentDidUpdate(prevProps: Readonly<PatternsProps>, prevState: Readonly<PatternsState>, snapshot?: any): void {
        whyDidYouRender(this.props, prevProps, 'PatternsComponent')
    }

    handleAddClick = () => this.props.addPattern({history: true, selection: true, repeating: false});

    render() {
        const {
            patterns, removePattern,
            updateSelection, setWidth,
            setHeight,
            save, load,
            createPatternFromSelection, doublePattern, cutPatternBySelection,
            t,
        } = this.props;
        return (
            <>
                {patterns.map(({id, store, connected, resultImage}) => {
                    return (
                        <Pattern
                            key={id}
                            id={id}

                            connected={connected}

                            store={store}
                            resultImage={resultImage}


                            onSelectionChange={updateSelection}
                            onRemove={removePattern}
                            onSetWidth={setWidth}
                            onSetHeight={setHeight}

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