import React, { useState, useContext } from 'react'
import {  BrowserRouter as Router, Routes,Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Graph } from './components/Graph'
import { CustomBox } from './example/CusstomBox'
import { ExStack } from './example/ExStack'
import { ExGrid } from './example/ExGrid'
import { Box, Paper, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import './App.css'
import { HomeGraph } from './components/HomeGraph'
import musc from './assets/musc.png'
import { HeaderGraph } from './components/HeaderGraph'

export const App = () => {  
  const [openDrawer, setOpenDrawer] = useState(false)
  // const navigate = useNavigate()

  const handleDrawerChange = (open: boolean) => {
    console.log('handleDrawerChange', open)
    setOpenDrawer(open)
  }

  // const MuscHeader = () => {
  //     return (<>

  //       <Paper 
  //           elevation={4}         
  //           sx={{ 
  //                   color: 'white',
  //                   width: '100%',
  //                   backgroundColor: 'white',
  //                   margin: '2px',
  //                   padding:'2px'}}
  //       >
  //           <Box id='heading1' display='flex' 
  //               sx={{
  //                   backgroundColor:'white',
  //                   color: 'black'}}
  //           >
  //               <Box display='flex' 
  //                   sx={{
  //                       backgroundColor:'white'}}>
  //                   <img src={musc} height={100} />
  //               </Box>
  //               <Box display='flex' flex='1' flexDirection='column'>
  //                   <Typography 
  //                       textAlign='right'
  //                       width='100%'
  //                       sx={{
  //                           fontFamily: 'Franklin Gothic Demi'
  //                       }} 
  //                       color='primary.main'
  //                   >
  //                       <Box>
  //                           Created by
  //                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  //                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  //                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  //                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  //                           &nbsp;&nbsp;&nbsp;&nbsp;
  //                       </Box>
  //                       <Box>
  //                           Zach Moolman
  //                       </Box>
  //                       <Box>
  //                           Armando Diaz 
  //                       </Box>
  //                       <Box>
  //                           Julie Henderson
  //                       </Box>
  //                       <Box>
  //                           Kiersten Meeder
  //                       </Box> 
  //                       <Box>
  //                           Kevin S. Hughes, MD, FACS
  //                       </Box> 
  //                   </Typography>
  //               </Box>
  //               <Box display='flex' flex='1' flexDirection='column'>
  //                   <Typography 
  //                       textAlign='right'
  //                       width='100%'
  //                       sx={{
  //                           fontFamily: 'Franklin Gothic Demi'
  //                       }} 
  //                       color='primary.main'
  //                   >
  //                       <Box>
  //                           Department of Surgery 
  //                       </Box>
  //                       <Box>
  //                           Division of Oncologic & Endocrine Surgery
  //                       </Box>
  //                       <Box>
  //                           Medical University of South Carolina
  //                       </Box>
  //                       <Box>
  //                           Graph database software courtesy of Neo4J
  //                       </Box>
  //                       <Box>
  //                           Supported in part by Invitae/Medneon
  //                       </Box>
  //                   </Typography>
  //               </Box>
  //           </Box>
  //       </Paper>
  //     </>)
  //}

  return (
      <Router>   
        {/* <Navbar open={openDrawer} onChange={handleDrawerChange}/> */}
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
  );
}

export default App;
