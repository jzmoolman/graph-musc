import React, { useState, useEffect } from 'react'
import {  BrowserRouter as Router, Routes, Route, useParams, useLocation } from 'react-router-dom'
import { CustomBox } from './example/CusstomBox'
import { ExStack } from './example/ExStack'
import { ExGrid } from './example/ExGrid'
import { Box, createTheme, ThemeProvider } from '@mui/material'
import { HomeGraph } from './components/HomeGraph'
import { Home } from './components/Home'
import { HomeGraphSite } from './components/HomeGraphSite'
import { Header } from './components/Header'

import './App.css'
  
const theme = createTheme({

  typography: { 
    fontFamily: 'Libre Franklin',
    allVariants: { fontWeight:  600} 

    
  }
})

export const App = () => {  
  const [openDrawer, setOpenDrawer] = useState(false)

  const handleDrawerChange = (open: boolean) => {
    console.log('handleDrawerChange', open)
    setOpenDrawer(open)
  }

  const { params } = useParams<{params?:string}>()
  console.log(params)

  return (<>
    <ThemeProvider theme={theme}>      
      <Router>
          <Box
              id='workspace'
              marginTop='10px'
              sx={{
                  splay: 'flex',
                  color: 'white',
                  height: 'calc(100vh - 145px)',
                  direction: 'column',
                  gap: '5px 5px',
                  
              }} 
          >
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/homegraph' element={<HomeGraph/>}/>
              <Route path='/site/:specialist' element={<HomeGraphSite/>}/>
              <Route path='/graph/gene' element={<Header name='gene-organ' site={'generic'} open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/graph/gene/gi' element={<Header name='gene-organ' site={'gi'} open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/graph/organ' element={<Header name='organ' site={'generic'} open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/graph/organ/gi' element={<Header name='organ' site={'gi'} open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/graph/disease' element={<Header name='disease'  site={'generic'} open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/graph/disease/gi' element={<Header name='disease'  site={'gi'} open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/graph/syndrome' element={<Header name='syndrome-disease'  site={'generic'} open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/graph/syndrome/gi' element={<Header name='syndrome-disease'  site={'gi'} open={openDrawer} onChange={handleDrawerChange} />} />
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
