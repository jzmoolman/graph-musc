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
import { build_gene_affecs_risk_organ_graph } from '../data/gene-organ.forcegraph'

type GeneCardProps =  {
    data: any,
    gene: string,
    gender: string,
    visable?: boolean
    onClose?: ()=>void,
}

export const GeneCardV3 = ({
    data,
    gene,
    gender,
    visable,
    onClose, }: GeneCardProps) => {

    console.log('--->Debug: GendCardV3.data', data)
    console.log('--->Debug: GendCardV3.gene', gene)
    console.log('--->Debug: GendCardV3.gender', gender)
    

    const _co = {
        gene,
        gender,
    }

    console.log('--->Debug: GendCardV3.tmp', _co)
    const [currentOptions, setCurrentOptions] = useState({gene,gender})

    console.log('--->Debug: GendCardV3.currentOptions', currentOptions)

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
        if (onClose) {
            onClose();
        }
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
        top: '90px',
        bottom: '50px',
        left: '50px',
        right: '150px',
        // border: '3px solid #73AD21',
    }

    return ( visable && data?
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
                    // title={currentOptions.gene}
                    title={gene}
                    action={
                        <IconButton onClick={handleClose}  aria-label="close"> <CloseIcon />
                        </IconButton>
                    }
                />

                <CardContent>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="basic tabs example">
                            <Tab label="Summary" {...a11yProps(0)}/>
                            <Tab label="Graph" {...a11yProps(1)} />
                            <Tab label="Chart" {...a11yProps(2)} />
                            <Tab label="NCCN Guidelines" {...a11yProps(3)} />
                        </Tabs>
                    </Box>
                    <Box component={'div'} sx={{ 
                            // Hardcode height for now.  This allow for the scolling to be active
                            height: 600, 
                            overflow:'auto'
                        }}
                    >
                        <TabPanel value={tabIndex} index={0}>
                            {/* <GeneDesc gene={currentOptions.gene}></GeneDesc> */}
                            <GeneDesc gene={gene}></GeneDesc>
                        </TabPanel>
                        <TabPanel value={tabIndex} index={1}>
                            <GeneRiskGraph 
                                nodes={build_gene_affecs_risk_organ_graph(data).nodes} 
                                links={build_gene_affecs_risk_organ_graph(data).links}
                                // gene={currentOptions.gene}
                                gene={gene}
                                gender={currentOptions.gender}/>
                        </TabPanel>
                        <TabPanel value={tabIndex} index={2}>
                            <GeneRiskChart data={data}
                                gene={gene}
                                // gene={currentOptions.gene}
                                gender={currentOptions.gender}
                            /> 
                        </TabPanel>
                        <TabPanel value={tabIndex} index={3}>
                            {/* <NCCN gene={currentOptions.gene}></NCCN> */}
                            <NCCN gene={gene}></NCCN>
                        </TabPanel>
                    </Box>
                </CardContent>
            </Card>
            </div>:<></>
        
    )
}