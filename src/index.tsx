import React from 'react';
import ReactDOM from 'react-dom/client';
import 'semantic-ui-css/semantic.min.css'

import './index.css';

import App from './App'; 



import reportWebVitals from './reportWebVitals';

import { Neo4jProvider, createDriver } from 'use-neo4j';

const driver = createDriver('neo4j', 'localhost',7687,'neo4j','123456')

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <Neo4jProvider driver={driver}>
    
    <App />
    </Neo4jProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
