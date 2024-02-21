import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../../store";
import {BrushParams, EBrushType} from "../../../store/brush/types";
import {
    setBrushType,
    setShapeBrushParams,
    setPatternBrushParams,
    setSelectBrushParams
} from "../../../store/brush/actions";
import {ValueD} from "../../_shared/buttons/complex/ButtonNumber";
import {SelectButtons} from "../../_shared/buttons/complex/SelectButtons";
import "../../../styles/patternSelectButton.scss"
import '../../../styles/brush.scss'
import {withTranslation, WithTranslation} from "react-i18next";
import {brushTypeSelectItems} from "../../../store/brush/helpers";
import {PatternBrush} from "./Pattern";
import {SelectBrush} from "./Select";
import {ShapeBrush} from "./Shape";

export interface BrushStateProps {
    params: BrushParams
}

export interface BrushActionProps {
    setBrushType: typeof setBrushType,
    setShapeBrushParams: typeof setShapeBrushParams,
    setSelectBrushParams: typeof setSelectBrushParams,
    setPatternBrushParams: typeof setPatternBrushParams,
}

export interface BrushOwnProps {

}

export interface BrushProps extends BrushStateProps, BrushActionProps, BrushOwnProps, WithTranslation {

}

const sizeRange = [0, 200] as [number, number];
const sizeValueD = ValueD.VerticalLinear(0.5);

const patternSizeRange = [0, 5] as [number, number];
const patternSizeValueD = ValueD.VerticalLinear(125);

const opacityRange = [0, 1] as [number, number];
const opacityValueD = ValueD.VerticalLinear(100);

const opacityValueText = value => value.toFixed(2);
const patternSizeValueText = value => (value * 100).toFixed(0) + '%';

const BrushParamsComponentByType = {
    [EBrushType.Pattern]: PatternBrush,
    [EBrushType.Select]: SelectBrush,
    [EBrushType.Shape]: ShapeBrush,
};

const BrushComponent: React.FunctionComponent<BrushProps> = React.memo((props) => {

    const {params, t, setBrushType} = props;

    const handleTypeChange = React.useCallback(({value}) => {
        setBrushType(value)
    }, [setBrushType]);

    const selectTypeText = React.useMemo(() =>
        item => t(`brushTypes.${item.text.toLowerCase()}`), [t]);

    const BrushParamsComponent = BrushParamsComponentByType[params.brushType];
    return (
        <div className='brush-tool'>
            <SelectButtons
                name={'brushType'}
                hkLabel={'brush.type'}
                value={params.brushType}
                getText={selectTypeText}
                items={brushTypeSelectItems}
                onChange={handleTypeChange}
            />
            {BrushParamsComponent && (
                <BrushParamsComponent/>
            )}
        </div>
    );
});

BrushComponent.displayName = 'BrushComponent';


const mapStateToProps: MapStateToProps<BrushStateProps, BrushOwnProps, AppState> = state => ({
    params: state.brush.params,
});

const mapDispatchToProps: MapDispatchToProps<BrushActionProps, BrushOwnProps> = {
    setBrushType,
    setShapeBrushParams,
    setSelectBrushParams,
    setPatternBrushParams,
};

export const Brush = connect<BrushStateProps, BrushActionProps, BrushOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(BrushComponent));