import * as React from "react";

export interface ButtonProps {
    onClick()

    className?: string
    children?: React.ReactNode,
    disabled?: boolean
    width?: number
}

export const Button: React.FC<ButtonProps> = ({children, onClick, disabled, width, className}) => {
    return (
        <button
            className={className}
            onClick={onClick}
            style={{width}}
            disabled={disabled}>
            {children}
        </button>
    )
};