import * as React from "react";
import {pointsDistance} from "../../utils/canvas";
import {SVG} from "./SVG";
import * as d3 from "d3";
import {
    EPathModeType,
    ESegType,
    getLastSlice,
    getNearestSegment,
    NearestSegmentData,
    Path,
    Segment,
    stringToPathData
} from "../../utils/path";
import {EParamType, Param} from "./Params";
import {arrayToSelectItems} from "../../utils/utils";
import {SelectionParams, Size} from "../../utils/types";
import {WindowState} from "../../store/mainWindow/reducer";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {windowSelectors} from "../../store/_shared/window/selectors";

const lineFunction = d3
    .line<Segment>()
    .x(({values}) => values ? values[0] : 0)
    .y(({values}) => values ? values[1] : 0)
    .defined(({values}) => !!values);

export enum ECurveType {
    CurveBasis = "curveBasis",
    CurveBundle = "curveBundle",
    CurveCardinal = "curveCardinal",
    CurveCatmullRom = "curveCatmullRom",
    CurveLinear = "curveLinear",
    CurveMonotoneX = "curveMonotoneX",
    CurveMonotoneY = "curveMonotoneY",
    CurveNatural = "curveNatural",
    CurveStep = "curveStep",
    CurveStepBefore = "curveStepBefore",
    CurveStepAfter = "curveStepAfter",
    Default = "curveLinear",
}

export const CurveValueName = {
    [ECurveType.CurveBundle]: "beta",
    [ECurveType.CurveCardinal]: "tension",
    [ECurveType.CurveCatmullRom]: "alpha"
};

const HANDLER_SIZE = 5;

export enum ESelectionMode {
    Line = "Line",
    Rect = "Rect",
    SimplePoints = "SimplePoints",
    Points = "Points"
}

export const getParamsConfig = (params?: SelectionParams) => {
    let config: Param[] = [{
        name: "mode",
        type: EParamType.Select,
        props: {
            items: selectionModesSelectItems
        }
    }];

    if (params && params.mode === ESelectionMode.Points) {
        config.push({
            name: "curveType",
            type: EParamType.Select,
            props: {
                items: curveTypesSelectItems
            }
        });

        if (Object.keys(CurveValueName).indexOf(params.curveType) !== -1) {
            config = [...config, {
                name: CurveValueName[params.curveType],
                type: EParamType.Number,
                props: {
                    range: [0, 1],
                    text: 1
                }
            }]
        }
    }

    return config;
};

export const selectionModesSelectItems = arrayToSelectItems(
    [ESelectionMode.Rect, ESelectionMode.Line, ESelectionMode.Points]);

export const curveTypesSelectItems = arrayToSelectItems(Object.values(ECurveType));

export interface CanvasSelectionStateProps {
    size: Size

    value?: any

    params: SelectionParams
    // mode?: ESelectionMode
    // curveType?: ECurveType
    // curveValue?: number
}

export interface CanvasSelectionActionProps {
    onChange?(value?: any)
}

export interface CanvasSelectionOwnProps {
    className?: string
}

export interface CanvasSelectionProps extends CanvasSelectionStateProps, CanvasSelectionActionProps, CanvasSelectionOwnProps {

}

export interface CanvasSelectionState {

    startX: number
    startY: number
    offsetX: number
    offsetY: number
    points: any[]
    closed: boolean
    path: any[]
    curvePath: any[]
    currentSliceN: number
}

export class CanvasSelection extends React.PureComponent<CanvasSelectionProps, CanvasSelectionState> {

    canvasRef;
    pathRef;
    pathPointsRef;
    maskPathRef;

    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
        this.pathRef = React.createRef();
        this.pathPointsRef = React.createRef();
        this.maskPathRef = React.createRef();

        this.state = {
            startX: null,
            startY: null,
            offsetX: null,
            offsetY: null,
            points: [],
            closed: true,
            path: [],
            curvePath: [],
            currentSliceN: 0
        };
    }

    componentDidMount() {
        const {value} = this.props;
        Array.isArray(value) && this.setState({
            path: value,
            currentSliceN: value.filter(({type}) => type === ESegType.M).length
        })
    }

    componentDidUpdate(prevProps: CanvasSelectionProps) {
        if (prevProps.params.mode !== this.props.params.mode) {
            this.handlers[prevProps.params.mode].exit(this.props.params.mode)
        }
    }

    static getDerivedStateFromState(nextProps: CanvasSelectionProps) {
        const {value} = nextProps;
        return Array.isArray(value) ? {
            path: value,
            currentSliceN: value.filter(({type}) => type === ESegType.M).length,
        } : {}
    }

    commitChanges = () => {
        const {onChange} = this.props;

        onChange && onChange(this.state.path);
    };

    handlers = {
        [ESelectionMode.Rect]: ({
            down: e => {
                const {path} = this.state;

                if (path.length) {

                    const nearest: NearestSegmentData = getNearestSegment(path, e.offsetX, e.offsetY);

                    if (nearest && nearest.distance < HANDLER_SIZE * 2) {

                        if (nearest.slice.length !== 5) {
                            return this.setState(state => ({
                                startX: e.offsetX,
                                startY: e.offsetY,
                                offsetX: 0,
                                offsetY: 0,
                                currentSliceN: nearest.sliceN,
                                path: Path[EPathModeType.Rect](state.path, [e.offsetX, e.offsetY, e.offsetX, e.offsetY], nearest.sliceN)
                            }));
                        } else {

                            const oppositeIndex = (nearest.startInSlice + 2) % 4;
                            const oppositeSeg = nearest.slice[oppositeIndex];

                            const offsetX = nearest.segment.values[0] - e.offsetX;
                            const offsetY = nearest.segment.values[1] - e.offsetY;

                            const startX = oppositeSeg.values[0];
                            const startY = oppositeSeg.values[1];

                            return this.setState(state => ({
                                startX, startY,
                                offsetX, offsetY,
                                currentSliceN: nearest.sliceN,
                                path: Path[EPathModeType.Rect](state.path, [startX, startY, e.offsetX + offsetX, e.offsetY + offsetY], nearest.sliceN)
                            }));
                        }
                    }
                }
                this.setState(({currentSliceN, path}) => ({
                    offsetX: 0,
                    offsetY: 0,
                    startX: e.offsetX,
                    startY: e.offsetY,
                    path: Path[EPathModeType.Rect](path, [e.offsetX, e.offsetY, e.offsetX, e.offsetY], currentSliceN)
                }));

            },
            drag: e => {
                this.setState(({path, startX, startY, offsetX, offsetY, currentSliceN}) => ({
                    path: Path[EPathModeType.Rect](path, [startX, startY, e.offsetX, e.offsetY], currentSliceN)
                }));
            },
            up: () => {
                this.setState(state => ({
                    startX: 0, startY: 0, offsetX: 0, offsetY: 0,
                    currentSliceN: state.path.filter(({type}) => type === ESegType.M).length
                }), this.commitChanges);
            },
            exit: (nextMode) => {
            }
        }),
        [ESelectionMode.SimplePoints]: {
            down: e => {
                const {path, curvePath} = this.state;

                if (!path.length || path[path.length - 1].type === ESegType.Z) {
                    this.setState(({path}) => ({
                        path: Path[EPathModeType.M](path, [e.offsetX, e.offsetY])
                    }));
                } else {

                    if (curvePath.length) {
                        this.setState(({path, currentSliceN}) => ({
                            curvePath: [],
                            path: Path[EPathModeType.Slice](path, curvePath, currentSliceN)
                        }))
                    }

                    const subFirst = path.filter(({type}) => type === ESegType.M).reverse()[0];

                    if (pointsDistance(e.offsetX, e.offsetY, subFirst.values[0], subFirst.values[1]) < HANDLER_SIZE * 2) {
                        this.setState(({path}) => ({
                            path: Path[EPathModeType.Z](path),
                            currentSliceN: path.filter(({type}) => type === ESegType.M).length
                        }), this.commitChanges);
                    } else {
                        this.setState(({path}) => ({
                            path: Path[EPathModeType.L](path, [e.offsetX, e.offsetY])
                        }));
                    }
                }
            },
            drag: () => undefined,
            up: () => undefined,
            exit: (nextMode) => {
                const {path} = this.state;
                if (path && path.length && path[path.length - 1].type !== ESegType.Z && nextMode !== ESelectionMode.Points) {
                    this.setState(({path}) => ({
                        curvePath: [],
                        path: Path[EPathModeType.Z](path),
                        currentSliceN: path.filter(({type}) => type === ESegType.M).length
                    }), this.commitChanges);
                }
            }
        },
        [ESelectionMode.Points]: ({
            down: e => {
                const {path, curvePath} = this.state;

                if (!path.length || path[path.length - 1].type === ESegType.Z) {
                    // если пустой путь или закрытый

                    const curvePath = Path[EPathModeType.M](this.state.curvePath, [e.offsetX, e.offsetY]);

                    this.setState(({path}) => ({
                        curvePath,
                        path: Path[EPathModeType.M](path, [e.offsetX, e.offsetY])
                    }));
                } else {
                    if (!curvePath.length) {
                        this.setState(({path}) => ({curvePath: getLastSlice(path)}))
                    }
                    const subFirst = path.filter(({type}) => type === ESegType.M).reverse()[0];

                    if (pointsDistance(e.offsetX, e.offsetY, subFirst.values[0], subFirst.values[1]) < HANDLER_SIZE * 2) {
                        // если пришли к началу

                        this.setState(({path, curvePath}) => {
                            let newCurvePath = Path[EPathModeType.L](curvePath, [subFirst.values[0], subFirst.values[1]]);
                            newCurvePath = Path[EPathModeType.Z](newCurvePath);

                            return {
                                curvePath: [],
                                path: Path[EPathModeType.Z](this.line(path, newCurvePath)),
                                currentSliceN: path.filter(({type}) => type === ESegType.M).length
                            }
                        }, this.commitChanges);
                    } else {
                        // следующая точкка

                        this.setState(({path, curvePath}) => {
                            const newCurvePath = Path[EPathModeType.L](curvePath, [e.offsetX, e.offsetY]);

                            return {
                                curvePath: newCurvePath,
                                path: this.line(path, newCurvePath)
                            }
                        });
                    }
                }
            },
            drag: () => undefined,
            up: () => undefined,
            exit: (nextMode) => {
                const {path} = this.state;
                if (path && path.length && path[path.length - 1].type !== ESegType.Z && nextMode !== ESelectionMode.Points) {
                    this.setState(({path}) => ({
                        curvePath: [],
                        path: Path[EPathModeType.Z](path),
                        currentSliceN: path.filter(({type}) => type === ESegType.M).length
                    }), this.commitChanges);
                }
            }
        }),
        [ESelectionMode.Line]: {
            down: e => {
                this.setState(({path}) => ({
                    path: Path[EPathModeType.M](path, [e.offsetX, e.offsetY])
                }));
            },
            drag: e => {
                this.setState(({path}) => ({
                    path: Path[EPathModeType.L](path, [e.offsetX, e.offsetY])
                }));
            },
            up: e => {
                this.setState(({path}) => ({
                    path: Path[EPathModeType.Z](path),
                    currentSliceN: path.filter(({type}) => type === ESegType.M).length
                }), this.commitChanges);
            },
            exit: (nextMode) => {
            }
        }
    };

    line = (path, line) => {
        const {params} = this.props;
        const {curveType} = params;
        const curveValue = params[CurveValueName[curveType]];

        let curve = d3[curveType || "curveLinear"];
        if (Object.keys(CurveValueName).indexOf(curveType) !== -1)
            curve = curve[CurveValueName[curveType]](curveValue);

        return Path[EPathModeType.Slice](
            path,
            stringToPathData(
                lineFunction.curve(curve)(getLastSlice(line))),
            this.state.currentSliceN);
    };

    render() {
        console.log("selector render");
        const {size: {width, height}, params: {mode}} = this.props;

        this.pathRef.current && this.pathRef.current.setPathData(this.state.path);
        this.maskPathRef.current && this.maskPathRef.current.setPathData(this.state.path);

        return (
            <SVG
                className={"canvasSelection"}
                width={width}
                height={height}
                onDown={this.handlers[mode].down}
                onDrag={this.handlers[mode].drag}
                onUp={this.handlers[mode].up}>
                <mask id="myMask">
                    <rect x="0" y="0" width={width} height={height} fill="white"/>
                    <path
                        ref={this.maskPathRef}
                        fillOpacity={1}
                        fill="black"/>
                </mask>
                <rect x="0" y="0" width={width} height={height} fill="black" fillOpacity={0.3} mask="url(#myMask)"/>
                <path
                    ref={this.pathRef}
                    fillOpacity={0}
                    fill="black"
                    stroke="red"/>
            </SVG>
        )
    }
}

export const canvasSelectionConnect = (getWindowState: (state: AppState) => WindowState, changeAction) => {

    const WindowSelectors = windowSelectors(getWindowState);
    const mapStateToProps: MapStateToProps<CanvasSelectionStateProps, CanvasSelectionOwnProps, AppState> = state => ({
        value: WindowSelectors.getSelectionValue(state),
        size: WindowSelectors.getSize(state),
        params: WindowSelectors.getSelectionParams(state)
    });

    const mapDispatchToProps: MapDispatchToProps<CanvasSelectionActionProps, CanvasSelectionOwnProps> = {
        onChange: changeAction
    };

    return connect<CanvasSelectionStateProps, CanvasSelectionActionProps, CanvasSelectionOwnProps, AppState>(
        mapStateToProps, mapDispatchToProps
    )(CanvasSelection)
};