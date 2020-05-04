import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../store";
import {ButtonSelect} from "./_shared/buttons/ButtonSelect";
import {getPatternsSelectItems} from "../store/patterns/selectors";
import '../styles/patternSelect.scss';
import {ChannelImageData} from "./_shared/canvases/WebWorkerCanvas";

export interface PatternsSelectStateProps {
    patternsSelectItems: any[]
}

export interface PatternsSelectActionProps {
}

export interface PatternsSelectOwnProps {
    value?: string | string []
    onChange(value: string | string [], added: string, removed: string)
}

export interface PatternsSelectProps extends PatternsSelectStateProps, PatternsSelectActionProps, PatternsSelectOwnProps {

}

const PatternsSelectComponent: React.FC<PatternsSelectProps> = (props) => {
    const {
        patternsSelectItems,
        value,
        onChange
    } = props;

    const handleClick = React.useCallback((data) => {

        const {onChange, value} = props;
        const {selected, value: id} = data;
        if (Array.isArray(props.value)) {

            if (selected) {
                onChange(
                    (value as string[]).filter(name => name !== id),
                    null, id
                );
            } else {
                onChange(
                    [...value as string[], id],
                    id, null
                );
            }

        } else {
            if (selected) {
                onChange(null, null, id);
            } else {
                onChange(id, id, null);
            }
        }
    }, [onChange, value]);

    return (
        <div className={'pattern-select'}>
                {patternsSelectItems.map(({imageData, id}, i) => {
                    const w = imageData.width;
                    const h = imageData.height;
                    // const coef  = w/h > 1 ?
                    return (
                        <>
                            <ButtonSelect
                                className={'pattern-select-button'}
                                width={42} height={42}
                                value={id}
                                onClick={handleClick}
                                selected={Array.isArray(value) ? value?.includes(id) : (id === value)}>
                                <ChannelImageData
                                    width={40 * (w / h <= 1 ? w / h : 1)}
                                    height={40 * (w / h > 1 ? h / w : 1)}
                                    imageData={imageData}/>
                            </ButtonSelect>
                            {!((i + 1) % 5) ? <br/> : null}
                        </>
                    )
                })}
        </div>
    );
};

const mapStateToProps: MapStateToProps<PatternsSelectStateProps, PatternsSelectOwnProps, AppState> = state => ({
    patternsSelectItems: getPatternsSelectItems(state),
});

const mapDispatchToProps: MapDispatchToProps<PatternsSelectActionProps, PatternsSelectOwnProps> = {};

export const PatternsSelect = connect<PatternsSelectStateProps, PatternsSelectActionProps, PatternsSelectOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(PatternsSelectComponent);