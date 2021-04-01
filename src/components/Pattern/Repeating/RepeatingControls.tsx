import * as React from "react";
import {ERepeatsType, RepeatsParams} from "../../../store/patterns/repeating/types";
import './repeatingControls.scss';
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {WithTranslation, withTranslation} from "react-i18next";
import {AppState} from "../../../store";
import {Resizable} from "../../_shared/Resizable";
import {BezierGridPrimary} from "./BezierGrid/BezierGridPrimary";
import {BezierGridSecondary} from "./BezierGrid/BezierGridSecondary";
import {PrimaryComponentType, SecondaryComponentType} from "./types";
import {setType} from "../../../store/patterns/repeating/actions";
import {SelectDrop} from "../../_shared/buttons/complex/SelectDrop";
import {enumToSelectItems} from "../../../utils/utils";
import {FlatGridPrimary} from "./FlatGrid/FlatGridPrimary";
import {FlatGridSecondary} from "./FlatGrid/FlatGridSecondary";

export interface RepeatingControlsStateProps {
    params: RepeatsParams
}

export interface RepeatingControlsActionProps {
    setType: typeof setType
}

export interface RepeatingControlsOwnProps {
    patternId: string
}

export interface RepeatingControlsProps extends RepeatingControlsStateProps, RepeatingControlsActionProps, RepeatingControlsOwnProps, WithTranslation {

}

const primaryComponentByType = {
    [ERepeatsType.BezierGrid]: BezierGridPrimary,
    [ERepeatsType.FlatGrid]: FlatGridPrimary,
};
const secondaryComponentByType = {

    [ERepeatsType.BezierGrid]: BezierGridSecondary,
    [ERepeatsType.FlatGrid]: FlatGridSecondary,
};

const typesSelectItems = enumToSelectItems(ERepeatsType).filter(({value}) =>
    [ERepeatsType.FlatGrid, ERepeatsType.BezierGrid].includes(value));

export const RepeatingControlsComponent: React.FC<RepeatingControlsProps> = (props) => {

    const {params, patternId, setType, t} = props;

    const {type} = params;

    const PrimaryComponent: PrimaryComponentType = primaryComponentByType[type];
    const SecondaryComponent: SecondaryComponentType = secondaryComponentByType[type];

    const handleChangeType = React.useCallback((data) => {
        setType(patternId, data.value);
    }, [setType, patternId]);

    const getTypeText = React.useCallback((item) => {
        return t('pattern.repeating.type.' + item.value);
    }, [t]);

    return (
        <div className={'repeating-controls'}>
            <div className={'repeating-controls-grid'}>
                {PrimaryComponent && (
                    <PrimaryComponent patternId={patternId}/>
                )}
                <SelectDrop
                    className='repeating-button type-select'
                    items={typesSelectItems}
                    getText={getTypeText}
                    onChange={handleChangeType}
                    hkLabel={'pattern.hotkeysDescription.repeating.type'}
                    hkData1={patternId}
                    value={type}/>
                <Resizable
                    height={140}
                    minHeight={3}
                    maxHeight={140}
                    wrapperClassName={'resizable-wrapper'}
                >
                    {SecondaryComponent && (
                        <SecondaryComponent patternId={patternId}/>
                    )}
                </Resizable>
            </div>
        </div>
    );
}


const mapStateToProps: MapStateToProps<RepeatingControlsStateProps, RepeatingControlsOwnProps, AppState> = (state, {patternId}) => ({
    params: state.patterns[patternId]?.repeating?.params || null
});

const mapDispatchToProps: MapDispatchToProps<RepeatingControlsActionProps, RepeatingControlsOwnProps> = {
    setType,
};

export const RepeatingControls = connect<RepeatingControlsStateProps, RepeatingControlsActionProps, RepeatingControlsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(RepeatingControlsComponent));