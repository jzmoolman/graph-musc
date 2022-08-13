import React, { useRef, useEffect, useInsertionEffect } from 'react'
import { Theme, useTheme } from '@mui/material/styles';
import { useState } from 'react'
import { Box,  Chip, InputLabel, MenuItem, OutlinedInput, FormControl } from '@mui/material'
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

function getStyles(value: string, Values: string[], theme: Theme) {
    return {
      fontWeight:
        Values.indexOf(value) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

type DropdownProps = {
    label: string
    options: string[]
    selected: string[]
    onChange?: (selection: string[])=> void
}

export const Dropdown = ({label, options,selected, onChange} : DropdownProps) => {
    // console.log('enter = Dropdown')
    // console.log('selected', selected)

    const theme = useTheme()
    const [values, setValues] = useState<string[]>(selected)
    const ref = useRef();

    const handleChange = (event: SelectChangeEvent<typeof options>) => {
        const {
          target: { value },
        } = event;

        let selection : string[] = []
        if (typeof value === 'string')  {
          selection = value.split(',')}
        else { 
            selection =  value
        }

        setValues(selection)
        if (onChange) onChange(selection) 
      };

    const handleDelete = (e:any, value: string) => {
        e.preventDefault()
        let selection : string[] = []
        selection =  values?.filter( (key) => key !==value)
        setValues( selection )
        if (onChange) onChange( selection) 
    }

    return (
      <Box 
          id='dropdown-box' 
          display='flex' 
          sx={{
              minWidth: 250,
              margin: 1
          
          }}>
          <FormControl sx={{width:'100%'}} size='small'>
          <InputLabel 
            id='multiple-dropdown-label'>{label}
          </InputLabel>
          <Select 
            ref={ref}
            labelId='multiple-dropdown-label'
            id='multiple-doropdown'
            multiple
            value={values} 
            onChange={handleChange}
            input={<OutlinedInput label={label} />}
            renderValue={(selected)=>(
              <Box sx={{display: 'flex', flexwrap: 'wrap', gap:0.25 }}>
                {selected.map(( value)=> (
                  <Chip 
                    key={value}
                    label={value}
                    onMouseDown={(e)=>{e.stopPropagation()}}
                    onDelete={(e)=>handleDelete(e, value)}
                  />
                ))}   
              </Box>
            )}
            MenuProps={MenuProps}
            
          >
            {options?.map((value)=>(
              <MenuItem
                  key={value}
                  value={value}
                  style={getStyles(value, values ? values : [], theme)}
              >
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    )
}
