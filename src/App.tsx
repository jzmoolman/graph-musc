import React, { useContext } from 'react'
import {  BrowserRouter as Router, Routes,Route, Link  } from 'react-router-dom'
import logo from './logo.svg'
import './App.css'


import { Driver  } from 'neo4j-driver';
import { Neo4jContext, useReadCypher } from 'use-neo4j'
import { Menu } from 'semantic-ui-react';

import { Home } from './views/Home'
import { Genes } from './views/Genes'
import { GeneGraph } from './views/GeneGraph'
import { Debug } from './views/debug'

function App() {
 

  const context = useContext(Neo4jContext)

  return (
    <div className="App">
   
      <Router>   
        <Menu>
          <Menu.Item as={Link} to='/'>Home</Menu.Item>
          <Menu.Item as={Link} to='/genes'>Genes</Menu.Item>
          <Menu.Item as={Link} to='/graph'>Graph</Menu.Item>
          <Menu.Item as={Link} to='/debug'>Debug</Menu.Item>
        </Menu>

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/genes' element={<Genes />} />
          <Route path='/graph' element={<GeneGraph />} />
          <Route path='/debug' element={<Debug />} />
        </Routes>
       
      </Router>
    </div>
  );
}

export default App;
