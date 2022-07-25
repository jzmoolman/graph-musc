import React, { useState, useContext } from 'react'
import {  BrowserRouter as Router, Routes,Route } from 'react-router-dom'
import './App.css'

import { Navbar } from './components/Navbar'

import { Neo4jContext, useReadCypher } from 'use-neo4j'

import { Graph } from './components/Graph'
import { ExBox } from './example/ExBox'
import { ExStack } from './example/ExStack'
import { ExGrid } from './example/ExGrid'
import { Box } from '@mui/material'

export const App = () => {  
  const [openDrawer, setOpenDrawer] = useState(false)

  const handleDrawerChange = (open: boolean) => {
    console.log('handleDrawerChange', open)
    setOpenDrawer(open)
  }

  return (
    <div className="App">
      <Router>   
        <Navbar open={openDrawer} onChange={handleDrawerChange}/>
        <Box  
            sx={{
                display: 'flex',
                color: 'white',
                height: 'calc(100vh - 80px)',
         }} 
        >
          <Routes>
            <Route path='/' element={<div>Home</div>}/>
            <Route path='/graph/gene' element={<Graph name='gene' open={openDrawer} onChange={handleDrawerChange} />} />
            <Route path='/graph/organ' element={<Graph name='organ'open={openDrawer} onChange={handleDrawerChange} />} />
            <Route path='/graph/syndrome' element={<Graph name='syndrome' open={openDrawer} onChange={handleDrawerChange} />} />
            <Route path='/exbox' element={<ExBox />} />
            <Route path='/exstack' element={<ExStack />} />
            <Route path='/exgrid' element={<ExGrid />} />
          </Routes>
        </Box>
      </Router>
    </div>
  );
}

export default App;
