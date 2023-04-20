import React, { useState, useEffect, useContext } from 'react'
import {  BrowserRouter as Router, Routes, Route,  } from 'react-router-dom'
import { Box, createTheme, ThemeProvider } from '@mui/material'
// import { HomeGraph } from './components/HomeGraph'
import { Home } from './components/Home'
import { HomeGraphSite } from './components/HomeGraphSite'
import { Header } from './components/Header'
import { GeneRiskGraph } from './experimental/GeneRiskGraph'
import { geneNodes,  buildGeneGraphV2 } from './experimental/gene.data'
import { GraphViewV2 } from './componentsv2/GraphViewV2' 
import { GeneRiskChart } from './experimental/GeneRiskChart'
import { GeneCardV3 } from './componentsv2/GenecardV3'
import { DivTest } from './experimental/DivTest'
import { DivTest2 } from './experimental/divtest2'
import { Neo4jContext } from 'use-neo4j'
import { load_gene_affects_organ_old,load_gene_affects_risk_organ } from './data/neo4j/gene-affect-organ.neo4j'

import './App.css'  
import { NodeLegends } from './experimental/NodeLegends'
import { build_gene_affecs_risk_organ_graph } from './data/forcegraph/gene-organ.forcegraph'

const theme = createTheme({
    typography: { 
        fontFamily: 'Libre Franklin',
  }
})

export const App = () => {  
    const context = useContext(Neo4jContext), driver = context.driver    


    const [data, setData] = useState<any>(null);
    const [data2, setData2] = useState<any>(null);
    const [data3, setData3] = useState<any>(null);
  
    const handleData = (data: any) => {
        setData(data)
    }

    const handleData2 = (data: any) => {
        setData2(data)
    }

    const handleData3 = (data: any) => {
        setData3(data)
    }

    useEffect(()=> {
        geneNodes(handleData)
        load_gene_affects_organ_old( driver, {onData: handleData2})
        load_gene_affects_risk_organ( driver, {onData: handleData3})
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
                        <Route path='/site/:specialist' element={<HomeGraphSite/>}/>
                        <Route path='/site/gene/:specialist' element={<Header name='gene-organ'/>} />
                        <Route path='/site/organ/:specialist' element={<Header name='organ-gene'  />} />
                        <Route path='/site/disease/:specialist' element={<Header name='disease-gene'/>} />
                        <Route path='/site/syndrome/:specialist' element={<Header name='syndrome-disease'/>} />

                        <Route path='graphview' element={<GraphViewV2/>}/>
                        <Route path='generiskgraph' element= {data2?<GeneRiskGraph data={buildGeneGraphV2(data2)} gender='' debug={true}></GeneRiskGraph>:<div></div>}/>
                        <Route path='generiskchart' element= {data?<GeneRiskChart data={data} gene='' gender=''></GeneRiskChart>:<div></div>}/>
                        <Route path='nodelegends' element= {data3?<NodeLegends data={build_gene_affecs_risk_organ_graph(data3)}></NodeLegends>:<div></div>}/>

                        <Route 
                            path='genecard' 
                            element= {data?
                                <GeneCardV3 
                                    data={data} 
                                    visable={true} 
                                    gene={'BRCA1'} 
                                    gender={'male'}
                                />
                                :<div></div>}/>
                        <Route path='divtest' element= {<DivTest></DivTest>}/>
                        <Route path='divtest2' element= {<DivTest2></DivTest2>}/>

                    </Routes>
                </Box>
            </Router>
        </ThemeProvider>
  </>)
}

export default App;


