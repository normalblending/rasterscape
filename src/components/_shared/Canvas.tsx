import React from 'react';
import {canvasToImageData} from "../../utils/imageData";
import "../../styles/canvas.scss";
import * as classNames from "classnames";

export interface CanvasProps {
    value?: ImageData
    width?: number
    height?: number
    className?: string
    style?: any

    children?: React.ReactNode

    updateOnDrag?: boolean

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
        this.setState({drawing: true});

        const {clickProcess} = this.props;

        clickProcess && clickProcess(e, this.ctx, this.canvasRef.current);
    };

    private mouseUpHandler = e => {
        console.log('canvas up');
        document.removeEventListener("mouseup", this.mouseUpHandler);
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

        // обновление стейта
        const {onChange, updateOnDrag = true} = this.props;
        updateOnDrag && this.state.drawing && onChange && onChange(canvasToImageData(this.canvasRef.current));

        this.pre = e;
    };

    // public

    // public setImageData = image =>
    //     this.ctx.putImageData(image, 0, 0);
    //
    // public drawImage = (...p) =>
    //     this.ctx.drawImage(...p);
    // public getCtx = () =>
    //     this.ctx;
    //
    // public getImageData = () =>
    //     this.ctx.getImageData(0, 0, this.props.width, this.props.height);
    //
    // public clear = () => {
    //     this.ctx.clearRect(0, 0, this.props.width, this.props.height);
    // };

    render() {
        console.log("canvas render");
        const {value, width, height, className, style, children} = this.props;
        return (
            <div className={classNames("canvas", className)}>
                <canvas
                    style={style}
                    ref={this.canvasRef}
                    width={width || (value ? value.width : 300)}
                    height={height || (value ? value.height : 300)}/>
                {children}
            </div>
        )
    }
}