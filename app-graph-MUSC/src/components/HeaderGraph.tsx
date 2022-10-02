
import React, { useEffect, useRef, useState } from 'react'
import  { Box,  Paper, Typography } from '@mui/material'
import { Graph } from './Graph';
import { defaultGraphScheme, GraphName, SiteName } from '../tools/graphtools';
import { useNavigate } from 'react-router-dom'

import musc from '../assets/musc.png'

type Dimension = {
    width: number
    height: number
}

type GraphProps = {
    name: GraphName 
    site: SiteName
    open: boolean
    onChange?: (open: boolean) => void
    onMouseOver?: () => void
    onMouseOut?: () => void

}

export const HeaderGraph = ({
    name, 
    site, 
    open , 
    onChange,
    onMouseOver,
    onMouseOut
} : GraphProps) => {
    console.log('enter - HeaderGraph')

    const MuscHeader = () => {
      return (<>

        <Paper 
            elevation={4}         
            sx={{ 
                    color: 'white',
                    width: '100%',
                    backgroundColor: 'white',
                    margin: '2px',
                    padding:'2px'}}
        >
            <Box id='heading1' display='flex' 
                sx={{
                    backgroundColor:'white',
                    color: 'black'}}
            >
                <Box display='flex' 
                    sx={{
                        backgroundColor:'white'}}>
                    <img src={musc} height={100}  onClick={handleImageClick}/>
                </Box>
                <Box display='flex' flex='1' flexDirection='column'>
                    <Typography 
                        textAlign='right'
                        width='100%'
                        color='primary.main'
                    >
                        <Box>
                            Created by
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;  
                            Zach Moolman
                        </Box>
                        <Box>
                            Armando Diaz 
                        </Box>
                        <Box>
                            Julie Henderson
                        </Box>
                        <Box>
                            Kiersten Meeder
                        </Box> 
                        <Box>
                            Kevin S. Hughes, MD, FACS
                        </Box> 
                    </Typography>
                </Box>
                <Box display='flex' flex='1' flexDirection='column'>
                    <Typography 
                        textAlign='right'
                        width='100%'
                        color='primary.main'
                    >
                        <Box>
                            Department of Surgery 
                        </Box>
                        <Box>
                            Division of Oncologic & Endocrine Surgery
                        </Box>
                        <Box>
                            Medical University of South Carolina
                        </Box>
                        <Box>
                            Graph database software courtesy of Neo4J
                        </Box>
                        <Box>
                            Supported in part by Invitae/Medneon
                        </Box>
                    </Typography>
                </Box>
            </Box>
        </Paper>
      </>)
  }

    const navigate = useNavigate()
    

    const handleImageClick = () => {
        navigate('/')

    }


    return (<>

       <MuscHeader/>
       <Graph name={name} site={site} open={open} onChange={onChange}/>
    </>)
}
