import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../store";
import {ButtonSelect} from "./_shared/buttons/simple/ButtonSelect";
import {getPatternsSelectItems} from "../store/patterns/selectors";
import '../styles/patternSelect.scss';
import {ChannelImageData} from "./_shared/canvases/WebWorkerCanvas";
import {ButtonHK} from "./_shared/buttons/hotkeyed/ButtonHK";
import {UserHotkeyTrigger} from "./Hotkeys/UserHotkeyTrigger";

export interface PatternsSelectStateProps {
    patternsSelectItems: any[]
}

export interface PatternsSelectActionProps {
}

export interface PatternsSelectOwnProps {
    nullable?: boolean
    name?: string
    value?: string | string []

    onChange(value: string | string [], added: string, removed: string)

    HK?: boolean
    path?: string
    hkLabel?: string

    blurOnClick?: boolean
}

export interface PatternsSelectProps extends PatternsSelectStateProps, PatternsSelectActionProps, PatternsSelectOwnProps {

}

const PatternsSelectComponent: React.FC<PatternsSelectProps> = (props) => {
    const {
        patternsSelectItems,
        value,
        onChange,
        name,
        HK = true,
        hkLabel,
        path,
        nullable,
        blurOnClick,
    } = props;

    const buttonRef = React.useRef(null);

    const action = React.useCallback((id, selected) => {
        if (Array.isArray(value)) {

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
            if (selected && nullable) {
                onChange(null, null, id);
            } else {
                onChange(id, id, null);
            }
        }
    }, [onChange, value, nullable]);

    const handleClick = React.useCallback((data) => {
        const {selected, value: id} = data;
        action(id, selected);

        if (blurOnClick)
            buttonRef.current?.blur();
    }, [action, blurOnClick]);

    const handlePress = React.useCallback((e, hotkey, data) => {
        const id = data;
        const selected = Array.isArray(value) ? value?.includes(id) : (id === value);
        action(id, selected);
    }, [action]);

    // const ButtonComponent = HK ? ButtonHK : ButtonSelect;

    return (
        <div className={'pattern-select'}>
            {patternsSelectItems.map(({imageData, id}, i) => {
                const w = imageData.width;
                const h = imageData.height;
                // const coef  = w/h > 1 ?
                return (
                    <>
                        <ButtonHK
                            ref={buttonRef}
                            path={HK ? `patternSelect.${name}.${id}` : null}
                            hkLabel={hkLabel}
                            hkData1={id}
                            className={'pattern-select-button'}
                            width={42} height={42}
                            value={id}
                            onClick={handleClick}
                            selected={Array.isArray(value) ? value?.includes(id) : (id === value)}>
                            <ChannelImageData
                                width={40 * (w / h <= 1 ? w / h : 1)}
                                height={40 * (w / h > 1 ? h / w : 1)}
                                imageData={imageData}
                            />
                            {HK && (
                                <UserHotkeyTrigger
                                    keys={(i + 1).toString()}
                                    data={id}
                                    onPress={handlePress}
                                />
                            )}
                        </ButtonHK>
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