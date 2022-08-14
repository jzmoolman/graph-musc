import React, { useState, memo, useEffect } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import  { Box, Divider, useColorScheme, Paper, Drawer, Typography } from '@mui/material'
import { GeneDropdown } from './GeneDropdown';
import { OrganDropdown } from './OrganDropdown';
import { SyndromeDropdown } from './SyndromeDropdown';
import { DiseaseDropdown } from './DiseaseDropdown';
import { Configuration } from './Configuration';
import { GraphScheme, defaultGraphScheme, GraphName } from '../tools/graphtools';
import { BaseGraph } from './BaseGraph';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { CustomSelect } from './CustomSelect';
import { Filters } from './Filters';

const drawerWidth = 350;

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
        // marginRight: -drawerWidth,
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
    open: boolean
    onChange: (open: boolean) => void
}

type Dimension = {
    width: number
    height: number
}


export const Graph = ( { name, open , onChange} : GraphProps) => {
    console.log('enter - Graph')

    const [graphScheme, setGraphScheme] = useState(defaultGraphScheme)
    const [genes, setGenes] = useState<string[]>([])
    const [organs, setOrgans] = useState<string[]>([])
    const [diseases, setDiseases] = useState<string[]>([])
    const [syndromes, setSyndromes] = useState<string[]>([])
    const [finalVerdict, setFinalVerdict] = useState<string>('Confirmed')
    const [dim, setDim] = useState<Dimension>( {width:600, height:600})
    
    useEffect(()=>{
        console.log('Graph mounted')
        window.addEventListener("resize", handleResize )
        setDim( {width: getWidth(), height: getHeight()},
        )
    },[])

    const handleResize = () => {
        console.log('onResize')
        setDim( ()=> ( {width: getWidth(), height: getHeight()}))
    }

    const getWidth = () => {
        let number = Number(document.getElementById(`graph-box`)?.offsetWidth )
        console.log('getWidht', number)
        if ( typeof number === 'number' && number === number) {
            console.log('getWidth is a number', number)
            return number-12
        } else {
            console.log('getWidth NaN', number)
            return 400
        }
    }

    const getHeight = () => {
        let number = Number(document.getElementById(`graph-box`)?.offsetHeight )
        console.log('getHeight', number)
        if ( typeof number === 'number' && number === number) {
            console.log('getHeight is a number', number)
            return number-12
        } else {
            console.log('getHeight NaN', number)
            return 400
        }
    }

    const handleDrawerClose = () => {
        onChange(false)
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
        console.log('selected', selected)
        setSyndromes(selected)
    }

    const handleFinalVerdictChange = (selected: string) => {
        setFinalVerdict(selected)
    }

    const handleConfiguationChange = (graphScheme:GraphScheme) => {
        setGraphScheme(graphScheme)
    }

    if (name === 'gene' )  {
        if (organs.length !== 0 ) {
            setOrgans([])
        }
        if (syndromes.length !== 0 ) {
            setSyndromes([])
        }
        if (diseases.length !== 0 ) {
            setDiseases([])
        }
    } else if (name === 'organ' )  {
        if (genes.length !== 0 ) {
            setGenes([])
        }
        if (diseases.length !== 0 ) {
            setDiseases([])
        }
        if (syndromes.length !== 0 ) {
            setSyndromes([])
        }
    } else if (name === 'disease' )  {
        if (genes.length !== 0 ) {
            setGenes([])
        }
        if (organs.length !== 0 ) {
            setOrgans([])
        }
        if (syndromes.length !== 0 ) {
            setSyndromes([])
        }
    } else if (name === 'syndrome' )  {
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
            <DrawerHeader />
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
                    <BaseGraph 
                        drawerOpen={open}
                        width={getWidth()}
                        height={getHeight()}
                        name={name}
                        genes={genes}
                        organs={organs}
                        syndromes={syndromes}
                        diseases={diseases}
                        finalVerdict={finalVerdict}
                        graphScheme={graphScheme}
                        hover
                        enableZoom
                    />
                </Paper>
                <Filters 
                    name={name} 
                    genes={genes} 
                    organs={organs} 
                    diseases={diseases}
                    syndromes={syndromes}
                    finalVerdict={finalVerdict}
                    onGeneChange={handleGeneChange}
                    onOrganChange={handleOrganChange}
                    onDiseaseChange={handleDiseaseChange}
                    onSyndromeChange={handleSyndromeChange}
                    onFinalVerdictChange={handleFinalVerdictChange}
                />
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
        <Divider />
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