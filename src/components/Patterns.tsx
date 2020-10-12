import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../store";
import {Button} from "./_shared/buttons/simple/Button";
import {
    addPattern,
    removePattern
} from "../store/patterns/actions";
import {Pattern} from "./Pattern/";
import {PatternConfig} from "../store/patterns/pattern/types";
import {setMaskParams, updateMask} from "../store/patterns/mask/actions";
import {createPatternFromSelection, cutPatternBySelection, updateSelection} from "../store/patterns/selection/actions";
import {load, save} from "../store/patterns/import/actions";
import {doublePattern, setHeight, setWidth} from "../store/patterns/pattern/actions";
import {MaskParams} from "../store/patterns/mask/types";
import {Segments} from "../store/patterns/selection/types";
import {withTranslation, WithTranslation} from "react-i18next";
import {AddPatternHelp} from "./tutorial/tooltips/AddPatternHelp";
import {whyDidYouRender} from "../utils/props";
import {Resizable, ResizableBox} from 'react-resizable';
import 'react-resizable/css/styles.css';
import {Key} from "./_shared/Key";
import {setActivePattern} from "../store/activePattern";
import {PatternsHotkeys} from "./PatternsHotkeys";

export interface PatternsStateProps {
    patterns: any
}

export interface PatternsActionProps {
    addPattern(config?: PatternConfig)

    removePattern(id: string)

    updateMask(id: string, imageData: ImageData)

    setMaskParams(id: string, params: MaskParams)

    updateSelection(id: string, value: Segments, bBox: SVGRect)

    setWidth(id: string, value: number)

    setHeight(id: string, value: number)


    save(id: string)

    load(id: string, image)

    setActivePattern: typeof setActivePattern

}

export interface PatternsOwnProps {

}

export interface PatternsProps extends PatternsStateProps, PatternsActionProps, PatternsOwnProps, WithTranslation {

}

export interface PatternsState {

}

class PatternsComponent extends React.PureComponent<PatternsProps, PatternsState> {

    componentDidUpdate(prevProps: Readonly<PatternsProps>, prevState: Readonly<PatternsState>, snapshot?: any): void {
        // whyDidYouRender(this.props, prevProps, 'PatternsComponent')
    }

    handleAddClick = () => this.props.addPattern({history: true, selection: true, repeating: false});

    render() {
        const {
            patterns, removePattern,
            updateSelection, setWidth,
            setHeight,
            save, load,
            t,
            setActivePattern,
        } = this.props;
        return (
            <>
                {patterns.map(({id, store, connected, resultImage}) => {
                    return (
                        <Pattern
                            key={id}
                            id={id}

                            onMouseEnter={setActivePattern}

                            connected={connected}

                            store={store}
                            resultImage={resultImage}


                            onSelectionChange={updateSelection}
                            onRemove={removePattern}
                            onSetWidth={setWidth}
                            onSetHeight={setHeight}

                            onSave={save}
                            onLoad={load}
                        />
                    );
                })}
                <PatternsHotkeys/>
                <div className={'zero-pattern'}>
                    <Button onClick={this.handleAddClick}>{t("add")}</Button>
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
    updateSelection,
    setWidth,
    setHeight,
    updateMask,
    save,
    load,
    setActivePattern,
};

export const Patterns = connect<PatternsStateProps, PatternsActionProps, PatternsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation("common")(PatternsComponent));