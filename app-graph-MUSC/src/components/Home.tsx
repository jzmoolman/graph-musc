import React, { useContext, useEffect, useState } from 'react'
import { Neo4jContext } from 'use-neo4j'
import { Box,  Button,  Paper, Typography } from '@mui/material'
import { SiteName } from '../tools/graphtools';
import { useNavigate } from 'react-router-dom'
import musc from '../assets/musc.png'
import { loadSpecialistsByOrgan } from '../tools/graphdata';
import { MuscHeader } from './MuscDecs';


export const Home = () => {
    const [activeGraph, setActiveGraph] = useState(0)
    
    const context = useContext(Neo4jContext), driver = context.driver
    const [data, setData] = useState<string[]>([])
    const navigate = useNavigate()

    useEffect(()=>{
        loadSpecialistsByOrgan(driver, handleData)
    },[])

    const handleData = (data: string[]) => {
        setData(data)
    }
    
    const handleSpecialistClick = (specialist: string) => {
        navigate(`/site/${specialist}`)
    }

    const Specialists = () => {
        let array = data.map( (row,index) =>
            <> 
                <Button key={index} variant='outlined' onClick={ ()=>{ handleSpecialistClick(row)}}> {row} </Button> <span/>
            </> 
        )
        array.push(
            <> 
                <Button variant='outlined' onClick={ ()=>{ handleSpecialistClick('Generic')}}> Generic </Button> <span/>
            </>
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
        <Specialists/>
    </>)
}
