import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../../store";
import {InputText} from "../../_shared/InputText";
import {Button} from "../../_shared/buttons/Button";
import {WithTranslation, withTranslation} from "react-i18next";
import {sendMessage, setDrawer} from "../../../store/patterns/room/actions";
import {ButtonSelect} from "bbuutoonnss";

export interface ChatStateProps {
    messages: string[]
    meDrawer: boolean
    drawer: string
}

export interface ChatActionProps {
    sendMessage(id: string, message: string)

    setDrawer(patternId: string)
}

export interface ChatOwnProps {
    patternId: string

}

export interface ChatProps extends ChatStateProps, ChatActionProps, ChatOwnProps, WithTranslation {

}

const ChatComponent: React.FC<ChatProps> = (props) => {

    const {t, patternId, sendMessage, messages, meDrawer, drawer, setDrawer} = props;

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

    return (
        <div className={'room'}>
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
                        {messages.map(message => (<>
                            {['-', '—'].includes(message.trim()[0]) && <br/>}
                            <span className={'room-chat-message'}>{message}</span>
                            {['-', '—'].includes(message.trim()[0]) && <br/>}
                        </>))}
                    </div>
                </div>


                {/*<Button*/}
                {/*    disabled={meDrawer}*/}
                {/*    onClick={handleSend}*/}
                {/*>{t('chat.send')}</Button>*/}

            </div>
        </div>
    );
};

const mapStateToProps: MapStateToProps<ChatStateProps, ChatOwnProps, AppState> = (state, {patternId}) => ({
    messages: state.patterns[patternId].room.value?.messages || [],
    meDrawer: state.patterns[patternId].room?.value?.meDrawer,
    drawer: state.patterns[patternId].room?.value?.drawer,
});

const mapDispatchToProps: MapDispatchToProps<ChatActionProps, ChatOwnProps> = {
    sendMessage,
    setDrawer
};

export const Chat = connect<ChatStateProps, ChatActionProps, ChatOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(ChatComponent));