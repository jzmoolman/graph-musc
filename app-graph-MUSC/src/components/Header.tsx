
import React, { useEffect, useRef, useState } from 'react'
import  { Box,  Paper, Typography } from '@mui/material'
import { GraphViewport } from './GraphViewport';
import { GraphName } from '../tools/graphtools';
import { useNavigate, useParams } from 'react-router-dom'

import musc from '../assets/musc.png'
import { MuscHeader } from './MuscDecs';

type Dimension = {
    width: number
    height: number
}

type GraphProps = {
    name: GraphName 
    // open: boolean
    onChange?: (open: boolean) => void
    onMouseOver?: () => void
    onMouseOut?: () => void

}

export const Header = ({
    name, 
    // open, 
    onChange,
    onMouseOver,
    onMouseOut
} : GraphProps) => {

    const navigate = useNavigate()
    let { specialist } = useParams()

    // console.log('---->Debug: Header.tsx.Header specialist', specialist )
    // Check that specialist exists 
    if ( typeof specialist === undefined) {
        specialist = 'None'
    } else {
        specialist = specialist as string
    }

    const handleImageClick = () => {
        navigate('/')
    }

    return (<>
       <MuscHeader/>
       <GraphViewport name={name} specialist={specialist} onChange={onChange} />
    </>)
}
