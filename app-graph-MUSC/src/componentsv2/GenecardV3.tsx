import { useState} from 'react'
import CSS from 'csstype' 

import { GeneRiskGraph } from "../experimental/GeneRiskGraph"
import { GeneRiskChart } from "../experimental/GeneRiskChart"
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
import { build_gene_affecs_risk_organ_graph } from '../data/forcegraph/gene-organ.forcegraph'
import { Gene_OrganRisks } from '../data/neo4j/gene-affect-organ.neo4j'

type GeneCardProps =  {
    data: Gene_OrganRisks[],
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

    console.log('--->Debug: GendCardV3')

    const [currentGene, setCurrentGene] = useState('')
    const [currentGender, setCurrentGender] = useState('')
    

    // console.log('--->Debug: GendCardV3.currentOptions', currentOptions)

    const [tabIndex, setTabIndex] = useState(0)


    function handleGeneChange(e:React.ChangeEvent<HTMLSelectElement>) {
        // let options = {...currentOptions}
        // options.gene = e.target.value 
        // setCurrentOptions(options)
        setCurrentGene(e.target.value)
    }
    
    const  handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // let options = {...currentOptions}
        // options.gender = event.target.value 
        // setCurrentOptions(options)
        setCurrentGender(e.target.value)
    }

    const handleClose = () => {
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
                    <Typography component='div'>{children}</Typography> 
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

    // data contain all the genes/gender information
    // Filter gene and gender
    let geneFiltered  = data.find(_gene => _gene.gene.name === (currentGene==''?gene:currentGene))
    // console.log('---->Debug: GeneCardV3.tsx geneFiltered', geneFiltered)



    return ( visable && geneFiltered?
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
                            <Tab label="Bar Chart" {...a11yProps(2)} />
                            <Tab label="NCCN Guidelines" {...a11yProps(3)} />
                        </Tabs>
                    </Box>
                    <Box id='BOX-CHECK_ID' component={'div'} sx={{ 
                            // Hardcode height for now.  This allow for the scolling to be active
                            height: 600, 
                            overflow:'auto'
                        }}
                    >
                        <TabPanel value={tabIndex} index={0}>
                            {/* <GeneDesc gene={currentOptions.gene}></GeneDesc> */}
                            <GeneDesc gene={geneFiltered}></GeneDesc>
                        </TabPanel>
                        <TabPanel value={tabIndex} index={1}>
                            <GeneRiskGraph 
                                data={build_gene_affecs_risk_organ_graph([geneFiltered])} 
                                gene={geneFiltered}
                                gender={currentGender===''?gender:currentGender}
                            />
                        </TabPanel>
                        <TabPanel value={tabIndex} index={2}>
                            <GeneRiskChart data={data}
                                gene={currentGene}
                                gender={currentGender===''?gender:currentGender}
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