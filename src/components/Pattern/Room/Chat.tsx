import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../../store";
import {InputText} from "../../_shared/InputText";
import {Button} from "../../_shared/buttons/Button";
import {WithTranslation, withTranslation} from "react-i18next";
import {resetUnreaded, sendMessage, setDrawer} from "../../../store/patterns/room/actions";
import {ButtonSelect} from "bbuutoonnss";
import * as classNames from 'classnames';

export interface ChatStateProps {
    messages: string[]
    meDrawer: boolean
    drawer: string
    unreaded: number
}

export interface ChatActionProps {
    sendMessage(id: string, message: string)

    setDrawer(patternId: string)

    resetUnreaded(patternId: string)
}

export interface ChatOwnProps {
    patternId: string

}

export interface ChatProps extends ChatStateProps, ChatActionProps, ChatOwnProps, WithTranslation {

}

const ChatComponent: React.FC<ChatProps> = (props) => {

    const {t, patternId, sendMessage, messages, meDrawer, drawer, setDrawer, unreaded, resetUnreaded} = props;

    const [message, setMessage] = React.useState('');

    const handleSend = React.useCallback(() => {
        sendMessage(patternId, message);
        setMessage('');
    }, [patternId, message]);

    const handleKeyPress = React.useCallback((e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    }, [patternId, message]);

    const handleSetDrawer = React.useCallback(() => {
        setDrawer(patternId);
    }, [setDrawer, patternId]);

    const handleMouseEnter = React.useCallback(() => {
        unreaded && resetUnreaded(patternId);
    }, [resetUnreaded, patternId, unreaded]);

    return (
        <div className={classNames('room', {unread: unreaded})} onMouseEnter={handleMouseEnter}>
            <div className='room-chat'>

                {!meDrawer && (<>
                    <div className={'room-chat-sign'}>{'>'}</div>
                    <InputText
                        disabled={meDrawer}
                        maxLength={99}
                        className='room-chat-message-input'
                        value={message}
                        onChange={setMessage}
                        onKeyPress={handleKeyPress}
                    />
                </>)}
                <div className='room-chat-messages'>

                    <div className='room-chat-messages-container'>
                        {messages.map((message, index) => (<>
                            {['-', '—'].includes(message.trim()[0]) && <br/>}
                            <span
                                className={classNames('room-chat-message', {
                                    unreaded: unreaded >= messages.length - index
                                })}>{message}</span>
                        </>))}
                    </div>
                </div>

                {/*{(unreaded) ? (*/}
                {/*    <div className={'message-counter'}>{unreaded}</div>*/}
                {/*) : null}*/}
            </div>
        </div>
    );
};

const mapStateToProps: MapStateToProps<ChatStateProps, ChatOwnProps, AppState> = (state, {patternId}) => ({
    messages: state.patterns[patternId].room.value?.messages || [],
    meDrawer: state.patterns[patternId].room?.value?.meDrawer,
    drawer: state.patterns[patternId].room?.value?.drawer,
    unreaded: state.patterns[patternId].room?.value?.unreaded,
});

const mapDispatchToProps: MapDispatchToProps<ChatActionProps, ChatOwnProps> = {
    sendMessage,
    setDrawer,
    resetUnreaded
};

export const Chat = connect<ChatStateProps, ChatActionProps, ChatOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(ChatComponent));