import React from 'react';
import './App.scss';
import {Main} from "./components/Main";
import {Provider as ReduxProvider} from "react-redux";
import {store} from "./store";

import './store/language/translations';
import {Day9} from "./Day9/Day9";

const App: React.FC = () => (
    <ReduxProvider store={store}>
        <Main/>
    </ReduxProvider>
);

export default App;
