import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route} from "react-router-dom";
import AppMaster from "./pages/layouts/AppMaster";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.Fragment>
        <BrowserRouter>
            <AppMaster />
        </BrowserRouter>
    </React.Fragment>
);

reportWebVitals();
