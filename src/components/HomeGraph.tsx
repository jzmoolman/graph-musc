import React, { useEffect, useRef, useState } from 'react'
import  { Box, Grid, Paper, Typography } from '@mui/material'
import { BaseGraph } from './BaseGraph';
import { defaultGraphScheme } from '../tools/graphtools';
import { useNavigate } from 'react-router-dom'


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
        <Box id='heading' display='flex'>
            <Typography display='flex' flex={1} textAlign='center' variant='h6' sx={{size:'large'}} color='primary.main'
            >
                Cancer susceptibility gene visualizations using a Graph Database approach
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
                        Gene Centric View
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
                        finalVerdict='Confimred'
                        graphScheme={defaultGraphScheme}
                        onClick={handleClickGene}
                    />
                    <Box color='black' textAlign='center'>
                        Choose a gene or gens to see what organs they affect and to see overlap of organs
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
                            padding:'2px'}}>
                    <Box color='black' textAlign='center'>
                        Organ Centric View
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
                        finalVerdict='Confimred'
                        graphScheme={defaultGraphScheme}
                        onClick={handleClickOrgan}
                    />
                    <Box color='black' textAlign='center'>
                        Choose an organ or organs to see what genes are related and how they ovelap
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
                            padding:'2px'}}>
                    <Box color='black' textAlign='center'>
                        Syndrome Centric View
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
                        finalVerdict='Confimred'
                        graphScheme={defaultGraphScheme}
                        onClick={handleClickSyndrome}
                    />
                    <Box color='black' textAlign='center'>
                        Choose syndromes to see their related organs or gene
                    </Box>
                </Paper>
            </Box>
        </Box>
    </>)
}
