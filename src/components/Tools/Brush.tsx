import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {EBrushType} from "../../store/brush/types";
import {setOpacity, setSize, setType} from "../../store/brush/actions";
import {ButtonNumber, ValueD} from "../_shared/ButtonNumber";
import {ButtonSelect} from "../_shared/ButtonSelect";
import {Button} from "../_shared/Button";
import {Key} from "../_shared/Key";
import {InputText} from "../_shared/InputText";
import {SelectButtons} from "../_shared/SelectButtons";
import {array} from "prop-types";
import {arrayToSelectItems} from "../../utils/utils";
import {EventData} from "../../utils/types";

export interface BrushStateProps {
    size: number
    opacity: number
    type: EBrushType
}

export interface BrushActionProps {
    setSize(size: number)

    setOpacity(opacity: number)

    setType(type: EBrushType)
}

export interface BrushOwnProps {

}

export interface BrushProps extends BrushStateProps, BrushActionProps, BrushOwnProps {

}

const typeSelectItems = arrayToSelectItems(Object.values(EBrushType));
const sizeRange = [1, 200] as [number, number];
const sizeValueD = ValueD.VerticalLinear(.5);
const opacityRange = [0, 1] as [number, number];

class BrushComponent extends React.PureComponent<BrushProps> {

    handleSizeChange = ({value}) => {
        const {setSize} = this.props;
        setSize && setSize(value)
    };
    handleOpacityChange = ({value}) => {
        const {setOpacity} = this.props;
        setOpacity && setOpacity(value)
    };
    handleTypeChange = ({value}) => {
        const {setType} = this.props;
        setType && setType(value)
    };

    render() {

        const {size, opacity, type} = this.props;
        return (
            <div className="brush">
                <ButtonNumber
                    shortcut={"q"}
                    range={sizeRange}
                    valueD={sizeValueD}
                    onClick={this.handleSizeChange}
                    onRelease={this.handleSizeChange}
                    value={size}/>
                <ButtonNumber
                    range={opacityRange}
                    onChange={this.handleOpacityChange}
                    value={opacity}/>
                <SelectButtons
                    items={typeSelectItems}
                    value={type}
                    onChange={this.handleTypeChange}/>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<BrushStateProps, BrushOwnProps, AppState> = state => ({
    size: state.brush.size,
    opacity: state.brush.opacity,
    type: state.brush.type,
});

const mapDispatchToProps: MapDispatchToProps<BrushActionProps, BrushOwnProps> = {
    setSize, setOpacity, setType
};

export const Brush = connect<BrushStateProps, BrushActionProps, BrushOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(BrushComponent);