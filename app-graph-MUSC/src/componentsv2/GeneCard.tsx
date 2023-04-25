import { useContext, useEffect, useState} from 'react'
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
import { Neo4jContext } from 'use-neo4j'
import { GeneAffectPenetranceOrgan, load_gene_affect_risk_organ } from '../data/neo4j/gene-_-organ.neo4j'
import { build_gene_affecs_risk_organ_forcegraph } from '../data/forcegraph/gene-_-organ.forcegraph'
import { Node,  OrganGenderNode,  OrganPenetranceNode } from '../data/forcegraph/types.forcegraph'
import { GeneDesc } from './GeneDesc'
import { GeneNode } from '../data/forcegraph/types.forcegraph'
import { GraphData, NodeObject } from 'react-force-graph-2d'
import { GeneBarChart, build_gene_organ_barchart } from '../data/barchart/organ.barchart'

type Data = { 
    forceGraphData: GraphData | undefined,
    geneBarChart: GeneBarChart | undefined,
}

type GeneCardProps =  {
    gene: string,
    visable?: boolean
    onClose?: ()=>void,
}

export const GeneCard = ({
    gene,
    visable,
    onClose, }: GeneCardProps) => {

    console.log('--->Debug: GendCard', gene)

    const context = useContext(Neo4jContext), driver = context.driver   

    const [data, setData] = useState<Data|undefined>(undefined)
    const [gender, setGender] = useState<string>('None')

    const filterAffectWhenPenetrance = (data: GraphData): GraphData => {
        let filterNodes : NodeObject[] = []

        console.log('---->Debug: GeneCard filterAffectWhenPenetrance data', data)

        data.nodes.forEach(d => {
            if((d as Node).group === 'Organ') {
                // Filter Affect-Organ if Penetetrance-organ exists 
                let node = data.nodes.find(node => {
                    if ((node as Node).group === 'OrganPenetrance' && (node as OrganPenetranceNode).original_id === (d as OrganPenetranceNode).original_id ) {
                        return true
                    } else {
                        return false
                    }
                }) 
                if (node) {
                    filterNodes.push(d)
                }
            }
        })
        console.log('---->Debug: GeneCard filterCauseWhenPenetrance filterNodes', filterNodes)
        
        let result: GraphData = {
            nodes : data.nodes.filter( data => !filterNodes.includes(data)),
            links : data.links.filter( data => {
                
                if (filterNodes.findIndex( searchElement => { 
                    let id = typeof data.target === 'object'? data.target.id: data.target
                    return (searchElement as Node).id === id
                }) === -1) { 
                    return true
                } else {
                    return false
                }
            }) 
        }
        console.log('---->Debug: GeneCard filterCauseWhenPenetrance result', result)

        return result

    }


    const handleData =(data: GeneAffectPenetranceOrgan[]) => {
        console.log('--->Debug: Genecard handleData', data)

        let _data: Data = {
            forceGraphData: filterAffectWhenPenetrance(build_gene_affecs_risk_organ_forcegraph(gender, data)),
            geneBarChart: build_gene_organ_barchart('Male', data),
        }
        setData(_data)
    }

    useEffect(()=>{
        // Load all genders, Genecard will filter gender
        load_gene_affect_risk_organ(driver, {
            gender: gender,
            geneFilter: [gene], 
            organFilter:[],
            onData: handleData
        })
    },[])
    

    const [tabIndex, setTabIndex] = useState(0)

    function handleGeneChange(e:React.ChangeEvent<HTMLSelectElement>) {
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
    // let geneFiltered  = data.find(_gene => _gene.gene.name === (currentGene==''?gene:currentGene))
    // console.log('---->Debug: GeneCardV3.tsx geneFiltered', geneFiltered)

    const getGeneNode = (): GeneNode => {
        return data?.forceGraphData!.nodes.find(d=> (d as Node).group === 'Gene') as GeneNode
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
                            {data?<GeneDesc gene={getGeneNode()}></GeneDesc>:<></>}
                        </TabPanel>
                        <TabPanel value={tabIndex} index={1}>
                            <GeneRiskGraph 
                                data={data.forceGraphData?data.forceGraphData:{nodes: [], links:[]}} 
                                gender='Male'
                            />
                        </TabPanel>
                        <TabPanel value={tabIndex} index={2}>
                            <GeneRiskChart 
                                gender='Male'
                                data={data.geneBarChart}
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
