import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../store";
import {Button} from "bbuutoonnss";
import {createCanvas} from "../utils/canvas/helpers/base";

export interface TestStateProps {
}

export interface TestActionProps {
}

export interface TestOwnProps {

}

export interface TestProps extends TestStateProps, TestActionProps, TestOwnProps {

}

const TestComponent: React.FC<TestProps> = ({}) => {

    const handleClick = React.useCallback(() => {
        createCanvas(300,300);
    }, []);

    return (
        <>
            {/*<Button onClick={handleClick}>test</Button>*/}
        </>
    );
};

const mapStateToProps: MapStateToProps<TestStateProps, TestOwnProps, AppState> = state => ({});

const mapDispatchToProps: MapDispatchToProps<TestActionProps, TestOwnProps> = {};

export const Test = connect<TestStateProps, TestActionProps, TestOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(TestComponent);