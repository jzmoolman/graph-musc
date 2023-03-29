import React, { useState, useEffect, useContext } from 'react'
import {  BrowserRouter as Router, Routes, Route,  } from 'react-router-dom'
import { Box, createTheme, ThemeProvider } from '@mui/material'
import { HomeGraph } from './components/HomeGraph'
import { Home } from './components/Home'
import { HomeGraphSite } from './components/HomeGraphSite'
import { Header } from './components/Header'
import { GeneRiskGraph } from './experimental/GeneRiskGraph'
import { geneNodes, buildGeneGraph, buildGeneGraphV2 } from './experimental/gene.data'
import { GraphViewV2 } from './componentsv2/GraphViewV2' 
import { GeneRiskChart } from './experimental/GeneRiskChart'
import { GeneCardV2 } from './componentsv2/GeneCardv2'
import { DivTest } from './experimental/DivTest'
import { DivTest2 } from './experimental/divtest2'
import { Neo4jContext } from 'use-neo4j'
import { load_gene_organs } from './data/gene-organ.neo4j'

import './App.css'  

const theme = createTheme({
    typography: { 
        fontFamily: 'Libre Franklin',
  }
})

export const App = () => {  
    const context = useContext(Neo4jContext), driver = context.driver    


    const [data, setData] = useState<any>(null);
    const [data2, setData2] = useState<any>(null);
  
    const handleData = (data: any) => {
        setData(data)
    }

    const handleData2 = (data: any) => {
        setData2(data)
    }

    useEffect(()=> {
        geneNodes(handleData)
        load_gene_organs( driver, {onData: handleData2})
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
                        <Route path='/site/gene/:specialist' element={<Header name='gene-organ'/>} />
                        <Route path='/site/organ/:specialist' element={<Header name='organ'  />} />
                        <Route path='/site/disease/:specialist' element={<Header name='disease'/>} />
                        <Route path='/site/syndrome/:specialist' element={<Header name='syndrome-disease'/>} />

                        <Route path='graphview' element={<GraphViewV2/>}/>
                        <Route path='generiskgraph' element= {data2?<GeneRiskGraph nodes={buildGeneGraphV2(data2).nodes} links={buildGeneGraphV2(data2).links} gene='' gender='' debug={true}></GeneRiskGraph>:<div></div>}/>
                        <Route path='generiskchart' element= {data?<GeneRiskChart data={data} gene='' gender=''></GeneRiskChart>:<div></div>}/>
                        <Route path='genecardv2' element= {data?<GeneCardV2 data={data}></GeneCardV2>:<div></div>}/>
                        <Route path='divtest' element= {<DivTest></DivTest>}/>
                        <Route path='divtest2' element= {<DivTest2></DivTest2>}/>

                    </Routes>
                </Box>
            </Router>
        </ThemeProvider>
  </>)
}

export default App;


