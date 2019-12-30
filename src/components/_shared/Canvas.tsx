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

    drawProcess?(e: CanvasEvent)

    clickProcess?(e: CanvasEvent)

    moveProcess?(e: CanvasEvent)

    releaseProcess?(e: CanvasEvent)

    onChange?(imageData?: ImageData)

    onLeave?()


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
            console.log()
            this.ctx.putImageData(this.props.value, 0, 0);
        }
    }

    private mouseDownHandler = e => {
        console.log('canvas down');
        document.addEventListener("mouseup", this.mouseUpHandler);
        this.e = e;
        this.setState({
            drawing: true
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

        const {clickProcess} = this.props;

        clickProcess && clickProcess(event);


    };

    requestID = null;
    start = () => {

        const {drawProcess} = this.props;
        console.log(this.requestID, !this.requestID, "------------------------------------------");


        if (!this.requestID) {
            cancelAnimationFrame(this.requestID);

            const startTime = performance.now();

            console.log(startTime, "------------------------------------------");
            const changing = (time) => {
                console.log(time, this.e.offsetX, this.e.offsetY);

                // this.canvasRef.current.dispatchEvent(new Event("mousemove"));

                this.state.drawing && drawProcess && drawProcess({
                    e: this.e,
                    pre: this.pre,
                    ctx: this.ctx,
                    canvas: this.canvasRef.current,
                    drawing: true
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

    e;

    private mouseMoveHandler = e => {
        // console.log("------------------------------------------", e.offsetX, e.offsetY, e);
        const {drawProcess, moveProcess} = this.props;


        this.pre = this.e;
        this.e = e;

        // this.state.drawing && drawProcess && drawProcess({
        //     e,
        //     pre: this.pre,
        //     ctx: this.ctx,
        //     canvas: this.canvasRef.current,
        //     drawing: true
        // });

        moveProcess && moveProcess({
            e,
            pre: this.pre,
            ctx: this.ctx,
            canvas: this.canvasRef.current,
            drawing: this.state.drawing
        });

        // обновление стxейта, может понадобиться для мультиплеера
        // const {onChange, updateOnDrag = true} = this.props;
        // updateOnDrag && this.state.drawing && onChange && onChange(canvasToImageData(this.canvasRef.current));

        // this.pre = e;
    };

    private mouseUpHandler = e => {
        console.log('canvas up');
        document.removeEventListener("mouseup", this.mouseUpHandler);
        this.stop();
        if (this.state.drawing) {
            this.setState({drawing: false});

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