import React from 'react';
import './App.scss';
import {Main} from "./components/Main";
import {Provider as ReduxProvider} from "react-redux";
import {store} from "./store";

import './translations';

const App: React.FC = () => (
    <ReduxProvider store={store}>
        {/*<I18nextProvider i18n={i18next}>*/}
            <Main/>
        {/*</I18nextProvider>*/}
    </ReduxProvider>
);

export default App;
