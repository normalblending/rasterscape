import * as React from "react";
import * as classNames from "classnames";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {ChangeFunctions} from "../../store/changeFunctions/reducer";
import {addCF, changeCFParams, removeCF} from "../../store/changeFunctions/actions";
import {ECFType} from "../../store/changeFunctions/types";
import {Button} from "../_shared/buttons/Button";
import {setChangingMode, startChanging, stopChanging} from "../../store/changing/actions";
import {ChangingMode} from "../../store/changing/types";
import {FxyCF} from "./Fxy";
import {getCFs} from "../../store/changeFunctions/selectors";
import {DepthCF} from "./DeepthCF";
import {HelpTooltip} from "../tutorial/HelpTooltip";
import {WaveCF} from "./Wave";
import {SelectButtons, SelectDrop} from "bbuutoonnss";
import {enumToSelectItems} from "../../utils/utils";
import {CycledToggle} from "../_shared/buttons/CycledToggle/CycledToggle";

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

class ChangeFComponent extends React.PureComponent<ChangeFProps, ChangeFState> {

    handleChange = (value, name) => {
        this.props.changeCFParams(name, value);
    };

    handleDelete = ({value}) => {
        this.props.removeCF(value);
    };

    handleAddCF = (data) => {
        this.props.addCF(data.name);
    };

    handleModeChange = ({value}) => {
        this.props.setChangingMode(value);
    };

    render() {
        const {
            cfs,
            changingMode,
            highlighted,
            typeHighlighted,
        } = this.props;

        return (
            <div className="change-functions">
                <div className="control-buttons">
                    <div className={classNames("change-functions-select", {
                        'change-functions-select-open': typeHighlighted?.length
                    })}>
                        <Button>func</Button>
                        <div className={'change-functions-select-items'}>
                            {Object.values(ECFType).map(type => (
                                <Button
                                    name={type}
                                    className={classNames({['highlighted']: typeHighlighted.includes(type)})}
                                    onClick={this.handleAddCF}>{type}</Button>
                            ))}
                        </div>
                    </div>
                    <CycledToggle
                        items={modesItems}
                        value={changingMode}
                        onChange={this.handleModeChange}/>
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
                                        onDoubleClick={this.handleDelete}
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
    }
}

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