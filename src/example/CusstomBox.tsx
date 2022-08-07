import React from 'react'
import  { Box, Paper } from '@mui/material'



export const CustomBox = () => {
    
    return (
        <>
            <Box id='container' display='flex' flexWrap='wrap'>
                <Box display='flex' flex={1}
                    sx={{
                        minWidth: '200px',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        paddig: '16px',
                        '&:hover': {
                            backgroundColor: 'primary.light'
                        }
                    }}
                >
                    Box 1 - this on is longer ARRRRRR

                    {/* <Paper  
                        elevation={4}         
                        sx={{ 
                                // width: '100%',
                                backgroundColor: 'white',
                                margin: '2px',
                                padding:'2px'}}>
                        Paper 1 - This one is longer than the other two
                    </Paper> */}
                </Box>
                <Box display='flex' flex={1}

                    sx={{
                        minWidth: '200px',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        paddig: '16px',
                        '&:hover': {
                            backgroundColor: 'primary.light'
                        }
                    }}
                >
                    Box 2
                    {/* <Paper 
                        elevation={4}         
                        sx={{ 
                                // width: '100%',
                                backgroundColor: 'white',
                                margin: '2px',
                                padding:'2px'}}>
                        Paper 2
                    </Paper> */}
                </Box>
                <Box display='flex' flex={1}
                    sx={{
                        minWidth: '200px',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        paddig: '16px',
                        '&:hover': {
                            backgroundColor: 'primary.light'
                        }
                    }}
                >
                    Box 3
                    {/* <Paper 
                        elevation={4}         
                        sx={{ 
                                // width: '100%',
                                backgroundColor: 'white',
                                margin: '2px',
                                padding:'2px'}}>
                        Paper 3
                    </Paper> */}
                </Box>
            </Box>
        </>
    )
}
