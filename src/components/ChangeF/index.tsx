import * as React from "react";
import * as classNames from "classnames";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {ChangeFunctions} from "../../store/changeFunctions/reducer";
import {addCF, changeCFParams, removeCF} from "../../store/changeFunctions/actions";
import {ECFType} from "../../store/changeFunctions/types";
import {Button} from "../_shared/buttons/simple/Button";
import {setChangingMode, startChanging, stopChanging} from "../../store/changing/actions";
import {ChangingMode} from "../../store/changing/types";
import {FxyCF} from "./Fxy";
import {getCFs} from "../../store/changeFunctions/selectors";
import {DepthCF} from "./Depth/DeepthCF";
import {WaveCF} from "./Wave";
import {enumToSelectItems} from "../../utils/utils";
import {CycledToggle} from "../_shared/buttons/simple/CycledToggle";
import {SelectDrop} from "../_shared/buttons/complex/SelectDrop";
import {SelectButtons} from "../_shared/buttons/complex/SelectButtons";

export interface ChangeFStateProps {
    cfs: ChangeFunctions
    changingMode: ChangingMode
    tutorial: boolean
    highlighted: string
    typeHighlighted: ECFType[]
}

export interface ChangeFActionProps {
    changeCFParams(id: string, params: any)

    addCF(cfType: ECFType)

    removeCF(id: string)

    startChanging()

    stopChanging()

    setChangingMode(mode: ChangingMode)
}

export interface ChangeFOwnProps {

}

export interface ChangeFProps extends ChangeFStateProps, ChangeFActionProps, ChangeFOwnProps {

}

export interface ChangeFState {

}

const CFComponentByType = {
    [ECFType.WAVE]: WaveCF,
    [ECFType.FXY]: FxyCF,
    [ECFType.DEPTH]: DepthCF,
};

const modesItems = enumToSelectItems(ChangingMode);

const getTypeValue = type => type;
const getTypeClassName = typeHighlighted => type => classNames({['highlighted']: typeHighlighted.includes(type)});
const typesItems = Object.values(ECFType);

const ChangeFComponent: React.FC<ChangeFProps> = (props) => {

    const {
        cfs,
        changingMode,
        highlighted,
        typeHighlighted,
        changeCFParams,
        removeCF,
        addCF,
        setChangingMode,
    } = props;

    const handleChange = React.useCallback((value, name) => {
        changeCFParams(name, value);

    }, [changeCFParams]);

    const handleDelete = React.useCallback(({value}) => {
        removeCF(value);
    }, [removeCF]);

    const handleAddCF = React.useCallback((data) => {
        addCF(data.value);
    }, [addCF]);

    const handleModeChange = React.useCallback(({value}) => {
        setChangingMode(value);
    }, [setChangingMode]);


    return (
        <div className="change-functions">
            <div className="control-buttons">

                <SelectButtons
                    // nullText=''
                    itemClassName={getTypeClassName(typeHighlighted)}
                    items={typesItems}
                    getText={getTypeValue}
                    getValue={getTypeValue}
                    onItemClick={handleAddCF}
                />
                {!!Object.values(cfs).length && (
                    <SelectButtons
                        className={classNames('modes', changingMode)}
                        items={modesItems}
                        value={changingMode}
                        onChange={handleModeChange}
                    />
                )}
                {/*<div className={classNames("change-functions-select", {*/}
                {/*    'change-functions-select-open': typeHighlighted?.length*/}
                {/*})}>*/}
                {/*    <Button>func</Button>*/}
                {/*    <div className={'change-functions-select-items'}>*/}
                {/*        {Object.values(ECFType).map(type => (*/}
                {/*            <Button*/}
                {/*                name={type}*/}
                {/*                className={classNames({['highlighted']: typeHighlighted.includes(type)})}*/}
                {/*                onClick={this.handleAddCF}>{type}</Button>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
            <div className="functions-list">
                {Object.values(cfs).reverse().map(cf => {
                    const {type, id, params, paramsConfig} = cf;
                    const Component = CFComponentByType[type];
                    return Component ? (
                        <div className={classNames('function-container', {
                            ['highlighted']: highlighted === id
                        })} key={id}>
                            <div className={'function-title'}>
                                <Button className={'function-id'}>{id}</Button>
                                <Button
                                    value={id}
                                    onDoubleClick={handleDelete}
                                    className={'function-delete'}>delete</Button>
                            </div>
                            <Component
                                name={id}/>

                        </div>
                    ) : null;
                })}
            </div>
        </div>
    );

};

// const cfsSelector

const mapStateToProps: MapStateToProps<ChangeFStateProps, {}, AppState> = (state) => ({
    cfs: getCFs(state),
    changingMode: state.changing.mode,
    tutorial: state.tutorial.on,
    highlighted: state.changeFunctionHighlights.highlighted,
    typeHighlighted: state.changeFunctionHighlights.typeHighlighted,
});

const mapDispatchToProps: MapDispatchToProps<ChangeFActionProps, ChangeFOwnProps> = {
    changeCFParams, addCF, startChanging, stopChanging, setChangingMode, removeCF
};

export const ChangeF = connect<ChangeFStateProps, ChangeFActionProps, ChangeFOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(ChangeFComponent);