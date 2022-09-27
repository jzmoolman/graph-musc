import React, { useState, useContext } from 'react'
import {  BrowserRouter as Router, Routes,Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Graph } from './components/Graph'
import { CustomBox } from './example/CusstomBox'
import { ExStack } from './example/ExStack'
import { ExGrid } from './example/ExGrid'
import { Box } from '@mui/material'

import './App.css'
import { HomeGraph } from './components/HomeGraph'
import { wrap } from 'module'

export const App = () => {  
  const [openDrawer, setOpenDrawer] = useState(false)
   


  const handleDrawerChange = (open: boolean) => {
    console.log('handleDrawerChange', open)
    setOpenDrawer(open)
  }

  return (
      <Router>   
        <Navbar open={openDrawer} onChange={handleDrawerChange}/>
        <Box
            id='workspace'
            marginTop='60px'
            sx={{
                splay: 'flex',
                color: 'white',
                height: 'calc(100vh - 75px)',
                direction: 'column',
                gap: '5px 5px',
                
         }} 
        >
          <Routes>
            <Route path='/' element={<HomeGraph/>}/>
            <Route path='/graph/gene' element={<Graph name='gene-organ' open={openDrawer} onChange={handleDrawerChange} />} />
            <Route path='/graph/organ' element={<Graph name='organ'open={openDrawer} onChange={handleDrawerChange} />} />
            <Route path='/graph/disease' element={<Graph name='disease' open={openDrawer} onChange={handleDrawerChange} />} />
            <Route path='/graph/syndrome' element={<Graph name='syndrome-disease' open={openDrawer} onChange={handleDrawerChange} />} />
            <Route path='/custombox' element={<CustomBox />} />
            <Route path='/exstack' element={<ExStack />} />
            <Route path='/exgrid' element={<ExGrid />} />
          </Routes>
        </Box>
      </Router>
  );
}

export default App;
