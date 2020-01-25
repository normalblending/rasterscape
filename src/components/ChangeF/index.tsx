import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {ChangeFunctionsState} from "../../store/changeFunctions/reducer";
import {addCF, changeCFParams} from "../../store/changeFunctions/actions";
import {SinCF} from "./SinCF";
import {ECFType} from "../../store/changeFunctions/types";
import {Button} from "../_shared/Button";
import {setChangingMode, startChanging, stopChanging} from "../../store/changing/actions";
import {SelectDrop} from "../_shared/SelectDrop";
import {enumToSelectItems, objectToSelectItems} from "../../utils/utils";
import {ChangingMode} from "../../store/changing/types";
import {SelectButtons} from "../_shared/SelectButtons";
import {LoopCF} from "./LoopCF";
import {XYCF} from "./XYCF";

export interface ChangeFStateProps {
    cfs: ChangeFunctionsState
    changingMode: ChangingMode
}

export interface ChangeFActionProps {
    changeCFParams(id: string, params: any)
    addCF(cfType: ECFType)
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
    [ECFType.XY]: XYCF,
};

const modesItems = enumToSelectItems(ChangingMode);

console.log(modesItems);

class ChangeFComponent extends React.PureComponent<ChangeFProps, ChangeFState> {

    handleChange = (value, name) => {
        this.props.changeCFParams(name, value);
    };

    handleAddSin = () => {
        this.props.addCF(ECFType.SIN);
    };

    handleAddLoop = () => {
        this.props.addCF(ECFType.LOOP);
    };

    handleAddXY = () => {
        this.props.addCF(ECFType.XY);
    };

    handleModeChange = ({value}) => {
        this.props.setChangingMode(value);
    };

    render() {
        const {cfs, changingMode} = this.props;
        return (
            <div>
                {Object.values(cfs).map(cf => {
                    const {type, id, params, paramsConfig} = cf;
                    const Component = CFComponentByType[type];
                    return (
                        <Component
                            key={id}
                            name={id}
                            params={params}
                            paramsConfig={paramsConfig}
                            onChange={this.handleChange}/>);
                })}
                <Button onClick={this.handleAddSin}>sin</Button>
                <Button onClick={this.handleAddLoop}>loop</Button>
                <Button onClick={this.handleAddXY}>xy</Button>
                <SelectButtons
                    items={modesItems}
                    value={changingMode}
                    onChange={this.handleModeChange}/>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<ChangeFStateProps, {}, AppState> = state => ({
    cfs: state.changeFunctions,
    changingMode: state.changing.mode
});

const mapDispatchToProps: MapDispatchToProps<ChangeFActionProps, ChangeFOwnProps> = {
    changeCFParams, addCF, startChanging, stopChanging, setChangingMode
};

export const ChangeF = connect<ChangeFStateProps, ChangeFActionProps, ChangeFOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(ChangeFComponent);