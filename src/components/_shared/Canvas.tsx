import React from 'react';
import {canvasToImageData} from "../../utils/canvas";
import {AppState} from "../../store";
import {WindowState} from "../../store/mainCanvas/reducer";
import {windowSelectors} from "../../store/_shared/canvas/selectors";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {
    CanvasSelector,
    CanvasSelectorActionProps,
    CanvasSelectorOwnProps,
    CanvasSelectorStateProps
} from "./CanvasSelector";

export interface CanvasProps {
    value?: ImageData
    width?: number
    height?: number
    className?: string
    style?: any

    children?: React.ReactNode

    drawProcess?(e: MouseEvent, pre: MouseEvent, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement)

    clickProcess?(e: MouseEvent, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement)

    moveProcess?(e: MouseEvent, pre: MouseEvent, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, drawing: boolean)

    onChange?(imageData?: ImageData)
}

export interface CanvasState {
    drawing: boolean
}

export class Canvas extends React.PureComponent<CanvasProps, CanvasState> {

    canvasRef;
    ctx;
    pre;

    constructor(props) {
        super(props);

        this.state = {
            drawing: false
        };

        this.canvasRef = React.createRef();
        this.ctx = null;
        this.pre = null;
    }

    componentDidMount() {
        this.ctx = this.canvasRef.current.getContext("2d");


        this.canvasRef.current.addEventListener("mousedown", this.mouseDownHandler);
        document.addEventListener("mouseup", this.mouseUpHandler);
        this.canvasRef.current.addEventListener("mousemove", this.mouseMoveHandler);

        if (this.props.value instanceof ImageData) {
            this.ctx.putImageData(this.props.value, 0, 0);
        }
    }

    componentWillUnmount() {
        // listeners
    }

    componentDidUpdate(prevProps) {
        console.log(Object.keys(this.props).reduce((res, key) => ({
            ...res,
            [key]: prevProps[key] !== this.props[key]
        }), {}));
        if ((
            prevProps.value !== this.props.value ||
            prevProps.width !== this.props.width ||
            prevProps.height !== this.props.height
        ) && this.props.value instanceof ImageData) {
            this.ctx.putImageData(this.props.value, 0, 0);
        }
    }

    // handlers

    private mouseDownHandler = e => {
        this.setState({drawing: true});

        const {clickProcess} = this.props;

        clickProcess && clickProcess(e, this.ctx, this.canvasRef.current);
    };

    private mouseUpHandler = e => {
        if (this.state.drawing) {
            this.setState({drawing: false});

            this.pre = null;
            const {onChange} = this.props;

            onChange && onChange(canvasToImageData(this.canvasRef.current));
        }
    };

    private mouseMoveHandler = e => {
        const {drawProcess, moveProcess} = this.props;

        this.state.drawing && drawProcess && drawProcess(e, this.pre, this.ctx, this.canvasRef.current);

        moveProcess && moveProcess(e, this.pre, this.ctx, this.canvasRef.current, this.state.drawing);

        this.pre = e;
    };

    // public

    public setImageData = image =>
        this.ctx.putImageData(image, 0, 0);

    public drawImage = (...p) =>
        this.ctx.drawImage(...p);
    public getCtx = () =>
        this.ctx;

    public getImageData = () =>
        this.ctx.getImageData(0, 0, this.props.width, this.props.height);

    public clear = () => {
        this.ctx.clearRect(0, 0, this.props.width, this.props.height);
    };

    render() {
        const {value, width, height, className, style, children} = this.props;
        return (
            <div className="canvasLayers">
                <canvas
                    style={style}
                    ref={this.canvasRef}
                    className={className}
                    width={width || (value ? value.width : 300)}
                    height={height || (value ? value.height : 300)}/>
                {React.Children.map(children, child =>
                    <div className="canvasLayer">{child}</div>)}
            </div>
        )
    }
}

export const canvasConnect = (getSelectionState: (state: AppState) => WindowState, changeAction) => {

    const WindowSelectors = windowSelectors(state => state.mainCanvas);
    const mapStateToProps: MapStateToProps<CanvasSelectorStateProps, CanvasSelectorOwnProps, AppState> = state => ({
        value: WindowSelectors.getSelectionValue(state),
        size: WindowSelectors.getSize(state),
        params: WindowSelectors.getSelectionParams(state)
    });

    const mapDispatchToProps: MapDispatchToProps<CanvasSelectorActionProps, CanvasSelectorOwnProps> = {
        onChange: changeAction
    };

    return connect<CanvasSelectorStateProps, CanvasSelectorActionProps, CanvasSelectorOwnProps, AppState>(
        mapStateToProps, mapDispatchToProps
    )(CanvasSelector)
};