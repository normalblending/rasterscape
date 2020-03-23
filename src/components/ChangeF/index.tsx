import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {ChangeFunctionsState} from "../../store/changeFunctions/reducer";
import {addCF, changeCFParams, removeCF} from "../../store/changeFunctions/actions";
import {SinCF} from "./SinCF";
import {ECFType} from "../../store/changeFunctions/types";
import {Button} from "../_shared/buttons/Button";
import {setChangingMode, startChanging, stopChanging} from "../../store/changing/actions";
import {SelectDrop} from "../_shared/buttons/SelectDrop";
import {enumToSelectItems, objectToSelectItems} from "../../utils/utils";
import {ChangingMode} from "../../store/changing/types";
import {SelectButtons} from "../_shared/buttons/SelectButtons";
import {LoopCF} from "./LoopCF";
import {XYCF} from "./XYCF";

export interface ChangeFStateProps {
    cfs: ChangeFunctionsState
    changingMode: ChangingMode
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
    [ECFType.SIN]: SinCF,
    [ECFType.LOOP]: LoopCF,
    [ECFType.XY_PARABOLOID]: XYCF,
};

// const modesItems = enumToSelectItems(ChangingMode);

class ChangeFComponent extends React.PureComponent<ChangeFProps, ChangeFState> {

    handleChange = (value, name) => {
        this.props.changeCFParams(name, value);
    };

    handleDelete = ({value}) => {
        this.props.removeCF(value);
    };

    handleAddSin = () => {
        this.props.addCF(ECFType.SIN);
    };

    handleAddLoop = () => {
        this.props.addCF(ECFType.LOOP);
    };

    handleAddXY = () => {
        this.props.addCF(ECFType.XY_PARABOLOID);
    };

    handleModeChange = ({value}) => {
        this.props.setChangingMode(value);
    };

    render() {
        const {cfs, changingMode} = this.props;
        return (
            <div className="change-functions">
                <div className="control-buttons">
                    <Button onClick={this.handleAddSin}>sin</Button>
                    <Button onClick={this.handleAddLoop}>loop</Button>
                    <Button onClick={this.handleAddXY}>parab</Button>
                    {/*<br/>*/}
                    {/*<SelectButtons*/}
                    {/*    items={modesItems}*/}
                    {/*    value={changingMode}*/}
                    {/*    onChange={this.handleModeChange}/>*/}
                </div>
                <div className="functions-list">
                    {Object.values(cfs).reverse().map(cf => {
                        const {type, id, params, paramsConfig} = cf;
                        const Component = CFComponentByType[type];
                        return (
                            <div className={'function-container'} key={id}>
                                <Component
                                    key={id}
                                    name={id}
                                    params={params}
                                    paramsConfig={paramsConfig}
                                    onChange={this.handleChange}/>
                                <div className={'function-controls'}>
                                    <Button
                                        value={id}
                                        onClick={this.handleDelete}
                                        className={'function-delete'}>del</Button>
                                </div>
                            </div>);
                    })}
                </div>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<ChangeFStateProps, {}, AppState> = state => ({
    cfs: state.changeFunctions,
    changingMode: state.changing.mode
});

const mapDispatchToProps: MapDispatchToProps<ChangeFActionProps, ChangeFOwnProps> = {
    changeCFParams, addCF, startChanging, stopChanging, setChangingMode, removeCF
};

export const ChangeF = connect<ChangeFStateProps, ChangeFActionProps, ChangeFOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(ChangeFComponent);