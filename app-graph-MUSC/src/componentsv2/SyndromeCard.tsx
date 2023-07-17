import { useContext, useEffect, useState} from 'react'
import CSS from 'csstype' 

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
import { Neo4jContext } from 'use-neo4j'
import { SyndromeGeneCauseDisease, load_syndrome_gene_cause_disease } from '../data/neo4j/syndryome-gene-disease.neo4j'
import { build_syndrome_gene_disease } from '../data/forcegraph/syndrome-disease.forcegraph2d'
import { Node } from '../data/forcegraph/types.forcegraph'
import { SyndromeDesc } from './SyndromeDesc'
import { SyndromeNode } from '../data/forcegraph/types.forcegraph'
import { GraphData } from 'react-force-graph-2d'

type Data = { 
    forceGraphData: GraphData | undefined,
    //geneBarChart: GeneBarChart | undefined,
}

type SyndromeCardProps =  {
    syndrome: string,
    visable?: boolean
    onClose?: ()=>void,
}

export const SyndromeCard = ({
    syndrome,
    visable,
    onClose, }: SyndromeCardProps) => {

    console.log('--->Debug: SyndromeCard', syndrome)

    const context = useContext(Neo4jContext), driver = context.driver   

    const [data, setData] = useState<Data|undefined>(undefined)
    const [gender, setGender] = useState<string>('None')
    let penetranceGroup = true



    const handleData =(data: SyndromeGeneCauseDisease[]) => {
        console.log('--->Debug: Syndromecard handleData', data)

        let _data: Data = {
            forceGraphData: build_syndrome_gene_disease(data),
        }
        setData(_data)
    }

    useEffect(()=>{
        // Load all genders, Syndromecard will filter gender
        load_syndrome_gene_cause_disease(driver, {
            gender: gender,
            syndromeFilter: [syndrome], 
            geneFilter:[],
            diseaseFilter: [],
            onData: handleData
        })
    },[])
    

    const [tabIndex, setTabIndex] = useState(0)

    function handleSyndromeChange(e:React.ChangeEvent<HTMLSelectElement>) {
        // let options = {...currentOptions}
        // options.gene = e.target.value 
        // setCurrentOptions(options)
        // setCurrentGene(e.target.value)
    }
    
    const  handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // let options = {...currentOptions}
        // options.gender = event.target.value 
        // setCurrentOptions(options)
        setGender(e.target.value)
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
            {/* //   <Box sx={{ p: 3 }} width={'auto'}>
                    <Typography component='div'>{children}</Typography> 
            //   </Box> */}
            {value === index && ( children )}
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

    const getSyndromeNode = (): SyndromeNode => {
        return data?.forceGraphData!.nodes.find(d=> (d as Node).group === 'Syndrome') as SyndromeNode
    }

    return(data?
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
                    title={syndrome}
                    action={
                        <IconButton onClick={handleClose}  aria-label="close"> <CloseIcon />
                        </IconButton>
                    }
                />

                <CardContent>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="basic tabs example">
                            <Tab label="Summary" {...a11yProps(0)}/>
                        </Tabs>
                    </Box>
                    <Box id='BOX-CHECK_ID' component={'div'} sx={{ 
                            // Hardcode height for now.  This allow for the scolling to be active
                            height: 600, 
                            overflow:'auto'
                        }}
                    >
                        <TabPanel value={tabIndex} index={0}>
                            {
                            <iframe src='https://drive.google.com/file/d/14cz-yx9XXmbtq-8sjnS9boDutWh3srZs/preview' width='100%' height='800px' frameBorder='0'></iframe>
                            }
                        </TabPanel>
                    </Box>
                </CardContent>
            </Card>
            </div>:<></>
        
    )
}
