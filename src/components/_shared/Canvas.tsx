import React from 'react';
import {canvasToImageData} from "../../utils/canvas/imageData";
import "../../styles/canvas.scss";
import * as classNames from "classnames";
import {change} from "../../store/change/actions";
import {EChangingAction} from "../../store/changing/actions";

export interface CanvasEvent {
    e: MouseEvent
    pre?: MouseEvent
    ctx: CanvasRenderingContext2D
    canvas: HTMLCanvasElement
    drawing?: boolean
}

export interface CanvasProps {
    value?: ImageData
    width?: number
    height?: number
    className?: string
    style?: any

    children?: React.ReactNode

    updateOnDrag?: boolean

    onDown?(e: CanvasEvent)

    onUp?(e: CanvasEvent)

    onDraw?(e: CanvasEvent)

    onClick?(e: CanvasEvent)

    onMove?(e: CanvasEvent)

    releaseProcess?(e: CanvasEvent)

    onChange?(imageData?: ImageData)

    onLeave?()


}

export interface CanvasState {
    drawing: boolean
    startEvent: any
}

export class Canvas extends React.PureComponent<CanvasProps, CanvasState> {

    canvasRef;
    ctx;
    e;
    pre;
    requestID;

    constructor(props) {
        super(props);

        this.state = {
            drawing: false,
            startEvent: null
        };

        this.canvasRef = React.createRef();
        this.ctx = null;
        this.pre = null;
    }

    componentDidMount() {
        this.ctx = this.canvasRef.current.getContext("2d");


        this.canvasRef.current.addEventListener("mousedown", this.mouseDownHandler);
        this.canvasRef.current.addEventListener("mousemove", this.mouseMoveHandler);

        if (this.props.value instanceof ImageData) {
            this.ctx.putImageData(this.props.value, 0, 0);
        }
    }

    componentWillUnmount() {
        this.canvasRef.current.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvasRef.current.removeEventListener("mousemove", this.mouseMoveHandler);
    }

    componentDidUpdate(prevProps) {
        // console.log(Object.keys(this.props).reduce((res, key) => ({
        //     ...res,
        //     [key]: prevProps[key] !== this.props[key]
        // }), {}));
        //
        // console.log(prevProps.value !== this.props.value ||
        //     prevProps.width !== this.props.width ||
        //     prevProps.height !== this.props.height);
        if ((
            prevProps.value !== this.props.value ||
            prevProps.width !== this.props.width ||
            prevProps.height !== this.props.height
        ) && this.props.value instanceof ImageData) {

            this.ctx = this.canvasRef.current.getContext("2d");

            this.ctx.putImageData(this.props.value, 0, 0);
        }
    }

    private mouseDownHandler = e => {
        console.log('canvas down');

        document.addEventListener("mouseup", this.mouseUpHandler);
        window.addEventListener("mousemove", this.mouseDragHandler);

        this.e = e;
        this.setState({
            drawing: true,
            startEvent: e
        });

        this.start();
        const event = {
            e,
            ctx: this.ctx,
            canvas: this.canvasRef.current,
            drawing: true
        };

        const {onDown} = this.props;

        onDown && onDown(event);

        const {onClick} = this.props;

        onClick && onClick(event);


    };

    start = () => {

        const {onDraw} = this.props;


        if (!this.requestID) {

            const changing = (time) => {

                // todo тут видимо можно передать тайм в онДрав и использовать это время для энвелопа ил  нет?
                this.state.drawing && onDraw && onDraw({
                    e: this.e,
                    pre: this.pre,
                    ctx: this.ctx,
                    canvas: this.canvasRef.current,
                    drawing: true,
                });


                this.requestID = requestAnimationFrame(changing);
            };
            this.requestID = requestAnimationFrame(changing);
        }
    };

    stop = () => {
        this.requestID && cancelAnimationFrame(this.requestID);
        this.requestID = null;
    };

    private mouseMoveHandler = e => {
        const {onMove} = this.props;

        if (!this.state.drawing) {

            this.pre = this.e;
            this.e = e;

            onMove && onMove({
                e,
                pre: this.pre,
                ctx: this.ctx,
                canvas: this.canvasRef.current,
                drawing: this.state.drawing
            });
        }
    };

    mouseDragHandler = (e) => {

        const {startEvent} = this.state;

        const {onMove} = this.props;

        if (this.state.drawing) {

            this.pre = this.e;
            this.e = {
                ...e,
                offsetX: e.screenX - startEvent.screenX + startEvent.offsetX,
                offsetY: e.screenY - startEvent.screenY + startEvent.offsetY,
            };

            onMove && onMove({
                e: this.e,
                pre: this.pre,
                ctx: this.ctx,
                canvas: this.canvasRef.current,
                drawing: this.state.drawing
            });
        }
    };

    private mouseUpHandler = e => {
        console.log('canvas up');

        document.removeEventListener("mouseup", this.mouseUpHandler);
        window.removeEventListener("mousemove", this.mouseDragHandler);

        this.stop();
        if (this.state.drawing) {
            this.setState({drawing: false, startEvent: null});

            this.pre = null;
            const {onChange} = this.props;

            onChange && onChange(canvasToImageData(this.canvasRef.current));

            const event = {
                e,
                ctx: this.ctx,
                canvas: this.canvasRef.current,
                drawing: false
            };

            const {onUp} = this.props;

            onUp && onUp(event);

            const {releaseProcess} = this.props;

            releaseProcess && releaseProcess(event);
        }
    };

    render() {
        const {value, width, height, className, style, children, onLeave} = this.props;
        // console.log("canvas render", this.state);
        return (
            <div style={style} className={classNames(className, "canvas")}>
                <canvas
                    onMouseLeave={onLeave}
                    ref={this.canvasRef}
                    width={width || (value ? value.width : 300)}
                    height={height || (value ? value.height : 300)}/>
                {children}
            </div>
        )
    }
}