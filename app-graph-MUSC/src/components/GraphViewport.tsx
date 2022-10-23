import React, { useState, useRef, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import  { Box, Divider, Paper, Drawer, Typography } from '@mui/material'
import { Configuration } from './Configuration';
import { GraphScheme, defaultGraphScheme, GraphName } from '../tools/graphtools';
import { Graph } from './Graph';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Filters } from './Filters';

const drawerWidth = 450; 

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })
    <{
        open?: boolean;
    }>(({ theme, open }) => ({
        id: 'main-zzz',
        display: 'flex',
        flex: 1,
        height: '100%',

        padding: theme.spacing(0),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: 0,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: 0
        })
    }));

const DrawerHeader = styled('div')(({ theme }) => ({
  id: 'drawerHeader-zzz',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

type GraphProps = {
    name: GraphName 
    specialist: string
    open: boolean
    onChange?: (open: boolean) => void
    onMouseOver?: () => void
    onMouseOut?: () => void

}

type Dimension = {
    width: number
    height: number
}

export const GraphViewport = ( { 
    name, 
    specialist, 
    open, 
    onChange,
    onMouseOver,
    onMouseOut
} : GraphProps) => {

    const [graphName, setGraphName] = useState<GraphName>(name)
    const refresh = useRef(true)
    if ( refresh.current) {
        refresh.current = true;
        if ( graphName !== name) {
           setGraphName(name)
        }
    }
    
    const [graphScheme, setGraphScheme] = useState(defaultGraphScheme)
    const [genes, setGenes] = useState<string[]>([])
    const [organs, setOrgans] = useState<string[]>([])
    const [diseases, setDiseases] = useState<string[]>([])
    const [syndromes, setSyndromes] = useState<string[]>([])
    const [finalVerdict, setFinalVerdict] = useState<string>('Confirmed')
    const [dim, setDim] = useState<Dimension>( {width:600, height:600})
    
    useEffect(()=>{
        window.addEventListener("resize", handleResize )
        setDim( {width: getWidth(), height: getHeight()},)
    },[])

    const handleResize = () => {
        setDim( ()=> ( {width: getWidth(), height: getHeight()}))
    }

    const getWidth = () => {
        let number = Number(document.getElementById(`graph-box`)?.offsetWidth )
        if ( typeof number === 'number' && number === number) {
            return number-12
        } else {
            return 400
        }
    }

    const getHeight = () => {
        let number = Number(document.getElementById(`graph-box`)?.offsetHeight )
        if ( typeof number === 'number' && number === number) {
            return number-12
        } else {
            return 400
        }
    }

    const handleDrawerClose = () => {
        if (onChange)
            onChange(false)
    }

    const handleGraphChange = (name: GraphName) => {
        refresh.current = false;
        setGraphName(() => { return name })
    }

    const handleGeneChange = (selected: string[]) => {
        setGenes(selected)
    }

    const handleOrganChange = (selected: string[]) => {
        setOrgans(selected)
    }

    const handleDiseaseChange = (selected: string[]) => {
        setDiseases(selected)
    }

    const handleSyndromeChange = (selected: string[]) => {
        setSyndromes(selected)
    }

    const handleFinalVerdictChange = (selected: string) => {
        setFinalVerdict(selected)
    }

    const handleConfiguationChange = (graphScheme:GraphScheme) => {
        setGraphScheme(graphScheme)
    }

    const handleMouseOver = () => {
        if (onMouseOver) 
            onMouseOver()
    }
    const handleMouseOut = () => {
        if (onMouseOut) 
            onMouseOut()
    }

    switch (name) { 
        case 'gene-organ':
        case 'gene-disease': 
        case 'gene-disease-subtype': {
            if (organs.length !== 0 ) {
                setOrgans([])
            }
            if (syndromes.length !== 0 ) {
                setSyndromes([])
            }
            if (diseases.length !== 0 ) {
                setDiseases([])
            }
            break
        }
        case 'organ': {
            if (genes.length !== 0 ) {
                setGenes([])
            }
            if (diseases.length !== 0 ) {
                setDiseases([])
            }
            if (syndromes.length !== 0 ) {
                setSyndromes([])
            }
            break
        } 
        case 'disease': {
            if (genes.length !== 0 ) {
                setGenes([])
            }
            if (organs.length !== 0 ) {
                setOrgans([])
            }
            if (syndromes.length !== 0 ) {
                setSyndromes([])
            }
            break
        }
        case  'syndrome-disease': {
            if (genes.length !== 0 ) {
                setGenes([])
            }
            if (organs.length !== 0 ) {
                setOrgans([])
            }
            if (diseases.length !== 0 ) {
                setDiseases([])
            }
            break
        }
        case 'syndrome-gene-disease': {
            if (genes.length !== 0 ) {
                setGenes([])
            }
            if (organs.length !== 0 ) {
                setOrgans([])
            }
            if (diseases.length !== 0 ) {
                setDiseases([])
            }
        } 
    }

    const DisplayPanel = () => {
        return (
            <Typography sx={{textAlign: 'center'}}>
                Configuration Tool
            </Typography>
        )
    }

    return (
        <>
            <Main open={open}>        
                <Paper 
                    id='graph-box'
                    elevation={4}         
                    sx={{ 
                        display: 'flex',
                        margin: '2px',
                        width:'100%',
                        height: '100%',
                        color: 'white',
                    }}
                >
                    <Graph 
                        drawerOpen={open}
                        width={getWidth()}
                        height={getHeight()}
                        name={graphName}
                        specialist={specialist}
                        genes={genes}
                        organs={organs}
                        syndromes={syndromes}
                        diseases={diseases}
                        finalVerdict={finalVerdict}
                        graphScheme={graphScheme}
                        enableHover
                        enableBack
                        enableZoom
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                    />
                </Paper>
                <Box>
                    <Filters 
                        name={graphName} 
                        specialist={specialist}
                        genes={genes} 
                        organs={organs} 
                        diseases={diseases}
                        syndromes={syndromes}
                        finalVerdict={finalVerdict}
                        graphScheme={graphScheme}
                        onGraphChange={handleGraphChange}
                        onGeneChange={handleGeneChange}
                        onOrganChange={handleOrganChange}
                        onDiseaseChange={handleDiseaseChange}
                        onSyndromeChange={handleSyndromeChange}
                        onFinalVerdictChange={handleFinalVerdictChange}
                    />
                    <Box>
                        test
                    </Box>
                </Box>
        </Main>
        <Drawer
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
            },
            }}
            variant="persistent"
            anchor="right"
            open={open}
        >
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftIcon />
                </IconButton>
            </DrawerHeader>
            {/* <Divider /> */}
            <Box 
                sx={{ width: drawerWidth, }}
                role='presentation'
            >
                <DisplayPanel />
                <Divider sx={{marginLeft:'8px', width:'95%'}} />
                <Configuration graphScheme={graphScheme} onChange={handleConfiguationChange} /> 
            </Box>
        </Drawer>
    </>
    )
}
