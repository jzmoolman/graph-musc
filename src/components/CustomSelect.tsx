import React, { useRef } from 'react'
import { useState } from 'react'
import { InputLabel, MenuItem, FormControl } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { keyboard } from '@testing-library/user-event/dist/keyboard';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 4;

type CustomSelectProps = {
    options: string[] | {key: string, value:string}[]
    label: string
    defaultSelected: string
    onChange?: (selected: string)=> void
}

export const CustomSelect = ({options, label, defaultSelected, onChange} : CustomSelectProps) => {
    // console.log('enter - CustomSelect')
    // const finalVerdictRef: React.Ref<any> = useRef()
    const [selected, setSelected] = useState(defaultSelected)

    const handleChange = (event: SelectChangeEvent) => {
       setSelected(event.target.value)
       if (onChange) onChange(event.target.value) 
    };

    return (
        <div>
            <FormControl variant='standard' sx={{m:1, width:'98%'}} size='small'>
                <InputLabel id='select-label'>{label}</InputLabel>
                <Select 
                    // inputRef={finalVerdictRef}
                    labelId='select-label'
                    id='select-color'
                    value={selected} 
                    onChange={handleChange}
                    label={label}
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
        </div>
    )
}
