import React, { useRef } from 'react'
import { useState } from 'react'
import { InputLabel, MenuItem, FormControl, Box } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { keyboard } from '@testing-library/user-event/dist/keyboard';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 4;

type CustomSelectProps = {
    options: string[] | {key: string, value:string}[]
    label: string
    defaultSelected: string
    showLabel?: boolean
    onChange?: (selected: string)=> void
}

export const CustomSelect = ({options, label, defaultSelected, showLabel, onChange} : CustomSelectProps) => {
    const [selected, setSelected] = useState(defaultSelected)

    const handleChange = (event: SelectChangeEvent) => {
       setSelected(event.target.value)
       if (onChange) onChange(event.target.value) 
    };

    return (
        <Box 
            id='custom-box' 
            display='flex' 
            sx={{
                minWidth: 250,
                maxWidth: 350,
                margin: 1
            
            }}
        >
            <FormControl sx={{ width:'100%'}} size='small'>
                <InputLabel 
                    
                    variant='outlined'
                    id='select-label'
                >
                    {showLabel?label:''}
                </InputLabel>
                <Select 
                    labelId='select-label'
                    id='select-color'
                    variant='outlined'
                    value={selected} 
                    onChange={handleChange}
                    //label={label}
                >
                    {options?.map(
                        (el : string | {key: string, value: string})=> {
                            let lkey = ''
                            let lvalue = ''
                            if ( typeof el === 'string') {
                              lkey = el
                              lvalue = el 
                            }
                            if ( typeof el === 'object') {
                              lkey = el.key
                              lvalue = el .value
                            }
                            return (
                                <MenuItem
                                    key={lkey}
                                    value={lvalue}
                                >
                                    {lvalue}
                                </MenuItem>
                            )
                        }
                    )}
                </Select>
            </FormControl>
        </Box>
    )
}
