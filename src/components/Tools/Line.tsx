import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {ButtonSelect} from 'bbuutoonnss';
import {AppState} from "../../store";
import {ParamConfig} from "../_shared/Params";
import {ELineType, LineParams} from "../../store/line/types";
import {setLineParams} from "../../store/line/actions";
import {createSelector} from "reselect";
import {SelectButtons} from "../_shared/buttons/complex/SelectButtons";
import {ButtonNumberCF} from "../_shared/buttons/hotkeyed/ButtonNumberCF";
import {SelectDrop} from "../_shared/buttons/complex/SelectDrop";
import {getPatternsSelectItems} from "../../store/patterns/selectors";
import {withTranslation, WithTranslation} from "react-i18next";
import '../../styles/lineTool.scss';
import {capsSelectItems, joinsSelectItems, randomSelectItems} from "../../store/line/helpers";
import {PatternsSelect} from "../PatternsSelect";
import {arrayToSelectItems} from "../../utils/utils";
import {CycledToggleHK} from "../_shared/buttons/hotkeyed/CycledToggleHK";
import {ButtonHK} from "../_shared/buttons/hotkeyed/ButtonHK";

export interface LineStateProps {
    paramsConfigMap: {
        [key: string]: ParamConfig
    }
    paramsConfig: ParamConfig[]
    paramsValue: LineParams
    patternsSelectItems: any[]
}

export interface LineActionProps {
    setLineParams(params: LineParams)
}

export interface LineOwnProps {

}

export interface LineProps extends LineStateProps, LineActionProps, LineOwnProps, WithTranslation {

}


const sizeRange = [0, 200] as [number, number];
const opacityRange = [0, 1] as [number, number];

const patternSizeValueText = value => (value * 100).toFixed(0) + '%';
const patternSizeRange = [0, 5] as [number, number];

const typeSelectItems = arrayToSelectItems(Object.values(ELineType))
    .filter(({value}) => [ELineType.Solid, ELineType.SolidPattern, ELineType.TrailingPattern].includes(value));

class LineComponent extends React.PureComponent<LineProps> {

    handleParamChange = (data) => {
        const {value, name} = data;
        const {setLineParams, paramsValue} = this.props;
        setLineParams({
            ...paramsValue,
            [name]: value
        })
    };
    handleToggledParamChange = (data) => {
        const {value, name} = data;
        const {setLineParams, paramsValue} = this.props;
        setLineParams({
            ...paramsValue,
            [name]: !value
        })
    };

    handlePatternChange = (pattern) => {
        const {setLineParams, paramsValue} = this.props;
        setLineParams({
            ...paramsValue,
            pattern
        })
    };

    compositeOperationText = ({value}) => this.props.t('line.compositeOperations.' + value);
    lineTypeText = ({text}) => this.props.t(`lineTypes.${text.toLowerCase()}`);
    capText = ({value}) => this.props.t('line.cap.' + value);
    joinText = ({value}) => this.props.t('line.join.' + value);
    randomTypeText = ({value}) => this.props.t('line.randomType.' + value);


    render() {
        const {paramsConfigMap, paramsValue, t} = this.props;
        return (
            <div className='line-tool'>
                <SelectButtons
                    hkLabel={'line.type'}
                    br={3}
                    value={paramsValue.type}
                    name={"type"}
                    getText={this.lineTypeText}
                    items={typeSelectItems}
                    onChange={this.handleParamChange}/>

                <div className='line-params'>


                    {(paramsValue.type === ELineType.Solid
                        || paramsValue.type === ELineType.SolidPattern) && (
                        <ButtonNumberCF
                            pres={0}
                            valueD={1}
                            path={"line.params.size"}
                            hkLabel={'line.hotkeysDescription.size'}
                            value={paramsValue.size}
                            name={"size"}
                            onChange={this.handleParamChange}
                            range={sizeRange}/>
                    )}
                    {(paramsValue.type === ELineType.TrailingPattern) && (

                        <ButtonNumberCF
                            pres={2}
                            valueD={100}
                            precisionGain={10}
                            path={"line.params.patternSize"}
                            hkLabel={'line.hotkeysDescription.patternSize'}
                            value={paramsValue.patternSize}
                            name={"patternSize"}
                            onChange={this.handleParamChange}
                            getText={patternSizeValueText}
                            range={patternSizeRange}/>
                    )}

                    <ButtonNumberCF
                        pres={2}
                        valueD={100}
                        precisionGain={5}
                        range={opacityRange}
                        path={"line.params.opacity"}
                        hkLabel={'line.hotkeysDescription.opacity'}
                        value={paramsValue.opacity}
                        name={"opacity"}
                        onChange={this.handleParamChange}/>
                    <SelectDrop
                        name={"compositeOperation"}
                        getText={this.compositeOperationText}
                        hkLabel={'line.hotkeysDescription.compositeOperations'}
                        value={paramsValue.compositeOperation}
                        items={paramsConfigMap["compositeOperation"].props.items}
                        onChange={this.handleParamChange}/>

                    {(paramsValue.type === ELineType.Pattern
                        || paramsValue.type === ELineType.SolidPattern) && (

                        <ButtonNumberCF
                            pres={2}
                            valueD={100}
                            precisionGain={10}
                            path={"line.params.patternSize"}
                            hkLabel={'line.hotkeysDescription.patternSize'}
                            value={paramsValue.patternSize}
                            name={"patternSize"}
                            onChange={this.handleParamChange}
                            getText={patternSizeValueText}
                            range={patternSizeRange}/>
                    )}

                    {paramsValue.type === ELineType.Solid && (
                        <CycledToggleHK
                            path={`line.randomType`}
                            name={"random"}
                            getText={this.randomTypeText}
                            value={paramsValue.random}
                            hkLabel={'line.hotkeysDescription.randomType'}
                            items={randomSelectItems}
                            onChange={this.handleParamChange}/>

                    )}

                    {(paramsValue.type === ELineType.SolidPattern
                        || paramsValue.type === ELineType.Solid) && (<>
                        <SelectDrop
                            name={"cap"}
                            getText={this.capText}
                            value={paramsValue.cap}
                            hkLabel={'line.hotkeysDescription.cap'}
                            items={capsSelectItems}
                            onChange={this.handleParamChange}/>
                        <SelectDrop
                            name={"join"}
                            getText={this.joinText}
                            value={paramsValue.join}
                            hkLabel={'line.hotkeysDescription.join'}
                            items={joinsSelectItems}
                            onChange={this.handleParamChange}/>
                    </>)}

                    {(paramsValue.type === ELineType.SolidPattern) && (<>
                        <ButtonHK
                            path={`line.patternMouseCentered`}
                            name={'patternMouseCentered'}
                            hkLabel={'line.hotkeysDescription.center'}
                            selected={paramsValue.patternMouseCentered}
                            value={paramsValue.patternMouseCentered}
                            onClick={this.handleToggledParamChange}
                        >{t('line.center')}</ButtonHK>
                    </>)}

                    {(paramsValue.type === ELineType.TrailingPattern) && (<>
                        <ButtonHK
                            path={`line.patternDirection`}
                            name={'patternDirection'}
                            hkLabel={'line.hotkeysDescription.direction'}
                            selected={paramsValue.patternDirection}
                            value={paramsValue.patternDirection}
                            onClick={this.handleToggledParamChange}
                        >{t('line.direction')}</ButtonHK>
                    </>)}

                </div>
                {(paramsValue.type === ELineType.Pattern
                    || paramsValue.type === ELineType.SolidPattern
                    || paramsValue.type === ELineType.TrailingPattern) && (
                    <PatternsSelect
                        name={'linePattern'}
                        hkLabel={'line.pattern'}
                        value={paramsValue.pattern}
                        onChange={this.handlePatternChange}
                    />
                )}
            </div>
        );
    }
}

const paramsConfigMapSelector = createSelector(
    [(state: AppState) => state.line.paramsConfig],
    (paramsConfig) => paramsConfig.reduce((res, paramConfig) => {
        res[paramConfig.name] = paramConfig;
        return res;
    }, {}));

const mapStateToProps: MapStateToProps<LineStateProps, LineOwnProps, AppState> = state => ({
    paramsConfig: state.line.paramsConfig,
    paramsConfigMap: paramsConfigMapSelector(state),
    paramsValue: state.line.params,
    patternsSelectItems: getPatternsSelectItems(state)
});

const mapDispatchToProps: MapDispatchToProps<LineActionProps, LineOwnProps> = {
    setLineParams
};

export const Line = connect<LineStateProps, LineActionProps, LineOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation("common")(LineComponent));