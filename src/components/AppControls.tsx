import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {withTranslation, WithTranslation} from 'react-i18next';
import {AppState} from "../store";
import {Button} from "./_shared/buttons/Button";
import {reverseFullScreen} from "../store/fullscreen";
import * as classNames from "classnames";
import {setLanguage} from "../store/language";

export interface AppControlsStateProps {
    isFull: boolean
    language: string
}

export interface AppControlsActionProps {
    reverseFullScreen()

    setLanguage(language: string)
}

export interface AppControlsOwnProps {

}

export interface AppControlsProps extends AppControlsStateProps, AppControlsActionProps, AppControlsOwnProps, WithTranslation {

}

export interface AppControlsState {

}

const languages = ['en', 'ru'];

class AppControlsComponent extends React.PureComponent<AppControlsProps, AppControlsState> {
    handleLanguage = () => {
        const {setLanguage, language, i18n} = this.props;

        const newLang = languages[(languages.indexOf(language) + 1) % languages.length];
        setLanguage(newLang);
        i18n.changeLanguage(newLang);
    };

    render() {
        const {reverseFullScreen, isFull, setLanguage, language} = this.props;
        return (
            <div className='app-controls'>
                <Button
                    className="app-control-button"
                    onClick={this.handleLanguage}>{language}</Button>
                <Button
                    className="app-control-button"
                    onClick={reverseFullScreen}>?</Button>
                <Button
                    className={classNames("app-control-button", "full-button", {
                        ["full-button-off"]: isFull
                    })}
                    onClick={reverseFullScreen}>
                    <div className="tl"></div>
                    <div className="br"></div>
                </Button>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<AppControlsStateProps, AppControlsOwnProps, AppState> = state => ({
    isFull: state.fullScreen,
    language: state.language
});

const mapDispatchToProps: MapDispatchToProps<AppControlsActionProps, AppControlsOwnProps> = {
    reverseFullScreen,
    setLanguage
};

export const AppControls = connect<AppControlsStateProps, AppControlsActionProps, AppControlsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation()(AppControlsComponent));