import React from 'react'
import { useRef } from 'react'
import  { Box , Grid, Button, TextField } from '@mui/material'
import  { FormGroup, FormControlLabel, Switch } from '@mui/material'
import { ColorSelect } from './ColorSelect'
import { defaultGraphScheme, GraphScheme } from '../tools/graphtools'


type ConfigurationProps = {
    graphScheme: GraphScheme
    onChange? : (graphScheme: GraphScheme) => void
}

export const Configuration = ( { graphScheme, onChange }: ConfigurationProps ) => {
    const geneNodeRef: React.Ref<any> = useRef()
    const geneFontRef: React.Ref<any>  = useRef()
    const organNodeRef: React.Ref<any> = useRef()
    const organFontRef: React.Ref<any> = useRef()
    const diseaseNodeRef: React.Ref<any> = useRef()
    const diseaseFontRef: React.Ref<any> = useRef()
    const syndromeNodeRef: React.Ref<any> = useRef()
    const syndromeFontRef: React.Ref<any> = useRef()
    const nodeValRef = useRef<HTMLInputElement>(null)
    const nodeRelSizeRef = useRef<HTMLInputElement>(null)
    const scaleFontRef = useRef<HTMLInputElement>(null)
    const fitViewPortRef = useRef<HTMLButtonElement>(null)

    const handleApplyClick = () => {
        console.log('Apply Click')
        console.log(geneNodeRef.current.value)
        const _graphScheme : GraphScheme = {
            geneNode:  geneNodeRef.current.value,
            geneFont: geneFontRef.current.value,
            organNode: organNodeRef.current.value,
            organFont: organFontRef.current.value,
            diseaseNode: diseaseNodeRef.current.value,
            diseaseFont: diseaseFontRef.current.value,
            syndromeNode: defaultGraphScheme.syndromeNode,
            syndromeFont: defaultGraphScheme.syndromeFont,
            nodeVal: nodeValRef.current ? +nodeValRef.current.value: defaultGraphScheme.nodeVal,
            nodeRelSize: nodeRelSizeRef.current ? +nodeRelSizeRef.current.value: defaultGraphScheme.nodeRelSize,
            scaleFont: scaleFontRef.current ? +scaleFontRef.current.value : defaultGraphScheme.scaleFont,
            fitViewPort: false
        }

        if (onChange) { onChange(_graphScheme) }
    }
    
    return (
        <Box >
        <Grid sx={{ m:0.5, width:'95%'}} container rowSpacing={1} columnSpacing={0.5}>
            <Grid item xs={12}   >
                <Box color='primary.main' >
                    Gene
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box  >
                    <ColorSelect inputRef={geneNodeRef} label='Node' select={graphScheme.geneNode}/>
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box  >
                    <ColorSelect inputRef={geneFontRef} label='Font' select={graphScheme.geneFont}/>
                </Box>
            </Grid>
            <Grid item xs={12} >
                <Box color='primary.main' >
                    Organ 
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box  >
                    <ColorSelect inputRef={organNodeRef} label='Node' select={graphScheme.organNode}/>
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box  >
                    <ColorSelect inputRef={organFontRef} label='Font' select={graphScheme.organFont}/>
                </Box>
            </Grid>

            <Grid item xs={12} >
                <Box color='primary.main' >
                    Disease 
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box  >
                    <ColorSelect inputRef={diseaseNodeRef} label='Node' select={graphScheme.diseaseNode}/>
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box  >
                    <ColorSelect inputRef={diseaseFontRef} label='Font' select={graphScheme.diseaseFont}/>
                </Box>
            </Grid>

            <Grid item xs={12} >
                <Box color='primary.main' >
                    Syndrome 
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box  >
                    <ColorSelect inputRef={syndromeNodeRef} label='Node' select={graphScheme.syndromeNode}/>
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box  >
                    <ColorSelect inputRef={syndromeFontRef} label='Font' select={graphScheme.syndromeFont}/>
                </Box>
            </Grid>
            <Grid item xs={12} >
                <Box color='primary.main' >
                    Nodes & Edges
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box  >
                    <TextField inputRef={nodeValRef} label='nodeVal' variant='standard' type='number' defaultValue={graphScheme.nodeVal} />
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box>
                    <TextField inputRef={nodeRelSizeRef}  label='nodeRelSize' variant='standard' type='number' defaultValue={graphScheme.nodeRelSize}/>
                </Box>
            </Grid>
            <Grid item xs={6} >
            </Grid>
            <Grid item xs={6} >
                <Box>
                    <TextField inputRef={scaleFontRef}  label='Scale Font' variant='standard' type='number' defaultValue={graphScheme.scaleFont}/>
                </Box>
            </Grid>
            <Grid item xs={12} >
                <Box color='primary.main' >
                    Viewport
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box >
                    <FormGroup>
                        {graphScheme.fitViewPort? 
                            <FormControlLabel 
                                control={<Switch 
                                    ref={fitViewPortRef} 
                                    defaultChecked/>}
                                label='Fit'
                            />:
                            <FormControlLabel 
                                ref={fitViewPortRef}
                                control={<Switch/>}
                                label='Fit'
                            />
                            
                        }
                    </FormGroup>

                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box>
                </Box>
            </Grid>
            <Grid item xs={4} >
                <Box>
                </Box>
            </Grid>
            <Grid item xs={4} >
                <Box >
                    <Button variant='outlined'>Reset</Button>  
                </Box>
            </Grid>
            <Grid item xs={4} >
                <Box>
                    <Button 
                        variant='outlined'
                        onClick={handleApplyClick}
                     >Apply</Button>  
                </Box>
            </Grid>
        </Grid>
    </Box>
    )
}
