import React from 'react';
import './App.scss';
import {Main} from "./components/Main/Main";
import {Provider} from "react-redux";
import {store} from "./store";

const App: React.FC = () => (
    <Provider store={store}>
        <Main/>
    </Provider>
);

export default App;
