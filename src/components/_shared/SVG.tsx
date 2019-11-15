import React from 'react';
import {canvasToImageData} from "../../utils/imageData";

export interface CanvasSVGProps {
    children?: React.ReactNode
    width?: number
    height?: number
    className?: string
    style?: any

    onDrag?(e: MouseEvent, pre: MouseEvent)

    onMove?(e: MouseEvent, pre: MouseEvent)

    onDown?(e: MouseEvent)

    onUp?(e: MouseEvent)
}

export interface CanvasSVGState {
    dragging: boolean
}

export class SVG extends React.PureComponent<CanvasSVGProps, CanvasSVGState> {

    elementRef;
    pre;

    constructor(props) {
        super(props);

        this.state = {
            dragging: false
        };

        this.elementRef = React.createRef();
        this.pre = null;
    }

    componentDidMount() {
        this.elementRef.current.addEventListener("mousedown", this.mouseDownHandler);
        document.addEventListener("mouseup", this.mouseUpHandler);
        this.elementRef.current.addEventListener("mousemove", this.mouseMoveHandler);
    }

    // selectToolHandlers

    private mouseDownHandler = e => {
        this.setState({dragging: true});

        const {onDown} = this.props;

        onDown && onDown(e);
    };

    private mouseUpHandler = e => {
        if (this.state.dragging) {
            this.setState({dragging: false});

            this.pre = null;
            const {onUp} = this.props;

            onUp && onUp(e);
        }
    };

    private mouseMoveHandler = e => {
        const {onDrag, onMove} = this.props;

        this.state.dragging && onDrag && onDrag(e, this.pre);

        onMove && onMove(e, this.pre);

        this.pre = e;
    };

    render() {
        const {children, width, height, className, style} = this.props;
        return (
            <svg
                ref={this.elementRef}
                width={width}
                height={height}
                className={className}
                style={style}>
                {children}
            </svg>
        )
    }
}