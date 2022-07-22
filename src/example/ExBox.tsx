import React from 'react'
import  { Box } from '@mui/material'



export const ExBox = () => {
    
    return (
        <>
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
                TEST
            </Box>
            <Box display='flex' height='100px' width='100px' bgcolor='success.light' p={2}></Box>
        </>
    )
}
