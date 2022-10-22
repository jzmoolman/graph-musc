import React, { useContext, useEffect, useState } from 'react'
import { renderToStaticMarkup } from "react-dom/server"
import { useParams } from 'react-router-dom'
import  { Box,  Button,  Paper, Typography } from '@mui/material'
import { Graph } from './Graph';
import { defaultGraphScheme, SiteName } from '../tools/graphtools';
import { useNavigate } from 'react-router-dom'

import { MuscFooter, MuscHeader, MuscHeader2, MuscHeader3, MuscLoading, MuscSpecialistNotFound } from './MuscDecs';
import { Neo4jContext } from 'use-neo4j';
import { loadSpecialists } from '../tools/graphdata';

type Dimension = {
    width: number
    height: number
}

export const HomeGraphSite = () => {
    const site = 'generic' as SiteName

    const navigate = useNavigate()
    const context = useContext(Neo4jContext), driver = context.driver
    const [data, setData] = useState<string[]>([])
    let { specialist } = useParams()

    console.log('specialist', specialist )
    if ( typeof specialist === undefined) {
        specialist = 'Generic'
    } else {
        specialist = specialist as string
    }


    useEffect(()=> {
        loadSpecialists(driver,  handleData )
    }, [])

    const handleData = (data: string[]) => {
        setData(data)
    }

    const handleClickGene = () => {
        navigate(`/site/gene/${specialist}`)
    }

    const handleClickOrgan = () => {
        navigate(`/site/organ/${specialist}`)
    }
    
    const handleClickDisease = () => {
        switch ( site ) {
            case 'generic': { navigate('/graph/disease'); break; }
            case 'gi': { navigate('/graph/disease/gi'); break; }
        }
    }

    const handleClickSyndrome = () => {
        switch ( site ) {
            case 'generic': { navigate('/graph/syndrome'); break; }
            case 'gi': { navigate('/graph/syndrome/gi'); break; }
        }
    }

    const getWidth = (id: number) => {
        let width = 400;
        let cnt = Math.floor(Number(document.getElementById(`workspace`)?.offsetWidth) / 400)
        width = Math.floor(Number(document.getElementById(`workspace`)?.offsetWidth) / cnt)
        if ( cnt === 0 || cnt === 1 ) {
            if ( width < 400) {
                    width = 400
            } 
        } else if (cnt == 3 && id == 4) {
            width = width *3 
        }
        console.log('width',id, width)
        return width
    }

    const getActiveDesciption = (graph: number) => {
        if (graph === 1)
           return 'Gene Centric View'
        else if (graph === 2)
            return 'Organ Centric View'
        else if (graph === 3)
            return 'Disease Centric View'
        else if (graph === 4)
            return 'Syndrome Centric View'
        else return ''
    }
    
    const getActiveFontColor = (graph: number) => {
        if (graph in [1,2,3,4]) {
            return 'primary.main'
        } else {
            return 'white'
        }
    }

    const GraphButtons = () => {
        switch (site) {
            case 'gi': return (<>
            <Box id='graph-box5' display='flex' flex={1}
                sx={{
                    minWidth: '300px',
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
                    <Box height={150}>

                    </Box>
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
                                    onClick={handleClickDisease}
                                >
                                    Eligibility for cancer genetic testing
                                </Button>
                            </Typography>
                    </Box>
                </Paper>

            </Box>
        </>)
        default: return (<></>)
        }
    }

    if ( data.length === 0) {
        return (<>
            <MuscHeader/>
            <MuscHeader2 specialist='Generic'/>
            <MuscLoading/>
        </>)

    } else if (data.filter( e => e === specialist).length === 0 && specialist !== 'Generic' ) {
        return (<>
            <MuscHeader/>
            <MuscSpecialistNotFound specialist={specialist}/>
        </>)

    } else {
    
        return (<>

        <MuscHeader/>
        <MuscHeader2 specialist={specialist}/>
        <Box 
            display='flex' 
            flexWrap='wrap'
            id='graph-box0'

        >
            <Box id='graph-box1' display='flex' flex={1}
                sx={{
                    width: 400,
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
                        padding:'2px'
                        
                    }}>

                    {data.length!==0?

                    <Graph
                        drawerOpen={false}
                        width={getWidth(0)-16}
                        height={300}
                        name={'gene-organ'}
                        specialist={specialist}
                        genes={['BRCA1','BRCA2']}
                        organs={[]}
                        syndromes={[]}
                        diseases={[]}
                        finalVerdict='Confirmed'
                        graphScheme={defaultGraphScheme}
                        enableZoom={false}
                        onClick={handleClickGene}
                    />
                    :<Box width={getWidth(1)-16}></Box>}
                    <Box
                        color='black' 
                        textAlign='center'
                        paddingBottom={1}
                    >
                        <Typography                        
                            textAlign='center'
                            variant='h6' 
                            color='primary.main'
                            sx= {{
                                color: getActiveFontColor(1),
                            }}
                        >
                            <Button 
                                variant="outlined"
                                onClick={handleClickGene}
                            >
                                {getActiveDesciption(1)}
                            </Button> 
                           
                        </Typography>
                    </Box>
                </Paper>
            </Box>

            <Box id='graph-box2' display='flex' flex={1}
                sx={{
                    // minWidth: 300,
                    width: 400,
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
                    {data.length!==0?
                    <Graph 
                        drawerOpen={false}
                        width={getWidth(2)-16}
                        height={300}
                        name={'organ'}
                        specialist={specialist}
                        genes={[]}
                        organs={['Ovary','Breast']}
                        syndromes={[]}
                        diseases={[]}
                        finalVerdict='Confirmed'
                        graphScheme={defaultGraphScheme}
                        enableZoom={false}
                        onClick={handleClickOrgan}
                    />:<Box width={getWidth(2)}></Box>}
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
                                onClick={handleClickOrgan}
                            >
                                {getActiveDesciption(2)}
                            </Button>
                        </Typography>
                    </Box>
                </Paper>
            </Box>

            <Box id='graph-box3' display='flex' flex={1}
                sx={{
                    // minWidth: '300px',
                    width: 400,
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
                    {data.length!==0?
                    <Graph 
                        drawerOpen={false}
                        width={getWidth(3)-16}
                        height={300}
                        name='syndrome-disease'
                        specialist={specialist}
                        genes={[]}
                        organs={[]}
                        syndromes={['Lynch Syndrome']}
                        diseases={[]}
                        finalVerdict='Confirmed'
                        graphScheme={defaultGraphScheme}
                        enableZoom={false}
                        onClick={handleClickSyndrome}
                    />:<Box width={getWidth(3) -16}></Box>}
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
                                onClick={handleClickSyndrome}
                            >
                                {getActiveDesciption(4)}
                            </Button>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
            <Box id='graph-box4' display='flex' flex={1}
                sx={{
                    // minWidth: '300px',
                    width: 400,
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
                    {data.length!==0?
                    <Graph 
                        drawerOpen={false}
                        width={getWidth(4)-16}
                        height={300}
                        name={'disease'}
                        specialist={specialist}
                        genes={[]}
                        organs={[]}
                        syndromes={[]}
                        diseases={['Breast Cancer']}
                        finalVerdict='Confirmed'
                        graphScheme={defaultGraphScheme}
                        enableZoom={false}
                        onClick={handleClickDisease}
                    />:<Box width={getWidth(4)-16}></Box>}
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
                                    onClick={handleClickDisease}
                                >
                                    {getActiveDesciption(3)}
                                </Button>
                            </Typography>
                    </Box>
                </Paper>
            </Box>
            <GraphButtons/>
        </Box>
        <MuscFooter/>
    </>)
    }
}