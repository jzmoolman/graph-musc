import { useState} from 'react'
import CSS from 'csstype' 

import { GeneRiskGraph } from "../experimental/GeneRiskGraph"
import { GeneRiskChart } from "../experimental/GeneRiskChart"
import { buildGeneGraph } from '../experimental/gene.data'
import { 
    Box,
    Card,
    CardContent,
    CardHeader,
    Tab,
    Tabs,
    Typography } from '@mui/material'

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { TabPanelProps } from '../tools/graphtools'
import { NCCN } from './NCCN'
import { GeneDesc } from './GeneDesc'

type GeneCardv2Props =  {
    data: any,
}

export const GeneCardV2 = ({
            data,
        }: GeneCardv2Props) => {

    const [currentOptions, setCurrentOptions] = useState({ 
        gene: '',
        gender: ''
    })

    const [tabIndex, setTabIndex] = useState(0)


    function handleGeneChange(e:React.ChangeEvent<HTMLSelectElement>) {
        let options = {...currentOptions}
        options.gene = e.target.value 
        setCurrentOptions(options)
    }
    
    const  handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let options = {...currentOptions}
        options.gender = event.target.value 
        setCurrentOptions(options)
    }

    const handleClose = () => {
        console.log('Close GeneCard')
    };

    // Tabs 
    const handleTabChange = (event: React.BaseSyntheticEvent, index: number) => {
        setTabIndex(index)
    }

    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;
        
        return ( <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box sx={{ p: 3 }}>
                <Typography>{children}</Typography>
              </Box>
            )}
          </div>)
    }

    function a11yProps(index: number) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const absolute: CSS.Properties = {
        position: 'absolute',
        top: '40px',
        right: '10px',
        bottom: '10px',
        left: '10px',
        border: '3px solid #73AD21',
    }

    return ( <div>
        <div>
            <select onChange={handleGeneChange}>
                <option>Please choose one option</option>
                {data.map((option:any, index:number) => {
                    return <option key={index} >
                        {option.id}
                    </option>
                })}
            </select>
            <select
                onChange={handleGenderChange}
            >
                <option >Please choose one option</option>
                <option key='male' value='male'>Male</option>
                <option key='female' value='female'>Female</option>
            </select>
        </div>
        <div style={absolute}>
        <Card 
            sx={{ 
                    border:1,
                    minWidth:275, 
                    borderColor: 'primary.main',
                    padding: 1
                    
                }}
        >
            <CardHeader 
                title={currentOptions.gene}
                // subheader={(nodeHover as CustomNodeObject).nodeType}
                action={
                    <IconButton onClick={handleClose}  aria-label="close"> <CloseIcon />
                    </IconButton>
                }
            />

            <CardContent>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabIndex} onChange={handleTabChange} aria-label="basic tabs example">
                        <Tab label="Gene" {...a11yProps(0)} />
                        <Tab label="Summary" {...a11yProps(1)}/>
                        <Tab label="NCCN Guidelines" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <Box sx={{ 
                    // Hardcode height for now.  This allow for the scolling to be active
                    height: 600, 
                    overflow:'auto'}}>
                    <TabPanel value={tabIndex} index={0}>
                        <GeneRiskGraph 
                            nodes={buildGeneGraph(data).nodes} 
                            links={buildGeneGraph(data).links}
                            gene={currentOptions.gene}
                            gender={currentOptions.gender}/>
                        <GeneRiskChart data={data}
                            gene={currentOptions.gene}
                            gender={currentOptions.gender}
                        /> 
                    </TabPanel>

                    <TabPanel value={tabIndex} index={1}>
                        <GeneDesc gene={currentOptions.gene}></GeneDesc>
                    
                    </TabPanel>
                    <TabPanel value={tabIndex} index={2}>
                        <NCCN gene={currentOptions.gene}></NCCN>
                    </TabPanel>
                </Box>
          </CardContent>
        </Card>
        </div>
    </div>)
}