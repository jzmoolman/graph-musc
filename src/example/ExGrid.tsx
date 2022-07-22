
import React from 'react'
import  { Box , Stack, Divider, Grid, Paper } from '@mui/material'



export const ExGrid     = () => {
    
    return (
        <Paper sx={{ padding:'32px' }} elevation={4}>
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
            <Grid container my={2} rowSpacing={2} columnSpacing={1}>
                <Grid item xs={12} sm={6}>
                    <Box bgcolor='primary.light' p={1}>
                        Item 1
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box bgcolor='primary.light' p={1}>
                       Item 2
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box bgcolor='primary.light' p={1}>
                        Item 3                    
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box bgcolor='primary.light' p={1}>
                       Item 4 
                    </Box>
                </Grid>

            </Grid>
        </Paper>
    )
}
