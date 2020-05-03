import * as React from "react";
import {ParamConfig} from "../_shared/Params";
import {ButtonNumberCF} from "../_shared/buttons/ButtonNumberCF";
import "../../styles/depthChangeFunction.scss";
import {ValueD} from "../_shared/buttons/ButtonNumber";
import {File} from "../_shared/File";
import {imageToImageData} from "../../utils/canvas/helpers/imageData";
import {Canvas} from "../_shared/Canvas";
import {CycledToggle} from "../_shared/buttons/CycledToggle";
import {ImageDataCanvas} from "../_shared/canvases/ImageData";
import {Button, SelectDrop} from "bbuutoonnss";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {changeCFParams} from "../../store/changeFunctions/actions";
import {PatternsSelect} from "../PatternsSelect";
import {HelpTooltip} from "../tutorial/HelpTooltip";

export interface DepthCFStateProps {
    tutorial: boolean
    params: any
    paramsConfig: ParamConfig[]
    patternsImageData: {
        [patternId: string]: ImageData
    }
    patternsCount: number
}

export interface DepthCFActionProps {
    changeCFParams(name: string, params: any)
}

export interface DepthCFOwnProps {
    name: string

}

export interface DepthCFProps extends DepthCFStateProps, DepthCFActionProps, DepthCFOwnProps {

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

    handleParamChange = (index) => (data) => {
        const {value, name} = data;
        const items = this.props.params.items;
        items[index] = {
            ...items[index],
            [name]: value
        };
        this.props.changeCFParams(this.props.name, {...this.props.params, items})
    };

    handleDeleteItem = (index) => () => {
        this.props.changeCFParams(this.props.name, {
            ...this.props.params,
            items: this.props.params.items.filter((item, i) => i !== index),
        })
    };

    handleSelectPattern = (value, added, removed) => {
        if (added || removed) {
            this.props.changeCFParams(this.props.name, {
                ...this.props.params,
                items: [...this.props.params.items, {
                    patternId: added || removed,
                    zd: 0,
                    zed: 1,
                    component: 0
                }],
            })
        }
    };

    helpText = {
        addPatterns: <span>add pattern to be able to chose it here</span>,
        chosePattern: <span>chose pattern to use its color data<br/> as a coordinate function</span>,
    };

    render() {
        const {params, name, patternsImageData, patternsCount} = this.props;

        const {items} = params;

        return (
            <div className={"depth-change-function"}>
                <HelpTooltip secondaryMessage={!patternsCount ? this.helpText.addPatterns : (!items.length && this.helpText.chosePattern)}>
                    <Button className={'depth-select-pattern-button'}>
                        pattern
                        <PatternsSelect
                            value={items.map(({patternId}) => patternId)}
                            onChange={this.handleSelectPattern}
                        />
                    </Button>
                </HelpTooltip>

                {params.items.map((item, index) => !!patternsImageData[item.patternId] &&
                    <div className={'depth-item'}>
                        <div className={'depth-item-canvas'}>
                            <ImageDataCanvas
                                from={item.zd}
                                scale={item.zed}
                                channel={channelName[item.component]}
                                // onClick={this.handleDeleteItem(index)}
                                width={68}
                                height={58}
                                imageData={patternsImageData[item.patternId]}/>
                            <Button onClick={this.handleDeleteItem(index)}>delete</Button>
                        </div>
                        <div className={'depth-item-controls'}>
                            <CycledToggle
                                name={'component'}
                                value={item.component}
                                items={componentsSelectItems}
                                onChange={this.handleParamChange(index)}
                            />
                            <ButtonNumberCF
                                pres={2}
                                path={`changeFunctions.functions.${name}.params.items.${index}.zd`}
                                value={item.zd}
                                name={"zd"}
                                range={seRange}
                                valueD={100}
                                onChange={this.handleParamChange(index)}
                            />
                            <ButtonNumberCF
                                path={`changeFunctions.functions.${name}.params.items.${index}.zed`}
                                value={item.zed}
                                name={"zed"}
                                range={seRange}
                                pres={2}
                                valueD={100}
                                onChange={this.handleParamChange(index)}
                            />
                        </div>
                    </div>)}


            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<DepthCFStateProps, DepthCFOwnProps, AppState> = (state, {name}) => ({
    tutorial: state.tutorial.on,
    params: state.changeFunctions.functions[name].params,
    paramsConfig: state.changeFunctions.functions[name].paramsConfig,
    patternsImageData: state.changeFunctions.functions[name].params.items.reduce((res, {patternId}) => {
        res[patternId] = state.patterns[patternId]?.current.imageData;
        return res;
    }, {}),
    patternsCount: Object.keys(state.patterns).length,
});

const mapDispatchToProps: MapDispatchToProps<DepthCFActionProps, DepthCFOwnProps> = {
    changeCFParams
};

export const DepthCF = connect<DepthCFStateProps, DepthCFActionProps, DepthCFOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(DepthCFComponent);
