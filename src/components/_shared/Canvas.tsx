import React from 'react';
import {canvasToImageData} from "../../utils/canvas/helpers/imageData";
import "../../styles/canvas.scss";
import * as classNames from "classnames";
import {getOffset} from "../../utils/offset";
import {rotate} from "../../utils/draw";
import {RotationValue} from "../../store/patterns/rotating/types";

export interface CanvasEvent {
    e: MouseEvent
    pre?: MouseEvent
    ctx: CanvasRenderingContext2D
    canvas: HTMLCanvasElement
    drawing?: boolean
    rotation?: RotationValue
}

export interface CanvasProps {
    value?: ImageData
    width?: number
    height?: number
    className?: string
    style?: any

    children?: React.ReactNode

    rotation?: RotationValue

    pointerLock?: boolean

    updateOnDrag?: boolean

    onDown?(e: CanvasEvent)

    onUp?(e: CanvasEvent)

    onDraw?(e: CanvasEvent)

    onClick?(e: CanvasEvent)

    onMove?(e: CanvasEvent)

    releaseProcess?(e: CanvasEvent)

    onChange?(imageData?: ImageData)

    onLeave?(e?)


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
        this.canvasRef.current.addEventListener("mouseenter", this.mouseEnterHandler);
        this.canvasRef.current.addEventListener("mouseleave", this.mouseLeaveHandler);

        if (this.props.value instanceof ImageData) {
            this.ctx.putImageData(this.props.value, 0, 0);
        }
    }

    componentWillUnmount() {
        this.canvasRef.current.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvasRef.current.removeEventListener("mousemove", this.mouseMoveHandler);
        this.canvasRef.current.removeEventListener("mouseenter", this.mouseEnterHandler);
        this.canvasRef.current.removeEventListener("mouseleave", this.mouseLeaveHandler);
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
        if (this.props.pointerLock) {
            this.canvasRef.current.requestPointerLock();
        }

        document.addEventListener("mouseup", this.mouseUpHandler);
        document.addEventListener("mousemove", this.mouseDragHandler);

        this.e = e;
        this.setState({
            drawing: true,
            startEvent: e
        });

        const event = {
            e,
            ctx: this.ctx,
            canvas: this.canvasRef.current,
            drawing: true,
            rotation: this.props.rotation
        };

        const {onDown} = this.props;

        onDown && onDown(event);

        this.start();

        setTimeout(()=> {

            const {onClick} = this.props;

            onClick && onClick(event);
        }, 10)

    };

    start = () => {

        const {onDraw, onMove} = this.props;


        if (!this.requestID) {

            const changing = (time) => {

                const e = this.e;
                const {top, left, box} = getOffset(this.canvasRef.current);

                const canvasCenter = {
                    x: left + box.width / 2,
                    y: top + box.height / 2
                };
                const rotatedE = rotate(canvasCenter.x, canvasCenter.y, e.pageX, e.pageY, this.props.rotation ? this.props.rotation.angle : 0);


                this.state.drawing && onMove && onMove({
                    e: {
                        ...e,
                        offsetX: rotatedE.x - canvasCenter.x + this.props.width / 2,
                        offsetY: rotatedE.y - canvasCenter.y + this.props.height / 2,
                    },
                    pre: this.pre,
                    ctx: this.ctx,
                    canvas: this.canvasRef.current,
                    drawing: this.state.drawing,
                });

                // todo тут видимо можно передать тайм в онДрав и использовать это время для энвелопа ил  нет?
                this.state.drawing && onDraw && onDraw({
                    e: {
                        ...e,
                        offsetX: rotatedE.x - canvasCenter.x + this.props.width / 2,
                        offsetY: rotatedE.y - canvasCenter.y + this.props.height / 2,
                    },
                    pre: this.pre,
                    ctx: this.ctx,
                    canvas: this.canvasRef.current,
                    drawing: true,
                    rotation: this.props.rotation
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

            // если просто водим мышкой

            onMove && onMove({
                e: this.e,
                pre: this.pre,
                ctx: this.ctx,
                canvas: this.canvasRef.current,
                drawing: this.state.drawing,
            });
        }
    };

    mouseDragHandler = (e) => {

        if (this.state.drawing) {
            this.pre = this.e;
            this.e = this.props.pointerLock ? {
                ...e,
                pageX: this.pre.pageX + e.movementX,
                pageY: this.pre.pageY + e.movementY,
            } : e;

            // если водим при нажатии
            // в этом случае onMove срабатывает в анимации

        }
    };

    private mouseUpHandler = e => {
        console.log('canvas up');

        document.removeEventListener("mouseup", this.mouseUpHandler);
        document.removeEventListener("mousemove", this.mouseDragHandler);

        if (this.props.pointerLock) {
            document.exitPointerLock();
        }

        this.stop();
        if (this.state.drawing) {
            this.setState({drawing: false, startEvent: e});

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

    mouseEnterHandler = (e) => {

        // console.log(e);
        if (!this.state.drawing) {
            // console.log(e);
            // this.setState({startEvent: e});
        } else {


        }
    };

    mouseLeaveHandler = (e) => {

        if (!this.state.drawing) {
            // this.setState({startEvent: null});

        } else {


        }

        const {onLeave} = this.props;

        onLeave && onLeave(e);
    };

    render() {
        const {value, width, height, className, style, children} = this.props;
        // console.log("canvas render", this.state);
        return (
            <div style={style} className={classNames(className, "canvas")}>
                <canvas
                    ref={this.canvasRef}
                    width={width || (value ? value.width : 300)}
                    height={height || (value ? value.height : 300)}/>
                {children}
            </div>
        )
    }
}