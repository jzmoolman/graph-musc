import React from 'react'
import { useState } from 'react'
import { InputLabel, MenuItem, FormControl } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 4;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

const colors = ['Red', 'Blue', 'Yellow', 'Purple', 'White', 'Black']

type ColorSelectProps = {
    label: string
    select: string
    inputRef?: React.Ref<any>
    onChange?: (selection: string)=> void
}

export const ColorSelect = ({label, select, inputRef, onChange} : ColorSelectProps) => {
    // console.log('enter - ColorSelect')

    const [color, setColor] = useState(select)

    const handleChange = (event: SelectChangeEvent) => {
       setColor(event.target.value)
       if (onChange) onChange(event.target.value) 
    };

    return (
        <div>
            <FormControl variant='standard' sx={{m:1, width:'98%'}} size='small'>
                <InputLabel id='select-color-label'>{label}</InputLabel>
                <Select 
                    inputRef={inputRef}
                    labelId='select-color-label'
                    id='select-color'
                    value={color} 
                    onChange={handleChange}
                    label={label}
                >
                    {colors?.map((value)=>(
                        <MenuItem
                            key={value}
                            value={value}
                        >
                            {value}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )
}
