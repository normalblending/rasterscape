import * as React from "react";
import {pointsDistance} from "../../utils/geometry";
import {SVG} from "../_shared/SVG";
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
import {arrayToSelectItems} from "../../utils/utils";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import classNames from "classnames";
import {EToolType} from "../../store/tool/types";
import {ESelectionMode, ECurveType, CurveValueName, SelectToolParams} from "../../store/selectTool/types";
import "../../styles/selection.scss"
import {Segments, SelectionParams} from "../../store/patterns/selection/types";


const lineFunction = d3
    .line<Segment>()
    .x(({values}) => values ? values[0] : 0)
    .y(({values}) => values ? values[1] : 0)
    .defined(({values}) => !!values);


const HANDLER_SIZE = 5;


export const selectionModesSelectItems = arrayToSelectItems(
    [ESelectionMode.Rect, ESelectionMode.Line, ESelectionMode.Points]);

export const curveTypesSelectItems = arrayToSelectItems(Object.values(ECurveType));

export interface CanvasSelectionStateProps {
    currentTool: EToolType
    selectToolParams: SelectToolParams
}

export interface CanvasSelectionActionProps {
}

export interface CanvasSelectionOwnProps {
    isActive: boolean
    params: SelectionParams

    name: any
    width: number
    height: number

    value?: Segments
    className?: string
    style?:any

    onChange?(value: any, bBox: SVGRect)
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
    prevPath: any[] // нужно чтобы знать когда обновлять стейт из пропсов
    curvePath: any[]
    currentSliceN: number
}

class CanvasSelectionComponent extends React.PureComponent<CanvasSelectionProps, CanvasSelectionState> {

    canvasRef;
    pathRef;
    pathPointsRef;
    maskPathRef;
    maskRef;

    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
        this.pathRef = React.createRef();
        this.pathPointsRef = React.createRef();
        this.maskPathRef = React.createRef();
        this.maskRef = React.createRef();

        this.state = {
            startX: null,
            startY: null,
            offsetX: null,
            offsetY: null,
            points: [],
            closed: true,
            path: [],
            prevPath: null,
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
        if (prevProps.selectToolParams.mode !== this.props.selectToolParams.mode) {
            this.selectToolHandlers[prevProps.selectToolParams.mode].exit(this.props.selectToolParams.mode)
        }
    }

    static getDerivedStateFromProps(nextProps: CanvasSelectionProps, prevState) {
        const {value} = nextProps;
        return Array.isArray(value) && value !== prevState.prevPath ? {
            prevPath: value,
            path: value,
            currentSliceN: value.filter(({type}) => type === ESegType.M).length,
        } : {}
    }

    commitChanges = () => {
        const {onChange} = this.props;

        onChange && onChange(this.state.path, this.maskPathRef.current && this.maskPathRef.current.getBBox());
    };

    selectToolHandlers = {
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
            drag: () => undefined, // можно сделать чтобы последняя точка перетаскивалась пока держишь
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
        const {selectToolParams} = this.props;
        const {curveType} = selectToolParams;
        const curveValue = selectToolParams[CurveValueName[curveType]];

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
        console.log("selector render", this.state.path);
        const {width, height, selectToolParams: {mode}, isActive, name, style} = this.props;

        this.pathRef.current && this.pathRef.current.setPathData(this.state.path);
        this.maskPathRef.current && this.maskPathRef.current.setPathData(this.state.path);

        console.log(this.maskPathRef.current && this.maskPathRef.current.getBBox());

        return (
            <div
                style={style}
                className={classNames("selection", {
                    ["selectionActive"]: isActive
                })}>
                <SVG
                    width={width}
                    height={height}
                    onDown={this.selectToolHandlers[mode].down}
                    onDrag={this.selectToolHandlers[mode].drag}
                    onUp={this.selectToolHandlers[mode].up}>
                    {this.state.path && this.state.path.length && <>
                        <mask
                            id={`selectionMask${name}`}
                            ref={this.maskRef}>
                            <rect x="0" y="0" width={width} height={height} fill="white"/>
                            <path
                                ref={this.maskPathRef}
                                fillOpacity={1}
                                fill="black"/>
                        </mask>
                        <rect x="0" y="0" width={width} height={height} fill="black" fillOpacity={0.3}
                              mask={`url(#selectionMask${name})`}/>
                        <path
                            ref={this.pathRef}
                            fillOpacity={0}
                            fill="black"
                            stroke="red"/>
                    </>}
                </SVG>
            </div>
        )
    }
}

const mapStateToProps: MapStateToProps<CanvasSelectionStateProps, CanvasSelectionOwnProps, AppState> = state => ({
    selectToolParams: state.selectTool.params,
    currentTool: state.tool.current
});

const mapDispatchToProps: MapDispatchToProps<CanvasSelectionActionProps, CanvasSelectionOwnProps> = {};

export const Selection = connect<CanvasSelectionStateProps, CanvasSelectionActionProps, CanvasSelectionOwnProps, AppState>(
    mapStateToProps, mapDispatchToProps
)(CanvasSelectionComponent);