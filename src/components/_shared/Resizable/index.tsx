import * as React from "react";
import './styles.scss';
import * as cn from 'classnames';

export interface ResizableProps {
    children: any
    height: number
    minHeight: number
    className?: string
}

export const Resizable: React.FC<ResizableProps> = (props) => {

    const {children, height, className, minHeight} = props;

    const [_height, setHeight] = React.useState(height);
    const startEvent = React.useRef(null);

    React.useEffect(() => {
        setHeight(height)
    }, [height]);

    const containerStyle = React.useMemo(() => {
        return ({
            height: _height
        })
    }, [_height]);

    const moveHandler = React.useCallback((e) => {
        const newHeight = _height + startEvent.current - e.pageY;
        if (newHeight >= minHeight) {
            setHeight(_height + startEvent.current - e.pageY);
        }
    }, [_height, minHeight]);

    const upHandler = React.useCallback(() => {
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', upHandler);
        startEvent.current = null;
    }, [moveHandler]);

    const handlerDown = React.useCallback((e) => {
        startEvent.current = e.pageY;
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
    }, [_height]);


    return (
        <div
            className={cn('resizable', className)}
            style={containerStyle}
        >
            <div
                className={'resizable-handler-top'}
                onMouseDown={handlerDown}
            />
            {children}
        </div>
    );
};