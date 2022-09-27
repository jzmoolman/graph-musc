import React, { useState, useContext } from 'react'
import {  BrowserRouter as Router, Routes,Route } from 'react-router-dom'
import { CustomBox } from './example/CusstomBox'
import { ExStack } from './example/ExStack'
import { ExGrid } from './example/ExGrid'
import { Box, createTheme, ThemeProvider } from '@mui/material'
import { HomeGraph } from './components/HomeGraph'
import { HeaderGraph } from './components/HeaderGraph'

import './App.css'
  
const theme = createTheme({

  typography: { 
    fontFamily: 'Libre Franklin',
  }
})

export const App = () => {  
  const [openDrawer, setOpenDrawer] = useState(false)

  const handleDrawerChange = (open: boolean) => {
    console.log('handleDrawerChange', open)
    setOpenDrawer(open)
  }
  
  return (<>
    <ThemeProvider theme={theme}>      
      <Router>
          <Box
              id='workspace'
              marginTop='10px'
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
              <Route path='/graph/gene' element={<HeaderGraph name='gene-organ' open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/graph/organ' element={<HeaderGraph name='organ'open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/graph/disease' element={<HeaderGraph name='disease' open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/graph/syndrome' element={<HeaderGraph name='syndrome-disease' open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/custombox' element={<CustomBox />} />
              <Route path='/exstack' element={<ExStack />} />
              <Route path='/exgrid' element={<ExGrid />} />
            </Routes>
          </Box>
      </Router>
    </ThemeProvider>
  </>)
}

export default App;
