import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps, Provider as ReduxProvider} from "react-redux";
import {AppState, store} from "../../../store";
import {Main} from "../../Main";
import './demonstration.scss';
import {setDemonstrationParams} from "../../../store/patterns/demonstration/actions";
import {Button} from "../buttons/simple/Button";
import {CycledToggle} from "../buttons/simple/CycledToggle";
import {ButtonHK} from "../buttons/hotkeyed/ButtonHK";
import {EdgeMode} from "../../../store/patterns/video/services";
import {CycledToggleHK} from "../buttons/hotkeyed/CycledToggleHK";
import {DemonstrationMode, DemonstrationParams} from "../../../store/patterns/demonstration/types";
import {Key} from "../../Hotkeys/Key";

export interface DemonstrationStateProps {
    demonstrationParams: DemonstrationParams
}

export interface DemonstrationActionProps {
    setDemonstrationParams: typeof setDemonstrationParams
}

export interface DemonstrationOwnProps {
    name
    stream

}

export interface DemonstrationProps extends DemonstrationStateProps, DemonstrationActionProps, DemonstrationOwnProps {

}

const styles = {
    container: {
        width: '100%',
        height: '100%',
        position: 'relative' as 'relative',
    },
    video: {
        'object-fit': 'fill',
        width: '100%',
        height: '100%',
    }
};

const ObjectFitByMode = {
    [DemonstrationMode.fill]: 'fill',
    [DemonstrationMode.contain]: 'contain',
    [DemonstrationMode.cover]: 'cover',
};

const DemonstrationComponent: React.FC<DemonstrationProps> = (props) => {

    const {name, stream, demonstrationParams: params, setDemonstrationParams} = props;

    const videoRef = React.useRef(null);

    const [played, setPlayed] = React.useState(false);

    const downHandler = React.useCallback(() => {
        console.log(played);
        if (!played) {
            videoRef.current?.play();
            setPlayed(true);
        }
        setDemonstrationParams(name, {
            mode: ({
                [DemonstrationMode.contain]: DemonstrationMode.fill,
                [DemonstrationMode.fill]: DemonstrationMode.cover,
                [DemonstrationMode.cover]: DemonstrationMode.contain,
            })[params.mode || DemonstrationMode.contain]
        })
    }, [videoRef, setDemonstrationParams, name, params.mode, played]);

    const enterHandler = React.useCallback(() => {
        if (videoRef.current && !videoRef.current.srcObject) {
            videoRef.current.srcObject = stream
        }
    }, [videoRef, stream]);

    const videoStyle = React.useMemo(() => {
        return {
            'object-fit': ObjectFitByMode[params.mode],
            width: '100%',
            height: '100%',
            position: 'absolute' as 'absolute',
            top: 0,
            left: 0,
        }
    }, [params.mode]);

    const playStyle = React.useMemo(() => {
        return {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
        }
    }, []);

    return (
        <div className={'patternDemonstration'} style={styles.container}>

            {!played && <div style={playStyle}>▶</div>}
            <video
                style={videoStyle}
                ref={videoRef}
                onMouseDown={downHandler}
                onMouseEnter={enterHandler}
            />
        </div>
    );
};

const mapStateToProps: MapStateToProps<DemonstrationStateProps, DemonstrationOwnProps, AppState> = (state, {name}) => ({
    demonstrationParams: state.patterns[name]?.demonstration?.params || {}
});

const mapDispatchToProps: MapDispatchToProps<DemonstrationActionProps, DemonstrationOwnProps> = {
    setDemonstrationParams
};

export const Demonstration = connect<DemonstrationStateProps, DemonstrationActionProps, DemonstrationOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(DemonstrationComponent);


export const DemonstrationSubApp: React.FC<DemonstrationOwnProps> = ({name, stream}) => (
    <ReduxProvider store={store}>
        <Demonstration stream={stream} name={name}/>
    </ReduxProvider>
);
