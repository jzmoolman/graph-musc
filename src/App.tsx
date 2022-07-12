import React, { useContext } from 'react'
import {  BrowserRouter as Router, Routes,Route, Link  } from 'react-router-dom'
import './App.css'


import { Neo4jContext, useReadCypher } from 'use-neo4j'
import { Menu } from 'semantic-ui-react';

import { Home } from './views/Home'
import { Genes } from './views/Genes'
import { GeneGraph } from './views/GeneGraph'
import { Graph } from './views/Graph'
import { Debug } from './views/debug'
import { UserRefDebug } from './views/UseRefDebug'
import { Flex } from './views/Flex'

export const App = () => {  
 

  const context = useContext(Neo4jContext)

  return (
    <div className="App">
   
      <Router>   
        <Menu>
          <Menu.Item as={Link} to='/'>Home</Menu.Item>
          <Menu.Item as={Link} to='/genes'>Genes</Menu.Item>
          <Menu.Item as={Link} to='/graph/1'>Graph</Menu.Item>
          <Menu.Item as={Link} to='/graph/2'>Graph2</Menu.Item>
          <Menu.Item as={Link} to='/debug'>Debug</Menu.Item>
          <Menu.Item as={Link} to='/userefdebug'>UseRefDebug</Menu.Item>
          <Menu.Item as={Link} to='/flex'>Flex</Menu.Item>
        </Menu>

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/genes' element={<Genes />} />
          <Route path='/graph/1' element={<GeneGraph />} />
          <Route path='/graph/2' element={<Graph />} />
          <Route path='/debug' element={<Debug />} />
          <Route path='/userefdebug' element={<UserRefDebug />} />
          <Route path='/flex' element={<Flex />} />
        </Routes>
       
      </Router>
    </div>
  );
}

export default App;
