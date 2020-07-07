import React from 'react';
import {canvasToImageData, imageDataToCanvas, resizeImageData} from "../../utils/canvas/helpers/imageData";
import "../../styles/canvas.scss";
import * as classNames from "classnames";
import {getOffset} from "../../utils/offset";
import {rotate} from "../../utils/draw";
import {RotationValue} from "../../store/patterns/rotating/types";
import {clearCanvas} from "../../utils/canvas/helpers/base";
import {ECompositeOperation} from "../../store/compositeOperations";
import * as StackBlur from 'stackblur-canvas';
import {coordHelper, coordHelper2} from "../Area/canvasPosition.servise";

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

    drawOnMove?: boolean

    onDown?(e: CanvasEvent)

    onUp?(e: CanvasEvent)

    onDraw?(e: CanvasEvent)

    onClick?(e: CanvasEvent)

    onMove?(e: CanvasEvent)

    downProcess?(e: CanvasEvent)

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
    canvasE;
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

    receiveImageData = () => {
        if (this.props.value instanceof ImageData) {
            this.ctx = this.canvasRef.current.getContext("2d");

            const imgD = this.props.value.width !== this.props.width || this.props.value.height !== this.props.height
                ? resizeImageData(this.props.value, this.props.width, this.props.height)
                : this.props.value;

            this.ctx.putImageData(imgD, 0, 0);
        }
    };

    componentDidMount() {
        this.ctx = this.canvasRef.current.getContext("2d");

        this.canvasRef.current.addEventListener("mousedown", this.mouseDownHandler);
        this.canvasRef.current.addEventListener("mousemove", this.mouseMoveHandler);
        this.canvasRef.current.addEventListener("mouseenter", this.mouseEnterHandler);
        this.canvasRef.current.addEventListener("mouseleave", this.mouseLeaveHandler);

        this.receiveImageData();
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
        )) {
            this.receiveImageData();
        }
    }

    /**
     DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN
     DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN DOWN
     * */

    private mouseDownHandler = e => {
        if (this.props.pointerLock) {
            this.canvasRef.current.requestPointerLock();
        }

        // coordHelper2.setText('');
        // coordHelper2.writeln('down');


        document.addEventListener("mouseup", this.mouseUpHandler);
        document.addEventListener("mousemove", this.mouseDragHandler);

        this.e = e;
        this.setState({
            drawing: true,
            startEvent: e
        });

        const event: CanvasEvent = {
            e,
            ctx: this.ctx,
            canvas: this.canvasRef.current,
            drawing: true,
            rotation: this.props.rotation
        };

        const {onDown, downProcess} = this.props;

        // coordHelper2.writeln('down', event.e.offsetX, event.e.offsetY);
        onDown && onDown(event);
        downProcess && downProcess(event);

        this.start();

        const {onClick} = this.props;
        setTimeout(() => {


            // coordHelper2.writeln('click', event.e.offsetX, event.e.offsetY);
            !this.state.drawing && onClick && onClick(event);
        }, 10)

    };


    /**
     ANIMATION CYCLE ANIMATION CYCLE ANIMATION CYCLE ANIMATION CYCLE ANIMATION CYCLE ANIMATION CYCLE ANIMATION  CYCLE ANIMATION  CYCLE
     CYCLE ANIMATION CYCLE ANIMATION CYCLE ANIMATION CYCLE ANIMATION CYCLE ANIMATION CYCLE ANIMATION CYCLE ANIMATION CYCLE ANIMATION CYCLE
     * */

    draw = () => {
        const e = this.canvasE;
        // coordHelper2.writeln('draw', e?.offsetX, e?.offsetY);

        const {onDraw} = this.props;
        onDraw && onDraw({
            e,
            pre: this.pre,
            ctx: this.ctx,
            canvas: this.canvasRef.current,
            drawing: true,
            rotation: this.props.rotation
        });
    };

    move = (canvas?: boolean) => {
        const e = canvas ? this.canvasE : this.e;
        // canvas && coordHelper2.writeln('move', e.offsetX, e.offsetY);

        const {onMove} = this.props;
        onMove && onMove({
            e,
            pre: this.pre,
            ctx: this.ctx,
            canvas: this.canvasRef.current,
            drawing: this.state.drawing,
        });
    };

    equalEvents = (e1, e2) => {
        return e1?.offsetY === e2?.offsetY && e1?.offsetX === e2?.offsetX
    };

    onFrame = () => {
        // coordHelper2.writeln('frame');

        const prevCanvasE = this.canvasE;
        const canvasE = this.canvasE = this.getCanvasRelatedEvent(this.e);

        // this.state.drawing && - не нужно но по сути так
        this.move(true);

        const {drawOnMove} = this.props;
        if (
            !drawOnMove
            || (!this.equalEvents(prevCanvasE, canvasE))
        ) {
            this.draw();
        }

    };

    getCanvasRelatedEvent = (e) => {
        const {top, left, box} = getOffset(this.canvasRef.current);
        const canvasCenter = {
            x: left + box.width / 2,
            y: top + box.height / 2
        };
        const rotatedE = rotate(canvasCenter.x, canvasCenter.y, e.pageX, e.pageY, this.props.rotation ? this.props.rotation.angle : 0);
        return {
            ...e,
            offsetX: rotatedE.x - canvasCenter.x + this.props.width / 2,
            offsetY: rotatedE.y - canvasCenter.y + this.props.height / 2,
        };
    };

    start = () => {
        // coordHelper2.writeln('start');

        if (this.requestID) return;

        let prevT = 0;
        const changing = (time) => {

            // DRAW SPEED
            coordHelper.setText(time - prevT);
            prevT = time;

            this.onFrame();

            this.requestID = requestAnimationFrame(changing);
        };
        this.requestID = requestAnimationFrame(changing);

    };

    stop = () => {
        this.requestID && cancelAnimationFrame(this.requestID);
        this.requestID = null;
    };


    /**
     MOVE DRAG MOVE DRAG MOVE DRAG MOVE DRAG MOVE DRAG MOVE DRAG MOVE DRAG MOVE DRAG MOVE DRAG MOVE DRAG MOVE DRAG MOVE
     DRAG MOVE DRAG MOVE DRAG MOVE DRAG MOVE DRAG MOVE DRAG MOVE DRAG MOVE DRAG MOVE DRAG MOVE DRAG MOVE DRAG MOVE DRAG
     * */


    private mouseMoveHandler = e => {

        if (!this.state.drawing) {

            this.pre = this.e;
            this.e = e;

            // если просто водим мышкой

            this.move();
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
            const {drawOnMove} = this.props;
            if (drawOnMove) {
                this.draw();
            }

        }
    };


    /**
     UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP
     UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP UP
     * */


    private mouseUpHandler = e => {

        document.removeEventListener("mouseup", this.mouseUpHandler);
        document.removeEventListener("mousemove", this.mouseDragHandler);

        if (this.props.pointerLock) {
            document.exitPointerLock();
        }

        this.stop();
        if (this.state.drawing) {
            this.setState({drawing: false, startEvent: e});

            this.pre = null;
            this.e= null;
            const {onChange} = this.props;

            const imageData = canvasToImageData(this.canvasRef.current);

            const res = imageData;

            onChange && onChange(res);

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


    /**
     ENTER LEAVE ENTER LEAVE ENTER LEAVE ENTER LEAVE ENTER LEAVE ENTER LEAVE ENTER LEAVE ENTER LEAVE ENTER LEAVE ENTER LEAVE ENTER LEAVE
     LEAVE ENTER LEAVE ENTER LEAVE ENTER LEAVE ENTER LEAVE ENTER LEAVE ENTER LEAVE ENTER LEAVE ENTER LEAVE ENTER LEAVE ENTER LEAVE ENTER
     * */

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