import React from 'react'
import { useRef } from 'react'
import  { Box , Grid, Button, TextField } from '@mui/material'
import  { FormGroup, FormControlLabel, Switch } from '@mui/material'
import { ColorSelect } from './ColorSelect'
import { ForceGraphScheme, defaultForceGraphScheme } from '../tools/graphtools'
import { defaultGraphSchemeV2 } from '../data/forcegraph/types.forcegraph'


type ConfigurationProps = {
    graphScheme: ForceGraphScheme
    onChange? : (graphScheme: ForceGraphScheme) => void
}

export const Configuration = ( { graphScheme, onChange }: ConfigurationProps ) => {
    const geneNodeRef: React.Ref<any> = useRef()
    const geneFontRef: React.Ref<any>  = useRef()
    const organNodeRef: React.Ref<any> = useRef()
    const organFontRef: React.Ref<any> = useRef()
    const diseaseNodeRef: React.Ref<any> = useRef()
    const diseaseFontRef: React.Ref<any> = useRef()
    const diseaseSubtypeNodeRef: React.Ref<any> = useRef()
    const diseaseSubtypeFontRef: React.Ref<any> = useRef()
    const syndromeNodeRef: React.Ref<any> = useRef()
    const syndromeFontRef: React.Ref<any> = useRef()
    const nodeValRef = useRef<HTMLInputElement>(null)
    const nodeRelSizeRef = useRef<HTMLInputElement>(null)
    const scaleFontRef = useRef<HTMLInputElement>(null)
    const fitViewPortRef = useRef<HTMLButtonElement>(null)

    const handleApplyClick = () => {
        console.log('Apply Click')
        console.log(geneNodeRef.current.value)
        const _graphScheme : ForceGraphScheme = {
            // geneNode:  geneNodeRef.current.value,
            // geneFont: geneFontRef.current.value,
            // organNode: organNodeRef.current.value,
            // organFont: organFontRef.current.value,
            // diseaseNode: diseaseNodeRef.current.value,
            // diseaseFont: diseaseFontRef.current.value,            
            // diseaseSubtypeNode: diseaseSubtypeNodeRef.current.value,
            // diseaseSubtypeFont: diseaseSubtypeFontRef.current.value,
            // syndromeNode: defaultGraphScheme.syndromeNode,
            // syndromeFont: defaultGraphScheme.syndromeFont,
            nodeVal: nodeValRef.current ? +nodeValRef.current.value: defaultForceGraphScheme.nodeVal,
            nodeRelSize: nodeRelSizeRef.current ? +nodeRelSizeRef.current.value: defaultForceGraphScheme.nodeRelSize,
            nodeSize: scaleFontRef.current ? +scaleFontRef.current.value : defaultForceGraphScheme.nodeSize,
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
                    <ColorSelect inputRef={geneNodeRef} label='Node' select={defaultGraphSchemeV2.gene_fill}/>
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box  >
                    <ColorSelect inputRef={geneFontRef} label='Font' select={defaultGraphSchemeV2.gene_stroke}/>
                </Box>
            </Grid>
            <Grid item xs={12} >
                <Box color='primary.main' >
                    Organ 
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box  >
                    <ColorSelect inputRef={organNodeRef} label='Node' select={defaultGraphSchemeV2.organ_fill}/>
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box  >
                    <ColorSelect inputRef={organFontRef} label='Font' select={defaultGraphSchemeV2.organ_stroke}/>
                </Box>
            </Grid>

            <Grid item xs={12} >
                <Box color='primary.main' >
                    Disease 
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box  >
                    <ColorSelect inputRef={diseaseNodeRef} label='Node' select={defaultGraphSchemeV2.disease_fill}/>
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box  >
                    <ColorSelect inputRef={diseaseFontRef} label='Font' select={defaultGraphSchemeV2.disease_stroke}/>
                </Box>
            </Grid>

            <Grid item xs={12} >
                <Box color='primary.main' >
                    Syndrome 
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box  >
                    <ColorSelect inputRef={syndromeNodeRef} label='Node' select={defaultGraphSchemeV2.syndrome_fill}/>
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box  >
                    <ColorSelect inputRef={syndromeFontRef} label='Font' select={defaultGraphSchemeV2.syndrome_stroke}/>
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
                    <TextField inputRef={scaleFontRef}  label='Node Sise Font' variant='standard' type='number' defaultValue={graphScheme.nodeSize}/>
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
