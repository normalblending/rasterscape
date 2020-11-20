import * as React from "react";
import * as classNames from "classnames";
import {Button} from "../_shared/buttons/simple/Button";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {removeCF} from "../../store/changeFunctions/actions";
import {withTranslation, WithTranslation} from "react-i18next";
import {ChangeFunction, ECFType} from "../../store/changeFunctions/types";
import {WaveCF} from "./Wave";
import {FxyCF} from "./Fxy";
import {DepthCF} from "./Depth/DeepthCF";

export interface ChangeFItemStateProps {
    changeFunction: ChangeFunction
}

export interface ChangeFItemActionProps {

    removeCF(name: string)
}

export interface ChangeFItemOwnProps {
    id: string
    highlighted: boolean
}

export interface ChangeFItemProps extends ChangeFItemStateProps, ChangeFItemActionProps, ChangeFItemOwnProps, WithTranslation {

}

const CFComponentByType = {
    [ECFType.WAVE]: WaveCF,
    [ECFType.FXY]: FxyCF,
    [ECFType.DEPTH]: DepthCF,
};


const ChangeFItemComponent: React.FC<ChangeFItemProps> = (props) => {
    const {
        t,
        id,
        highlighted,
        changeFunction,
        removeCF,
    } = props;

    const {
        type,
        number,
    } = changeFunction;

    const Component = CFComponentByType[type];

    const handleDelete = React.useCallback(({value}) => {
        removeCF(value);
    }, [removeCF]);

    return (
        <div
            className={classNames('function-container', {
                ['highlighted']: highlighted
            })}
            key={id}
        >
            <div className={'function-title'}>
                <Button className={'function-id'}>{t('cf.hotkeysDescription.type.' + type) + number}</Button>
                <Button
                    value={id}
                    onDoubleClick={handleDelete}
                    className={'function-delete'}>{t('utils.delete')}</Button>
            </div>
            <Component name={id}/>
        </div>
    )
};


const mapStateToProps: MapStateToProps<ChangeFItemStateProps, ChangeFItemOwnProps, AppState> = (state, {id}) => ({
    changeFunction: state.changeFunctions.functions[id]
});

const mapDispatchToProps: MapDispatchToProps<ChangeFItemActionProps, ChangeFItemOwnProps> = {
    removeCF
};

export const ChangeFItem = connect<ChangeFItemStateProps, ChangeFItemActionProps, ChangeFItemOwnProps, AppState>(
    mapStateToProps, mapDispatchToProps
)(withTranslation('common')(ChangeFItemComponent));