import React from 'react'
import { useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { IconButton, Toolbar, Typography, Stack, Button, Menu, MenuItem, Box, Drawer } from "@mui/material"
import { Link } from 'react-router-dom';
import BiotechIcon from '@mui/icons-material/Biotech'
import MenuIcon from '@mui/icons-material/Menu'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

const drawerWidth = 350;


interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));


type NavbarProps  = {
    open: boolean
    onChange: (open: boolean) => void
}

export const Navbar = ( {open, onChange}: NavbarProps ) => {
    const [anchorSyndromeEl, setAchorSyndromeEl] = useState<null | HTMLElement>(null)
    const [anchorEl, setAchorEl] = useState<null | HTMLElement>(null)
    const openSyndrome  = Boolean(anchorSyndromeEl)
    const openUI = Boolean(anchorEl)

    const handleSyndromeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAchorSyndromeEl(event.currentTarget)
    }
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAchorEl(event.currentTarget)
    }

    const handleSyndromeClose = () => {
        setAchorSyndromeEl(null)
    }
    const handleClose = () => {
        setAchorEl(null)
    }

    const handleDrawerOpen = () => {
        onChange(true)
    }

    return (
        <Box sx={{ display: 'flex'}}>
            <AppBar position='fixed' open={open}>  
                <Toolbar>
                    <IconButton size='large' edge='start' color='inherit' aria-label='logo'>
                        <BiotechIcon/>
                    </IconButton>
                    <Typography noWrap variant='h6' component='div' sx={{flexGrow: 1}}>
                        GENE-Works
                    </Typography>
                    <Stack direction='row' spacing={2}>
                        <Button 
                            color='inherit'
                            component={Link} 
                            to='/graph/gene'
                        >Gene</Button>
                        <Button 
                            component={Link} 
                            to='/graph/organ'
                            color='inherit'
                        >
                            Organ
                        </Button>
                        <Button 
                            component={Link} 
                            to='/graph/disease'
                            color='inherit'
                        >
                            Disease
                        </Button>
                        <Button 
                            id='ui-syndrome-button'
                            color='inherit'
                            onClick={handleSyndromeClick}
                            aria-controls={openSyndrome ? 'syndrome-menu': undefined}
                            aria-haspopup='true'
                            aria-expanded={openSyndrome ? 'true' : undefined}
                            endIcon={<KeyboardArrowDownIcon/>}
                        >Syndrome</Button>
                        <Button 
                            id='ui-button'
                            color='inherit'
                            onClick={handleClick}
                            aria-controls={openUI ? 'ui-menu': undefined}
                            aria-haspopup='true'
                            aria-expanded={openUI ? 'true' : undefined}
                            endIcon={<KeyboardArrowDownIcon/>}
                        >UI</Button>
                    </Stack>
                    <Menu id='ui-syndrome-menu' 
                        anchorEl={anchorSyndromeEl}
                        open={openSyndrome}
                        MenuListProps={{
                            'aria-labelledby': 'ui-syndrome-button'
                        }}
                        onClose={handleSyndromeClose}
                        anchorOrigin={{
                            vertical:'bottom',
                            horizontal:'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'

                        }}
                    >
                        <MenuItem 
                            component={Link} 
                            to='/graph/syndrome/gene' 
                            onClick={handleSyndromeClose} 
                        >Gene</MenuItem>
                        <MenuItem component={Link} 
                            to='/graph/syndrome/organ'
                            onClick={handleSyndromeClose}
                        >Organ</MenuItem>
                        <MenuItem component={Link} 
                            to='/graph/syndrome/gene-organ'
                            onClick={handleSyndromeClose}
                        >Gene-Organ</MenuItem>
                    </Menu>
                    <Menu id='ui-menu' 
                        anchorEl={anchorEl}
                        open={openUI}
                        MenuListProps={{
                            'aria-labelledby': 'ui-button'
                        }}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical:'bottom',
                            horizontal:'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'

                        }}
                    >
                        <MenuItem 
                            component={Link} 
                            to='/exbox' 
                            onClick={handleClose} 
                        >Box</MenuItem>
                        <MenuItem 
                            component={Link} 
                            to='/exstack'
                            onClick={handleClose}
                        >Stack</MenuItem>
                        <MenuItem 
                            component={Link} 
                            to='/exgrid'
                            onClick={handleClose}
                        >Grid</MenuItem>
                    </Menu>
                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        edge='end'
                        onClick={handleDrawerOpen}
                        sx={{ ...(open && {display:'none'}) }}
                    >
                        <MenuIcon/>
                    </IconButton>
                        
                </Toolbar>
            </AppBar>
        </Box>
    )
}