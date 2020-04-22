import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {ChangeFunctions} from "../../store/changeFunctions/reducer";
import {addCF, changeCFParams, removeCF} from "../../store/changeFunctions/actions";
import {SinCF} from "./SinCF";
import {ECFType} from "../../store/changeFunctions/types";
import {Button} from "../_shared/buttons/Button";
import {setChangingMode, startChanging, stopChanging} from "../../store/changing/actions";
import {ChangingMode} from "../../store/changing/types";
import {LoopCF} from "./LoopCF";
import {XYCF} from "./XYCF";
import {getCFs} from "../../store/changeFunctions/selectors";
import {DepthCF} from "./DeepthCF";

export interface ChangeFStateProps {
    cfs: ChangeFunctions
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
    [ECFType.DEPTH]: DepthCF,
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

    handleDeepth = () => {
        this.props.addCF(ECFType.DEPTH);
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
                    <Button onClick={this.handleDeepth}>deepth</Button>
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
                        return Component ? (
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
                                        className={'function-delete'}><span>{id}</span></Button>
                                </div>
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
    changingMode: state.changing.mode
});

const mapDispatchToProps: MapDispatchToProps<ChangeFActionProps, ChangeFOwnProps> = {
    changeCFParams, addCF, startChanging, stopChanging, setChangingMode, removeCF
};

export const ChangeF = connect<ChangeFStateProps, ChangeFActionProps, ChangeFOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(ChangeFComponent);