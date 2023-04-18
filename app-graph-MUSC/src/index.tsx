import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import App from './App'; 



import reportWebVitals from './reportWebVitals';

import { Neo4jProvider} from 'use-neo4j';
import neo4j  from  'neo4j-driver'

const uri = 'neo4j+s://813893ea.databases.neo4j.io'
let uri2
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // development build code
    uri2 = 'neo4j+s://21918b16.databases.neo4j.io'
} else {
    // production build code
    uri2 = 'neo4j+s://21918b16.databases.neo4j.io'
}

const user = 'neo4j'
const password = 'p6YURX5bFlooyM3vRQizhc0uXY_cSpP_gfgJJQ7v_j8'
const password2 = 'n2YRPwz5WoXAn_sU6VVNzGg0BJYC5tyWptfbg2eDKd8'




// const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
const driver = neo4j.driver(uri2, neo4j.auth.basic(user, password2))

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
