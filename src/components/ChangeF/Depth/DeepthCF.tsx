import * as React from "react";
import {ButtonNumberCF} from "../../_shared/buttons/hotkeyed/ButtonNumberCF";
import "./depthChangeFunction.scss";
import {ValueD} from "../../_shared/buttons/complex/ButtonNumber";
import {CycledToggle} from "../../_shared/buttons/simple/CycledToggle";
import {Button} from "../../_shared/buttons/simple/Button";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState, useDispatch} from "../../../store";
import {addDepthCfPattern, changeCFParams, removeDepthCfPattern} from "../../../store/changeFunctions/actions";
import {PatternsSelect} from "../../PatternsSelect";
import {HelpTooltip} from "../../tutorial/HelpTooltip";
import {ChannelImageData} from "../../_shared/canvases/WebWorkerCanvas";
import {CycledToggleHK} from "../../_shared/buttons/hotkeyed/CycledToggleHK";
import {withTranslation, WithTranslation} from "react-i18next";
import {ChangeFunctionState} from "../../../store/changeFunctions/types";
import {ButtonHK} from "../../_shared/buttons/hotkeyed/ButtonHK";
import {ParamConfig} from "../../_shared/Params.types";
import {bindChannelPreview, bindPreview, unbindPreview} from "../../../store/patterns/pattern/actions";
import {useEffect} from "react";
import {CfDepthParams} from "../../../store/changeFunctions/functions/depth";
import {coordHelper5} from "../../Area/canvasPosition.servise";

export interface DepthCFStateProps {
    tutorial: boolean
    params: any
    functionParams: ChangeFunctionState
    // patternsImageData: {
    //     [patternId: string]: ImageData
    // }
    patternsCount: number
}

export interface DepthCFActionProps {
    changeCFParams(name: string, params: any)

    addDepthCfPattern(name: string, patternId: string)
    removeDepthCfPattern(name: string, index: number)
}

export interface DepthCFOwnProps {
    name: string

}

export interface DepthCFProps extends DepthCFStateProps, DepthCFActionProps, DepthCFOwnProps, WithTranslation {

}

export interface DepthCFState {

}

const seRange = [0, 1] as [number, number];
const seValueD = ValueD.VerticalLinear(100);

const componentsSelectItems = [
    {text: 'red', value: 0},
    {text: 'green', value: 1},
    {text: 'blue', value: 2},
    {text: 'alpha', value: 3},
];

const channelName = ['r', 'g', 'b', 'a'];

export class DepthCFComponent extends React.PureComponent<DepthCFProps, DepthCFState> {

    patternButtonRef;

    constructor(props) {
        super(props);
        this.patternButtonRef = React.createRef();

    }

    handleParamChange = (index, name, value) => {
        const items = this.props.params.items;
        items[index] = {
            ...items[index],
            [name]: value
        };
        this.props.changeCFParams(this.props.name, {...this.props.params, items})
    };

    handleDeleteItem = (index) => {
        this.props.removeDepthCfPattern(this.props.name, index);
    };

    handleSelectPattern = (value, added, removed) => {
        if (added || removed) {
            this.props.addDepthCfPattern(this.props.name, added || removed)
        }
    };

    channelsGetText = (item) => {
        const {t} = this.props;
        return t('cf.types.rgba.channel.' + item.text);
    };

    render() {
        const {params, name, t, functionParams} = this.props;

        const {items} = params;

        return (
            <div className={"depth-change-function"}>
                <div className={'depth-select-pattern'}>
                    <ButtonHK
                        ref={this.patternButtonRef}
                        className={'depth-select-pattern-button'}
                    >
                        {t('utils.pattern')}
                    </ButtonHK>
                    <PatternsSelect
                        HK={false}
                        blurOnClick
                        value={items.map(({patternId}) => patternId)}
                        onChange={this.handleSelectPattern}
                    />
                </div>

                {params.items.map((item, index) => (
                    <DepthCFPatternItem
                        key={item.id}
                        index={index}
                        functionParams={functionParams}
                        onDelete={this.handleDeleteItem}
                        onParamChange={this.handleParamChange}
                    />)
                )}
            </div>
        );
    }
}

export interface DepthCFPatternItemProps extends WithTranslation {
    index: number
    onDelete: (index: number) => void
    onParamChange: (index: number, name: string, value: any) => void
    functionParams: ChangeFunctionState
}

export const DepthCFPatternItem = withTranslation("common")((props: DepthCFPatternItemProps) => {
    const {t, onDelete, index, onParamChange, functionParams} = props;
    const item = (functionParams.params as CfDepthParams).items[index];
    const name = functionParams.id;
    const itemId = item.id;

    const previewId = name + '-' + item.patternId + '-' + item.id;

    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

    const dispatch = useDispatch();

    const handleDelete = React.useCallback(() => {
        onDelete(index);
    }, [index, onDelete, previewId, item.patternId]);

    const handleParamChange = React.useCallback((data) => {
        const {value, name} = data;
        onParamChange(index, name, value);
    }, [index, onParamChange]);

    const channelsGetText = React.useCallback((item) => {
        return t('cf.types.rgba.channel.' + item.text);
    }, [t]);

    const handleCanvasRef = React.useCallback((canvas: HTMLCanvasElement) => {
        canvasRef.current = canvas;
        if (canvas) dispatch(bindChannelPreview(item.patternId, previewId, canvas));
    }, [item.patternId, previewId]);

    useEffect(() => () => {
        dispatch(unbindPreview(item.patternId, previewId));
    }, [previewId, item.patternId])

    return (
        <div className={'depth-item'}>
            <div className={'depth-item-canvas'}>
                <canvas
                    width={68}
                    height={58}
                    ref={handleCanvasRef}
                />
                <ButtonHK onClick={handleDelete}>{t('utils.delete')}</ButtonHK>
            </div>
            <div className={'depth-item-controls'}>
                <CycledToggleHK
                    path={`changeFunctions.functions.${name}.params.items.${index}.component`}
                    hkLabel={'cf.hotkeysDescription.rgba.component'}
                    hkData1={functionParams.number}
                    name={'component'}
                    value={item.component}
                    items={componentsSelectItems}
                    getText={channelsGetText}
                    onChange={handleParamChange}
                />
                <ButtonNumberCF
                    pres={2}
                    path={`changeFunctions.functions.${name}.params.items.${index}.zd`}
                    hkLabel={'cf.hotkeysDescription.rgba.zd'}
                    hkData1={functionParams.number}
                    value={item.zd}
                    name={"zd"}
                    range={seRange}
                    valueD={100}
                    onChange={handleParamChange}
                />
                <ButtonNumberCF
                    path={`changeFunctions.functions.${name}.params.items.${index}.zed`}
                    hkLabel={'cf.hotkeysDescription.rgba.zed'}
                    hkData1={functionParams.number}
                    value={item.zed}
                    name={"zed"}
                    range={seRange}
                    pres={2}
                    valueD={100}
                    onChange={handleParamChange}
                />
            </div>
        </div>
    );
});

const mapStateToProps: MapStateToProps<DepthCFStateProps, DepthCFOwnProps, AppState> = (state, {name}) => ({
    tutorial: state.tutorial.on,
    functionParams: state.changeFunctions.functions[name],
    params: state.changeFunctions.functions[name].params,
    // patternsImageData: state.changeFunctions.functions[name].params.items.reduce((res, {patternId}) => {
    //     res[patternId] = state.patterns[patternId]?.current.imageData;
    //     return res;
    // }, {}),
    patternsCount: Object.keys(state.patterns).length,
});

const mapDispatchToProps: MapDispatchToProps<DepthCFActionProps, DepthCFOwnProps> = {
    changeCFParams,
    addDepthCfPattern,
    removeDepthCfPattern,
};

export const DepthCF = connect<DepthCFStateProps, DepthCFActionProps, DepthCFOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(DepthCFComponent));
