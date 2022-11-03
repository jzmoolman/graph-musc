import React, { useContext, useEffect, useState } from 'react'
import { Neo4jContext } from 'use-neo4j'
import { Box,  Button,  Paper, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import musc from '../assets/musc.png'
import { loadSpecialists } from '../tools/graphdata';
import { MuscHeader,MuscHeader2, MuscHeader3, MuscHeader4 } from './MuscDecs';


export const Home = () => {
    const [activeGraph, setActiveGraph] = useState(0)
    
    const context = useContext(Neo4jContext), driver = context.driver
    const [data, setData] = useState<string[]>([])
    const navigate = useNavigate()

    useEffect(()=>{
        loadSpecialists(driver, handleData)
    },[])

    const handleData = (data: string[]) => {
        setData(data)
    }
    
    const handleSpecialistClick = (specialist: string) => {
        navigate(`/site/${specialist}`)
    }

    const Specialists = () => {

        let array = data.map( (row,index) =>
            <React.Fragment key={index}>
               <Button sx={{margin:1 }} variant='outlined' onClick={ ()=>{ handleSpecialistClick(row)}}> {row} </Button> <span/>
            </React.Fragment> 
        )

        return (<>
            <Box display='flex' flex={1}
                sx={{
                    minWidth: '300px',
                    color: 'white',
                }}
            >
                <Paper 
                    elevation={4}         
                    sx={{ 
                            color: 'white',
                            width: '100%',
                            backgroundColor: 'white',
                            margin: '2px',
                            padding:'10px'}}
                >
                    {array}
                </Paper>

            </Box>
        </>)
    }

    return (<>
        <MuscHeader/>
        <MuscHeader2 specialist='Generic'/>
        <MuscHeader4 />
        <Box display='flex' flex={1}
            sx={{
                minWidth: '300px',
                color: 'white',
            }}
        >
            <Paper 
                elevation={4}         
                sx={{ 
                        color: 'white',
                        width: '100%',
                        backgroundColor: 'white',
                        margin: '2px',
                        padding:'10px'}}
            >
                <Button sx={{margin:1 }} variant='outlined' onClick={ ()=>{ handleSpecialistClick('Generic')}}>All Genes</Button> 
            </Paper>

        </Box>
        <MuscHeader3 />
        <Specialists/>
    </>)
}
