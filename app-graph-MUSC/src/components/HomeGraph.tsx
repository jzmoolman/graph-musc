import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import  { Box,  Button,  Paper, Typography } from '@mui/material'
import { Graph } from './Graph';
import { defaultGraphScheme } from '../tools/graphtools';
import { useNavigate } from 'react-router-dom'
import { MuscHeader } from './MuscDecs';

type Dimension = {
    width: number
    height: number
}

export const HomeGraph = () => {
    const [activeGraph, setActiveGraph] = useState(0)

  const  { specialist } = useParams()
  console.log('specialist', specialist )

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
            {width: getWidth(3), height: 200},
            {width: getWidth(4), height: 200}
        ])
    },[])

    const handleResize = () => {
        console.log('onResize')
        setDim( ()=> ([
            {width: getWidth(1), height: 200},
            {width: getWidth(2), height: 200},
            {width: getWidth(3), height: 200},
            {width: getWidth(4), height: 200}
        ]))
    }

    const handleImageClick = () => {
        navigate('/')

    }

    const handleClickGeneric = () => {
        navigate('/generic')
    }

    const handleClickGI = () => {
        navigate('/gi')
    }

    const getWidth = (box: number) => {
        let number = Number(document.getElementById(`graph-box${box}`)?.offsetWidth )
        if ( typeof number === 'number' && number === number) {
            return number-12
        } else {
            return 200
        }
    }

    const getActiveDesciption = (graph: number) => {
        if (graph === 1)
           return 'Centric View'
        else if (graph === 2)
            return 'GI View'
        else return ''
    }
    
    const getActiveFontColor = (graph: number) => {
        if (graph in [1,2,3,4]) {
            return 'primary.main'
        } else {
            return 'white'
        }
    }

    const getHeaderDesc1_1 = () => {
        return 'Cancer Susceptibility Genes'
    }


    const getHeaderDesc1_2 = () => {
        return 'Visualizations using Graph Database Technology'
    }

    const getHeaderDesc2 = () => {
        return 'This website provides visualizations of cancer susceptibility genes and gene combinations'
    }

    const GraphButtons = () => {
        return  (<>

            <Box id='graph-box1' display='flex' flex={1}
                sx={{
                    minWidth: 400,
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
                    <Graph 
                        drawerOpen={false}
                        width={getWidth(2)}
                        height={300}
                        name={'gene-organ'}
                        specialist='Generic'
                        genes={['BRCA1', 'BRCA2']}
                        organs={[]}
                        syndromes={[]}
                        diseases={[]}
                        finalVerdict='Confirmed'
                        graphScheme={defaultGraphScheme}
                        enableZoom={false}
                        onClick={handleClickGeneric}
                    />
                    <Box 
                        color='black' 
                        textAlign='center'
                        paddingBottom={1}
                    >
                        <Typography                        
                            textAlign='center'
                            variant='h6' 
                            width='100%'
                            color='primary.main'
                        > 
                            <Button 
                                variant="outlined"
                                onClick={handleClickGeneric}
                            >
                                {getActiveDesciption(1)}
                            </Button>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
            <Box id='graph-box2' display='flex' flex={1}
                sx={{
                    minWidth: 400,
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
                    <Graph 
                        drawerOpen={false}
                        width={getWidth(2)}
                        height={300}
                        name={'gene-organ'}
                        specialist=''
                        genes={['BRCA1']}
                        organs={[]}
                        syndromes={[]}
                        diseases={[]}
                        finalVerdict='Confirmed'
                        graphScheme={defaultGraphScheme}
                        enableZoom={false}
                        onClick={handleClickGI}
                    />
                    <Box 
                        color='black' 
                        textAlign='center'
                        paddingBottom={1}
                    >
                        <Typography                        
                            textAlign='center'
                            variant='h6' 
                            width='100%'
                            color='primary.main'
                        > 
                            <Button 
                                variant="outlined"
                                onClick={handleClickGI}
                            >
                                {getActiveDesciption(2)}
                            </Button>
                        </Typography>
                    </Box>
                </Paper>
            </Box>


        </>)
    }

    return (<>

        <MuscHeader/>

        <Box id='heading2' display='flex'>
            <Typography 
                textAlign='center'
                variant='h3' 
                width='100%'
                color='primary.main'
            >
                <> 
                {getHeaderDesc1_1()}
                </>

            </Typography>
            <Typography 
                textAlign='center'
                variant='h4' 
                width='100%'
                color='primary.main'
            >
                <> 
                {getHeaderDesc1_2}
                </>

            </Typography>
        </Box>
        <Box display='flex' 
             flexWrap='wrap'
        >
            <GraphButtons/>
        </Box>
        <Box id='heading2' display='flex'>
            <Typography 
                textAlign='center'
                variant='h4' 
                width='100%'
                color='primary.main'
            >
                {getHeaderDesc2()}
            </Typography>
        </Box>
        <Box display='flex'>
            <Typography 
                textAlign='left'
                width='100%'
                paddingLeft={10}
                paddingRight={10}
                color='primary.main'
            >
                <p>
                  Pathogenic variants inherited at birth (Germline) in certain genes increase the risk of certain cancers.
                </p>
                <p>
                    Cancer susceptibility genes can be better understood using a framework of 
                    <ul>
                        <li>spectrum of diseases caused</li>
                        <li>penetrance for each disease</li>
                        <li>the predominant subtype of each disease</li>
                        <li>age of onset</li>
                    </ul>
                    When managing a patient with a pathogenic variant in a given gene, the spectrum of disease suggests which diseases to address in our management plan and suggests what family history might be indicative of this gene.  The penetrance suggests how aggressive to be in management.  The age of onset tells us when to institute management.
                    In the past, syndromes have been defined that often predated the understanding of the underlying gene.  Syndromes can be useful to help us remember certain family characteristics of certain genes. 
                </p>
            </Typography>
        </Box>
    </>)
}
