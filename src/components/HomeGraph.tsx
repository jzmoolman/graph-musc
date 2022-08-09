import React, { useEffect, useRef, useState } from 'react'
import  { Box, Grid, Paper, Typography } from '@mui/material'
import { BaseGraph } from './BaseGraph';
import { defaultGraphScheme } from '../tools/graphtools';
import { useNavigate } from 'react-router-dom'
import musc from '../assets/musc.png'
import { fontFamily } from '@mui/system';


type Dimension = {
    width: number
    height: number
}

export const HomeGraph = () => {
    console.log('enter - HomeGraph')


    const [dim, setDim] = useState<Dimension[]>([
        {width:200, height:200},
        {width:200, height:200},
        {width:200, height:200}
    ])

    const navigate = useNavigate()
    
    useEffect(()=>{
        console.log('HomeGraph mounted')
        window.addEventListener("resize", handleResize )
        setDim( [
            {width: getWidth(1), height: 200},
            {width: getWidth(2), height: 200},
            {width: getWidth(3), height: 200}
        ])
    },[])

    const handleResize = () => {
        console.log('onResize')
        setDim( ()=> ([
            {width: getWidth(1), height: 200},
            {width: getWidth(2), height: 200},
            {width: getWidth(3), height: 200}
        ]))
    }

    const handleClickGene = () => {
        navigate('/graph/gene')
    }

    const handleClickOrgan = () => {
        navigate('/graph/organ')
    }

    const handleClickSyndrome = () => {
        navigate('/graph/syndrome/organ')
    }

    const getWidth = (box: number) => {

        let number = Number(document.getElementById(`graph-box${box}`)?.offsetWidth )
        console.log('getWidht', number)
        if ( typeof number === 'number' && number === number) {
            console.log('getWidth is a number', number)
            return number-12
        } else {
            console.log('getWidth NaN', number)
            return 200
        }
    }


    return (<>
        <Box id='heading1' display='flex' 
             sx={{
                border: 'solid',
                backgroundColor:'white'}}>
            <img src={musc} />
        </Box>
        <Box id='heading2' display='flex'>
            <Typography 
                // display='flex' 
                // flex={1} 
                // textAlign='center', 
                textAlign='center'
                variant='h3' 
                width='100%'
                sx={{
                    fontFamily: 'Franklin Gothic Demi'
                }} 
                color='primary.main'
            >
                Cancer susceptibility gene visualizations using a Graph Database 
            </Typography>
        </Box>
        <Box display='flex' 
             flexWrap='wrap'
        >
            <Box id='graph-box1' display='flex' flex={1}
                sx={{
                    minWidth: 300,
                    // backgroundColor: 'primary.main',
                    color: 'white',
                    paddig: '16px',
                }}
                >

                <Paper 
                    elevation={4}         
                    sx={{
                            color: 'white',
                            backgroundColor: 'white',
                            margin: '2px',
                            padding:'2px'}}>
                    <Box color='black' textAlign='center'>
                        <Typography                        
                            textAlign='center'
                            variant='h5' 
                            width='100%'
                            sx={{
                                fontFamily: 'Franklin Gothic Demi'
                            }}
                        > 
                            Gene Centric View
                        </Typography>

                    </Box>
                    <BaseGraph
                        drawerOpen={false}
                        width={getWidth(1)}
                        height={300}
                        name={'gene'}
                        genes={['BRCA1','BRCA2']}
                        organs={[]}
                        syndromes={[]}
                        diseases={[]}
                        finalVerdict='Confirmed'
                        graphScheme={defaultGraphScheme}
                        enableZoom={false}
                        onClick={handleClickGene}
                    />
                    <Box color='black' textAlign='center'>
                        <Typography                        
                            textAlign='center'
                            variant='h6' 
                            width='100%'
                            sx={{
                                fontFamily: 'Franklin Gothic Demi'
                                }}
                        > 
                            Choose a gene or genes to see what organs they affect and to see overlap of organs
                        </Typography>
                    </Box>
                </Paper>
            </Box>
            <Box id='graph-box2' display='flex' flex={1}
                sx={{
                    minWidth: 400,
                    // backgroundColor: 'primary.main',
                    color: 'white',
                    paddig: '16px',
                }}
                >

                <Paper 
                    elevation={4}         
                    sx={{   
                            color: 'white',
                            width: '100%',
                            backgroundColor: 'white',
                            margin: '2px',
                            padding:'2px'}}
                >
                    <Box color='black' textAlign='center'>
                        <Typography                        
                            textAlign='center'
                            variant='h5' 
                            width='100%'
                            sx={{
                                fontFamily: 'Franklin Gothic Demi'
                            }}
                        > 
                           Organ Centric View
                        </Typography>
                    </Box>
                    <BaseGraph 
                        drawerOpen={false}
                        width={getWidth(2)}
                        height={300}
                        name={'organ'}
                        genes={['BRCA1','BRCA2']}
                        organs={[]}
                        syndromes={[]}
                        diseases={[]}
                        finalVerdict='Confirmed'
                        graphScheme={defaultGraphScheme}
                        enableZoom={false}
                        onClick={handleClickOrgan}
                    />
                    <Box color='black' textAlign='center'>
                        <Typography                        
                            textAlign='center'
                            variant='h6' 
                            width='100%'
                            sx={{
                                fontFamily: 'Franklin Gothic Demi'
                                }}
                        > 
                            Choose an organ or organs to see what genes are related and how they overlap
                        </Typography>
                    </Box>
                </Paper>
            </Box>
            <Box id='graph-box3' display='flex' flex={1}
                sx={{
                    minWidth: '300px',
                    // backgroundColor: 'primary.main',
                    color: 'white',
                    paddig: '16px',
                }}
                >

                <Paper 
                    elevation={4}         
                    sx={{ 
                            color: 'white',
                            width: '100%',
                            backgroundColor: 'white',
                            margin: '2px',
                            padding:'2px'}}
                >
                    <Box color='black' textAlign='center'>
                        <Typography                        
                            textAlign='center'
                            variant='h5' 
                            width='100%'
                            sx={{
                                fontFamily: 'Franklin Gothic Demi'
                            }}
                        > 
                            Syndrome Centric View
                        </Typography>                        
                    </Box>
                    <BaseGraph 
                        drawerOpen={false}
                        width={getWidth(3)}
                        height={300}
                        name={'syndrome-organ'}
                        genes={['BRCA1','BRCA2']}
                        organs={[]}
                        syndromes={['Lynch Syndrome']}
                        diseases={[]}
                        finalVerdict='Confirmed'
                        graphScheme={defaultGraphScheme}
                        enableZoom={false}
                        onClick={handleClickSyndrome}
                    />
                    <Box color='black' textAlign='center'>
                            <Typography                        
                                textAlign='center'
                                variant='h6' 
                                width='100%'
                                sx={{
                                    fontFamily: 'Franklin Gothic Demi'
                                    }}
                            > 
                                Choose syndromes to see their related organs or gene
                            </Typography>
                    </Box>
                </Paper>
            </Box>
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
                <Box display='flex' flex='1' flexDirection='column'>
                    <Box display='flex' >
                        Created by:
                    </Box>
                    <Box display='flex' >
                        Zach Moolman
                    </Box>
                    <Box display='flex' >
                        Armando Diaz 
                    </Box>
                    <Box>
                        Julie Henderson
                    </Box>
                    <Box display='flex' >
                        Kiersten Meeder
                    </Box> 
                    <Box display='flex' >
                        Kevin S. Hughes, MD, FACS
                    </Box> 
                </Box>
                <Box display='flex' flex='1' flexDirection='column'>
                    <Box display='flex'>
                        Department of Surgery 
                    </Box>
                    <Box display='flex'>
                        Division of Oncologic & Endocrine Surgery
                    </Box>
                    <Box display='flex'>
                        Medical University of South Carolina
                    </Box>
                    <Box display='flex'>
                        Graph database software courtesy of Neo4J
                    </Box>
                    <Box display='flex'>
                        Supported in part by Invitae
                    </Box>
                </Box>
            </Box>
        </Paper>
        </Box>
    </>)
}
