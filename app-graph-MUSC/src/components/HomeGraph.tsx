import React, { useEffect, useRef, useState } from 'react'
import  { Box,  Button,  Paper, Typography } from '@mui/material'
import { BaseGraph } from './BaseGraph';
import { defaultGraphScheme, SiteName } from '../tools/graphtools';
import { useNavigate } from 'react-router-dom'

import musc from '../assets/musc.png'

type Dimension = {
    width: number
    height: number
}

type HomeGraphProp =  {
   site: SiteName
}

export const HomeGraph = ({site}: HomeGraphProp) => {
    console.log('enter - HomeGraph')
    const [activeGraph, setActiveGraph] = useState(0)

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
                    <img src={musc} height={100} />
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

    const handleClickGene = () => {
        switch ( site ) {
            case 'generic': { navigate('/graph/gene'); break; }
            case 'gi': { navigate('/graph/gene/gi'); break; }
        }
    }

    const handleClickOrgan = () => {
        switch ( site ) {
            case 'generic': { navigate('/graph/organ'); break; }
            case 'gi': { navigate('/graph/organ/gi'); break; }
        }
    }
    
    const handleClickDisease = () => {
        navigate('/graph/disease')
    }

    const handleClickSyndrome = () => {
        navigate('/graph/syndrome')
    }

    const handleGeneMouseOver = ()=> {
        setActiveGraph(1)
    }

    const handleGeneMouseOut = ()=> {
        setActiveGraph(0)
    }

    const handleOrganMouseOver = ()=> {
        setActiveGraph(2)
    }

    const handleOrganMouseOut = ()=> {
        setActiveGraph(0)
    }

    const handleDiseaseMouseOver = ()=> {
        setActiveGraph(3)
    }

    const handleDiseaseMouseOut = ()=> {
        setActiveGraph(0)
    }

    const handleSyndromeMouseOver = ()=> {
        setActiveGraph(4)
    }

    const handleSyndromeMouseOut = ()=> {
        setActiveGraph(0)
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

    const getHeaderDesc1 = (name : SiteName) => {
        switch (name) {
            case 'gi': return 'GI Cancer susceptibility gene visualizations using a Graph Database'
            default : return 'Cancer susceptibility gene visualizations using a Graph Database'
        }
    }

    const getHeaderDesc2 = (name : SiteName) => {
        switch (name) {
            case 'gi': return 'This website provides visualizations of cancer susceptibility genes and gene combinations for gastroenterologist'
            default : return 'This website provides visualizations of cancer susceptibility genes and gene combinations'
        }
    }

    const GraphButtons = ({site}: HomeGraphProp) => {
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

    return (<>

    <MuscHeader/>

        <Box id='heading2' display='flex'>
            <Typography 
                textAlign='center'
                variant='h3' 
                width='100%'
                color='primary.main'
            >
                {getHeaderDesc1(site)}
            </Typography>
        </Box>
        <Box display='flex' 
             flexWrap='wrap'
        >
            <Box id='graph-box1' display='flex' flex={1}
                sx={{
                    minWidth: 300,
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
                    <BaseGraph
                        drawerOpen={false}
                        width={getWidth(1)}
                        height={300}
                        site={site}
                        name={'gene-organ'}
                        genes={['BRCA1','BRCA2']}
                        organs={[]}
                        syndromes={[]}
                        diseases={[]}
                        finalVerdict='Confirmed'
                        graphScheme={defaultGraphScheme}
                        enableZoom={false}
                        onClick={handleClickGene}
                    />
                    <Box
                        color='black' 
                        textAlign='center'
                        paddingBottom={1}
                    >
                        <Typography                        
                            textAlign='center'
                            variant='h6' 
                            // width='100%'
                            color={activeGraph===1?'primary.main':'white'}
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
                    <BaseGraph 
                        drawerOpen={false}
                        width={getWidth(2)}
                        height={300}
                        site={site}
                        name={'organ'}
                        genes={[]}
                        organs={['Ovary','Breast']}
                        syndromes={[]}
                        diseases={[]}
                        finalVerdict='Confirmed'
                        graphScheme={defaultGraphScheme}
                        enableZoom={false}
                        onClick={handleClickOrgan}
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
                    <BaseGraph 
                        drawerOpen={false}
                        width={getWidth(3)}
                        height={300}
                        site={site}
                        name='syndrome-disease'
                        genes={[]}
                        organs={[]}
                        syndromes={['Lynch Syndrome']}
                        diseases={[]}
                        finalVerdict='Confirmed'
                        graphScheme={defaultGraphScheme}
                        enableZoom={false}
                        onClick={handleClickSyndrome}
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
                    <BaseGraph 
                        drawerOpen={false}
                        width={getWidth(4)}
                        height={300}
                        site={site}
                        name={'disease'}
                        genes={[]}
                        organs={[]}
                        syndromes={[]}
                        diseases={['Breast Cancer']}
                        finalVerdict='Confirmed'
                        graphScheme={defaultGraphScheme}
                        enableZoom={false}
                        onClick={handleClickDisease}
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
                                    onClick={handleClickDisease}
                                >
                                    {getActiveDesciption(3)}
                                </Button>
                            </Typography>
                    </Box>
                </Paper>
            </Box>
            <GraphButtons site={site}/>
        </Box>
        <Box id='heading2' display='flex'>
            <Typography 
                textAlign='center'
                variant='h3' 
                width='100%'
                color='primary.main'
            >
                {getHeaderDesc2(site)}
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
