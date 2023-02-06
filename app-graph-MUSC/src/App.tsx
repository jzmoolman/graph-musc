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
import { ForceGraph } from './experimental/ForceGraph'
import { gene_data } from './experimental/gene.data'

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
    setOpenDrawer(open)
  }


  const [data, setData] = useState<any>(null);
  
  const handleData = (data: any) => {
      console.log(data)
      setData(data)
  }

  useEffect(()=>{
      gene_data(handleData)
  },[])

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
              <Route path='/site/gene/:specialist' element={<Header name='gene-organ'  open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/site/organ/:specialist' element={<Header name='organ' open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/site/disease/:specialist' element={<Header name='disease' open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/site/syndrome/:specialist' element={<Header name='syndrome-disease'  open={openDrawer} onChange={handleDrawerChange} />} />
!
              <Route path='riskgraph' element= {data?<ForceGraph nodes={data.nodes} links={data.links}></ForceGraph>:<div></div>}/>
              {/* <Rpute path='riskgraph' element={<ForceGraph nodes={data.nodes} links={data.links}/>} */}
              {/* <Route path='/graph/gene' element={<Header name='gene-organ' site={'generic'} open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/graph/gene/gi' element={<Header name='gene-organ' site={'gi'} open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/graph/organ' element={<Header name='organ' site={'generic'} open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/graph/organ/gi' element={<Header name='organ' site={'gi'} open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/graph/disease' element={<Header name='disease'  site={'generic'} open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/graph/disease/gi' element={<Header name='disease'  site={'gi'} open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/graph/syndrome' element={<Header name='syndrome-disease'  site={'generic'} open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/graph/syndrome/gi' element={<Header name='syndrome-disease'  site={'gi'} open={openDrawer} onChange={handleDrawerChange} />} />
              <Route path='/custombox' element={<CustomBox />} />
              <Route path='/exstack' element={<ExStack />} />
              <Route path='/exgrid' element={<ExGrid />} /> */}
            </Routes>
          </Box>
      </Router>
    </ThemeProvider>
  </>)
}

export default App;
