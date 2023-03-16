import React, { useState, useEffect } from 'react'
import {  BrowserRouter as Router, Routes, Route,  } from 'react-router-dom'
import { Box, createTheme, ThemeProvider } from '@mui/material'
import { HomeGraph } from './components/HomeGraph'
import { Home } from './components/Home'
import { HomeGraphSite } from './components/HomeGraphSite'
import { Header } from './components/Header'
import { GeneRiskGraph } from './experimental/GeneRiskGraph'
import { geneNodes, buildGeneGraph } from './experimental/gene.data'

import './App.css'
import { GraphViewV2 } from './componentsv2/GraphViewV2' 
import { GeneRiskChart } from './experimental/GeneRiskChart'
import { GeneCardV2 } from './componentsv2/GeneCardv2'
import { DivTest } from './experimental/DivTest'
import { DivTest2 } from './experimental/divtest2'
  
const theme = createTheme({
    typography: { 
        fontFamily: 'Libre Franklin',
  }
})

export const App = () => {  
  const [openDrawer, setOpenDrawer] = useState(false)

  const handleDrawerChange = (open: boolean) => {
    setOpenDrawer(open)
  }

const [data, setData] = useState<any>(null);
  
 const handleData = (data: any) => {
    setData(data)
  }

  useEffect(()=>{
    geneNodes(handleData)
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
              {/* <Route path='riskgraph' element= {data?<ForceGraph nodes={data.nodes} links={data.links}></ForceGraph>:<div></div>}/> */}




              <Route path='graphview' element={<GraphViewV2/>}/>
              <Route path='generiskgraph' element= {data?<GeneRiskGraph nodes={buildGeneGraph(data).nodes} links={buildGeneGraph(data).links} gene='' gender='' debug={true}></GeneRiskGraph>:<div></div>}/>
              {/* <Route path='generiskgraph' element= {data?<GeneRiskGraph nodes={[buildGeneGraph(data).nodes[0]]} links={[]} gene='' gender='' debug={true}></GeneRiskGraph>:<div></div>}/> */}
              <Route path='generiskchart' element= {data?<GeneRiskChart data={data} gene='' gender=''></GeneRiskChart>:<div></div>}/>
              <Route path='genecardv2' element= {data?<GeneCardV2 data={data}></GeneCardV2>:<div></div>}/>
              <Route path='divtest' element= {<DivTest></DivTest>}/>
              <Route path='divtest2' element= {<DivTest2></DivTest2>}/>




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
