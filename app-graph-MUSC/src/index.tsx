import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import App from './App'; 

import reportWebVitals from './reportWebVitals';

import { Neo4jProvider} from 'use-neo4j';
import neo4j  from  'neo4j-driver'

let uri
let password

if(process.env.REACT_APP_VERSION === 'prd'){
  // heroku prd build code
  //console.log('Production')
  uri = process.env.REACT_APP_PRD_URI!
  password = process.env.REACT_APP_PRD_PWD!
} else {
  // heroku beta & development build code
  //console.log('Beta/Development')
  uri = process.env.REACT_APP_BETA_URI!
  password = process.env.REACT_APP_BETA_PWD!
}

const user = 'neo4j'

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))

//const uri = 'neo4j+s://813893ea.databases.neo4j.io'
//const password_production = 'p6YURX5bFlooyM3vRQizhc0uXY_cSpP_gfgJJQ7v_j8'
//const password_beta = 'n2YRPwz5WoXAn_sU6VVNzGg0BJYC5tyWptfbg2eDKd8'
//const uri2 = 'neo4j+s://21918b16.databases.neo4j.io'

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
