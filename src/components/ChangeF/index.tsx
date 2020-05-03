import * as React from "react";
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

export interface ChangeFStateProps {
    cfs: ChangeFunctions
    changingMode: ChangingMode
    tutorial: boolean
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

// const modesItems = enumToSelectItems(ChangingMode);

class ChangeFComponent extends React.PureComponent<ChangeFProps, ChangeFState> {

    handleChange = (value, name) => {
        this.props.changeCFParams(name, value);
    };

    handleDelete = ({value}) => {
        this.props.removeCF(value);
    };

    handleAddWave = () => {
        this.props.addCF(ECFType.WAVE);
    };

    handleAddFxy = () => {
        this.props.addCF(ECFType.FXY);
    };

    handleDeepth = () => {
        this.props.addCF(ECFType.DEPTH);
    };

    handleModeChange = ({value}) => {
        this.props.setChangingMode(value);
    };

    render() {
        const {cfs, changingMode, tutorial} = this.props;
        return (
            <div className="change-functions">
                <HelpTooltip message={'change functions'}>
                    <div className="control-buttons">
                        <Button onClick={this.handleAddWave}>ft</Button>
                        <Button onClick={this.handleAddFxy}>fxy</Button>
                        <Button onClick={this.handleDeepth}>rgba</Button>
                        {/*<br/>*/}
                        {/*<SelectButtons*/}
                        {/*    items={modesItems}*/}
                        {/*    value={changingMode}*/}
                        {/*    onChange={this.handleModeChange}/>*/}
                    </div>
                </HelpTooltip>
                <div className="functions-list">
                    {Object.values(cfs).reverse().map(cf => {
                        const {type, id, params, paramsConfig} = cf;
                        const Component = CFComponentByType[type];
                        return Component ? (
                            <div className={'function-container'} key={id}>
                                <div className={'function-title'}>
                                    <Button className={'function-id'}>{id}</Button>
                                    <Button
                                        value={id}
                                        onClick={this.handleDelete}
                                        className={'function-delete'}>delete</Button>
                                </div>
                                <Component
                                    tutorial={tutorial}
                                    key={id}
                                    name={id}
                                    params={params}
                                    paramsConfig={paramsConfig}
                                    onChange={this.handleChange}/>

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
    tutorial: state.tutorial.on
});

const mapDispatchToProps: MapDispatchToProps<ChangeFActionProps, ChangeFOwnProps> = {
    changeCFParams, addCF, startChanging, stopChanging, setChangingMode, removeCF
};

export const ChangeF = connect<ChangeFStateProps, ChangeFActionProps, ChangeFOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(ChangeFComponent);