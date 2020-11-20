import * as React from "react";
import {ParamConfig} from "../../_shared/Params";
import {ButtonNumberCF} from "../../_shared/buttons/hotkeyed/ButtonNumberCF";
import "./depthChangeFunction.scss";
import {ValueD} from "../../_shared/buttons/complex/ButtonNumber";
import {CycledToggle} from "../../_shared/buttons/simple/CycledToggle";
import {Button} from "../../_shared/buttons/simple/Button";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../../store";
import {changeCFParams} from "../../../store/changeFunctions/actions";
import {PatternsSelect} from "../../PatternsSelect";
import {HelpTooltip} from "../../tutorial/HelpTooltip";
import {ChannelImageData} from "../../_shared/canvases/WebWorkerCanvas";
import {CycledToggleHK} from "../../_shared/buttons/hotkeyed/CycledToggleHK";
import {withTranslation, WithTranslation} from "react-i18next";
import {ChangeFunction} from "../../../store/changeFunctions/types";
import {ButtonHK} from "../../_shared/buttons/hotkeyed/ButtonHK";

export interface DepthCFStateProps {
    tutorial: boolean
    params: any
    paramsConfig: ParamConfig[]
    functionParams: ChangeFunction
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

    channelsGetText = (item) => {
        const {t} = this.props;
        return t('cf.types.rgba.channel.' + item.text);
    };

    render() {
        const {params, name, patternsImageData, t, functionParams} = this.props;

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

                {params.items.map((item, index) => !!patternsImageData[item.patternId] &&
                    <div className={'depth-item'}>
                        <div className={'depth-item-canvas'}>
                            <ChannelImageData
                                params={item}
                                imageData={patternsImageData[item.patternId]}
                                width={68}
                                height={58}/>
                            <ButtonHK onClick={this.handleDeleteItem(index)}>{t('utils.delete')}</ButtonHK>
                        </div>
                        <div className={'depth-item-controls'}>
                            <CycledToggleHK
                                path={`changeFunctions.functions.${name}.params.items.${index}.component`}
                                hkLabel={'cf.hotkeysDescription.rgba.component'}
                                hkData1={functionParams.number}
                                name={'component'}
                                value={item.component}
                                items={componentsSelectItems}
                                getText={this.channelsGetText}
                                onChange={this.handleParamChange(index)}
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
                                onChange={this.handleParamChange(index)}
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
    functionParams: state.changeFunctions.functions[name],
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
)(withTranslation('common')(DepthCFComponent));
