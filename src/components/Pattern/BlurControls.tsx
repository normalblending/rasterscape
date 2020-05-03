import * as React from "react";
import {ValueD} from "../_shared/buttons/ButtonNumber";
import {ButtonNumberCF} from "../_shared/buttons/ButtonNumberCF";
import {BlurValue} from "../../store/patterns/blur/types";
import '../../styles/blurControls.scss';
import {VideoParams} from "../../store/patterns/video/types";
import {ChangeFunctions} from "../../store/changeFunctions/reducer";
import {withTranslation, WithTranslation} from "react-i18next";
import {blurOnce, setBlur} from "../../store/patterns/blur/actions";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {toFixed0} from "../../utils/utils";
import {Button, ButtonSelect} from "bbuutoonnss";

export interface BlurControlsStateProps {
    blur: BlurValue
}

export interface BlurControlsActionProps {
    setBlur(id: string, value: BlurValue)
    blurOnce(id: string)
}

export interface BlurControlsOwnProps {
    patternId: string
}

export interface BlurControlsProps extends BlurControlsStateProps, BlurControlsActionProps, BlurControlsOwnProps, WithTranslation {
}

export interface BlurControlsState {

}

const radiusRange = [0, 100] as [number, number];
const radiusValueD = ValueD.VerticalLinear(1.25);

const offsetRange = [-800, 800] as [number, number];
const offsetValueD = ValueD.VerticalLinear(0.1);

export class BlurControlsComponent extends React.PureComponent<BlurControlsProps, BlurControlsState> {


    handleChange = ({value, name}) => {
        const {setBlur, blur, patternId} = this.props;
        setBlur(patternId, {
            ...blur,
            [name]: value
        });
    };

    handleToggleChange = (data) => {
        const {selected, name} = data;
        const {setBlur, blur, patternId} = this.props;
        setBlur(patternId, {
            ...blur,
            [name]: !selected
        });
    };

    handleBlurOnce = () => {
        const {blurOnce, patternId} = this.props;
        blurOnce(patternId);
    };

    render() {
        const {radius, onUpdate} = this.props.blur;
        return (
            <div className={'blur-controls'}>
                <ButtonNumberCF
                    integer
                    precision={100}
                    path={`patterns.${this.props.patternId}.blur.value.radius`}
                    name={"radius"}
                    value={radius}
                    range={radiusRange}
                    valueD={radiusValueD}
                    getText={toFixed0}
                    onChange={this.handleChange}/>
                <ButtonSelect
                    selected={onUpdate}
                    name={"onUpdate"}
                    onClick={this.handleToggleChange}
                >on update</ButtonSelect>
                <Button
                    onClick={this.handleBlurOnce}
                >once</Button>

                {/*<ButtonNumberCF*/}
                {/*    precision={1600}*/}
                {/*    path={`patterns.${this.props.patternId}.blur.value.offset.x`}*/}
                {/*    name={"x"}*/}
                {/*    value={offset.x}*/}
                {/*    range={offsetRange}*/}
                {/*    valueD={offsetValueD}*/}
                {/*    onChange={this.handleOffsetChange}/>*/}
                {/*<ButtonNumberCF*/}
                {/*    precision={1600}*/}
                {/*    path={`patterns.${this.props.patternId}.blur.value.offset.y`}*/}
                {/*    name={"y"}*/}
                {/*    value={offset.y}*/}
                {/*    range={offsetRange}*/}
                {/*    valueD={offsetValueD}*/}
                {/*    onChange={this.handleOffsetChange}/>*/}
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<BlurControlsStateProps, BlurControlsOwnProps, AppState> = (state, {patternId}) => ({
    blur: state.patterns[patternId]?.blur?.value
});

const mapDispatchToProps: MapDispatchToProps<BlurControlsActionProps, BlurControlsOwnProps> = {
    setBlur,
    blurOnce,
};

export const BlurControls = connect<BlurControlsStateProps, BlurControlsActionProps, BlurControlsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(BlurControlsComponent));
