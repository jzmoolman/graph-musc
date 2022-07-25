import React, { useState, memo } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import  { Box, Stack, Divider, useColorScheme, Paper, Drawer } from '@mui/material'
import { GeneDropdown } from './GeneDropdown';
import { OrganDropdown } from './OrganDropdown';
import { SyndromeDropdown } from './SyndromeDropdown';
import { Configuration } from './Configuration';
import { GraphScheme, defaultGraphScheme } from '../tools/graphtools';
import { BaseGraph } from './BaseGrpah';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const drawerWidth = 350;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(0),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

type GraphProps = {
    name: string
    open: boolean
    onChange: (open: boolean) => void
}

export const Graph = ( { name, open , onChange} : GraphProps) => {
    console.log('enter - Graph')

    const [graphName, setName] = useState(name)
    const [genes, setGenes] = useState<string[]>([])
    const [organs, setOrgans] = useState<string[]>([])
    const [syndromes, setSyndromes] = useState<string[]>([])
    const [graphScheme, setGraphScheme] = useState(defaultGraphScheme)

    const handleDrawerClose = () => {
        onChange(false)
    }

    const handleGeneChange = (selection: string[]) => {
        console.log('handleGeneChange', selection)
        setGenes(selection)
    }

    const handleOrganChange = (selection: string[]) => {
        console.log('handleOrganChange', selection)
        setOrgans(selection)
    }
    
    const handleSyndromeChange = (selection: string[]) => {
        console.log('handleOrganChange', selection)
        setSyndromes(selection)
    }

    const handleConfiguationChange = (graphScheme:GraphScheme) => {
        console.log('handlehandleConfiguationChange', graphScheme)
        setGraphScheme(graphScheme)
    }

    return (
        <>
        <Main open={open}>        
            <DrawerHeader />
                <Paper 
                    elevation={4}         
                    sx={{ 
                        display: 'flex',
                        // padding: '100',  
                        margin: '2px',
                        width:'100%',
                        height: '100%',
                        // flexGrow: 1,
                        color: 'white',
                        // '&:hover': {
                        // backgroundColor: 'secondary.light'
                        // }
                    }}
                >
                    <BaseGraph 
                       drawerOpen={open}
                        name={name}
                        verified={true}
                        genes={genes}
                        organs={organs}
                        syndromes={syndromes}
                        graphScheme={graphScheme}
                    />
                </Paper>
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
                {name === 'gene'?  <>
                    <GeneDropdown onChange={handleGeneChange} selected={genes}/>
                    <OrganDropdown onChange={handleOrganChange} selected={organs}/>

                    </>: <></>
                }
                {name === 'organ'?  <>
                    <OrganDropdown onChange={handleOrganChange} selected={organs}/>
                    <GeneDropdown onChange={handleGeneChange} selected={genes}/>
                    </>: <></>
                }
                {name === 'syndrome'?  <>
                    <SyndromeDropdown onChange={handleSyndromeChange} selected={syndromes}/>
                    <GeneDropdown onChange={handleGeneChange} selected={genes}/>
                    </>: <></>
                }
                <Divider sx={{marginLeft:'8px', width:'95%'}} />
                <Configuration graphScheme={graphScheme} onChange={handleConfiguationChange} /> 
            </Box>
        </Drawer>
    </>
    )
}
