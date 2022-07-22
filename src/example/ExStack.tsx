import React from 'react'
import  { Box , Stack, Divider } from '@mui/material'



export const ExStack     = () => {
    
    return (

        <Stack typography='h6'
            sx={{border: '1px solid'}}
            direction='row'
            spacing={1}
            divider={<Divider orientation='vertical' flexItem/>}
        >
            <Box 
                sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    height: '200px',
                    width: '120px',
                    paddig: '16px',
                    '&:hover': {
                        backgroundColor: 'primary.light'
                    }
                }}
            >
                STACK
            </Box>
            <Box display='flex' height='100px' width='100px' bgcolor='success.light' p={2}></Box>
        </Stack>
    )
}
