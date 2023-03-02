import { useState, useContext, useEffect, useRef, MutableRefObject } from 'react'
import { Neo4jContext } from 'use-neo4j'
import ForceGraph2D, { ForceGraphMethods, NodeObject }  from 'react-force-graph-2d'
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { 
    defaultGraphScheme,
    cardNCCNDataObject,
    FinalVerdict,
    CustomNodeObject, 
    Force2DData,
    GraphName,
    GraphScheme,
    paintNode,
    GeneNodeObject,
    SyndromeNodeObject, 
    SubtypeNodeObject,
    TabPanelProps } from '../tools/graphtools'

import {  } from '../tools/graphtools'; //Armando Change

import { 
    loadGeneOrganData,
    loadGeneDiseaseData,
    loadGeneDiseaseSubtypeData,
    loadNCCNData,
    loadOrganGeneData,
    loadDiseaseData,
    loadSyndromeDiseaseData,
    loadSyndromeGeneDiseaseData,
 } from '../tools/graphdata'

import { Box, Button, Card, CardContent, CardHeader, Tab, Tabs } from '@mui/material'
import ReactDOM from 'react-dom'
import gene_organ_img from '../assets/gene-organ.png'
import gene_subtype_img from '../assets/gene-subtype.png'



const drawerWidth = 450;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      fontWeight: "normal",
    },
  }));

  const StyledTableCell2 = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      fontWeight: "bold",
      //webkitFontSmoothing: "antialiased",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      fontWeight: "bold",
      color: "black"
    },
  }));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(n)': {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


const StyledTableRow2 = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(n)': {
        backgroundColor: "rgba(0, 0, 0, 0.1)", ///  "rgba(0, 0, 0, 0.3)", 119,136,153, 128,128,128, 255,250,205, 255,255,224
        fontWeight: "bold",
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
        fontWeight: "bold",
    },
}));

const getimg = (name: GraphName) => {
    switch (name) {
        case 'gene-organ': return gene_organ_img;break;
        case 'gene-disease-subtype': return gene_subtype_img; break
        default: return gene_subtype_img; break
    }
}

type BaseGraphProps = {
    drawerOpen: boolean
    width: number
    height: number
    name: GraphName
    specialist: string
    genes: string[]
    organs: string[]
    syndromes: string[]
    diseases: string[]
    finalVerdict: FinalVerdict
    graphScheme: GraphScheme
    enableHover?: boolean
    enableBack?: boolean
    enableZoom?: boolean
    onClick?: () => void
    onMouseOver?: () => void  
    onMouseOut?: () => void
}
export const Graph = ( { 
    drawerOpen, 
    width=200, 
    height=300, 
    name, 
    specialist,
    genes, 
    organs, 
    syndromes,
    diseases,
    finalVerdict,
    graphScheme,
    enableHover,
    enableBack,
    enableZoom,
    onClick,
    onMouseOver,
    onMouseOut
} : BaseGraphProps ) => {
                                                                                // console.log("graph specialist", specialist)

    
    const [nodeHover, setNodeHover] = useState<NodeObject|null>(null)
    const [nodeClick, setNodeClick] = useState<boolean>(false)

    const [nccnData, setNCCNData] =  useState<any[]>([])
    const [nccnGeneCard, setNCCNGeneCard] =  useState<string[]>(genes)

    const [nccnValue, setNCCNValue] = useState(0);
    const [cardMinWidth, setCardMinWidth] = useState(0);
    const [mainCardMinWidth, setMainCardMinWidth] = useState(350);

    const handleCardClose = () => {
        setNodeHover(null);
        setNodeClick(false);
    };

    const [mounted, setMounted] = useState(false)

    useEffect( ()=> {
        setMounted(true)
    },[])

    const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e)  => {
        let position: {x: number, y: number} = {x:0, y:0}
        position.x = e?.pageX
        position.y = e?.pageY
    }

    const handleClick:React.MouseEventHandler<HTMLDivElement> = (event) => {
                                                                                // console.log('handleClick')
        if (onClick) {
            onClick()
        }
    }

    const handleNodeClick = (node: NodeObject, event: MouseEvent  ) => {
                                                                                // console.log('handleNodeClick')
        setNodeClick(true);
        setNodeHover(node)
        const _node = node as CustomNodeObject; 
                                                                                // console.log('handleNodeClick, name', _node.name)
                                                                                // console.log('handleNodeClick nodeType', _node.nodeType)
        if ((node as CustomNodeObject).nodeType === 'Gene') {
            setNCCNGeneCard([_node.name])  // ARMANDO NEW CODE, ADDED NCNN Data
        } else {
            setNCCNGeneCard(genes)
        }
    }

    const handleNodeHover = (node: NodeObject | null , previousNode: NodeObject | null) => {
        const _node = node as CustomNodeObject; 
                                                                                console.log('handleNodeHover, name', _node.name)



    }

    const navigate = useNavigate()

    const handleNodeTypeClick = (nodeType : string) => {
        navigate(`/graph/${nodeType}`)
    }
  
    const handleBackClick = () => {
        navigate(`/site/${specialist}`)
    }


    const getWidth = (box?: number) => {
        let number = 20
        if ( box === undefined) {
            number = Number(document.getElementById(`graph-box`)?.offsetWidth )
        } else {
            number = Number(document.getElementById(`graph-box${box}`)?.offsetWidth )
        }
        if ( typeof number === 'number' && number === number) {
            return number
        } else {
            return 200
        }
    }

    const getTop = (box?: number) => {
        let number = 20
        if ( box === undefined) {
            number = Number(document.getElementById(`graph-box`)?.offsetTop )
        } else {
            number = Number(document.getElementById(`graph-box${box}`)?.offsetTop )
        }

        if ( typeof number === 'number' && number === number) {
            return number
        } else {
            return 200
        }
    }
    
    const getHeight2 = (box?: number) => {
        let number = 20
        if ( box === undefined) {
            number = Number(document.getElementById(`graph-box`)?.offsetHeight )
        } else {
            number = Number(document.getElementById(`graph-box${box}`)?.offsetHeight )
        }

        if ( typeof number === 'number' && number === number) {
            return number
        } else {
            return 200
        }
    }

    useEffect( () => {
        const onCardData = (nccnData: any[]) =>{
             setNCCNData(nccnData)
        }
        
        if (['gene-organ', 'gene-disease', 'organ', 'disease', 'gene-disease-subtype', 'syndrome-gene-disease'].includes(name))  //Armando Change
        {
            loadNCCNData(driver, nccnGeneCard, finalVerdict, specialist, onCardData)
        }

    },[name, nccnGeneCard] )

    const handleNCCNChange = (event: React.SyntheticEvent, newValue: number) => {
        setNCCNValue(newValue);
        if (newValue != 0){
            setCardMinWidth(1200);
            setMainCardMinWidth(1200);
        }
        else{
            setCardMinWidth(275);
            setMainCardMinWidth(350);

        }
    };

    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
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
          </div>
        );
      }

    function a11yProps(index: number) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const renderBack = () => {
        if ( enableBack && mounted) {
            return ( ReactDOM.createPortal(<>
                    <Box
                        id='back-box'
                        display='flex'
                        flex={1}
                        flexDirection='column'
                        sx={{
                            position: "absolute",
                            overflow: "auto",
                            top: getTop() + 10,
                            left: getWidth() - 75,
                        }}
                    >
                        <Button  variant="outlined" onClick={handleBackClick}> 
                            Back
                        </Button>
                    </Box>
                    <Box 
                        id='legend-box'
                        display='flex'
                        flex={1}
                        flexDirection='column'
                        borderRadius={1}
                        borderColor='text.primary'
                        m={1}
                        border={1}
                        paddingTop={1}
                        paddingBottom={1}
                        sx={{
                            position: "absolute",
                            overflow: "auto",
                            // top: getTop() + getHeight2() - 250,
                            bottom:  5 ,
                            // bottom:  getTop() + getHeight2(),
                            left: getWidth() - 85,
                        }}
                    >
                            <img
                                src={getimg(name)} 
                                width={75}

                                
                            
                            />
                    </Box>
                    </>
                    , document.body
                ))
        } else {
            return ( ReactDOM.createPortal(<></>, document.body))
        }
    }

    const renderHover = () => {

        if (nodeClick) {
            if ((nodeHover as GeneNodeObject).nodeType === 'Gene') {
                const _node = nodeHover as GeneNodeObject; 
                                                                                console.log('renderHover', _node.name )
                const footnoteArray = [<div></div>];
                const unique_footnote = Array.from(new Set(nccnData.map(item => item.footnote)));
                unique_footnote.map((row) => {
                    footnoteArray.push(<div key={row} className="NCCNCard">
                        {row}
                        <br />
                </div>)
                })
                return (ReactDOM.createPortal(
                    <Box
                    className="nodeCard"
                    sx={{
                        position: "absolute",
                        margin: "2px 0px 2px 0px",
                        left: 20,
                        top: 160,
                        width: mainCardMinWidth,  // ARMANDO NEW CODE
                        height: 600,
                        overflow:"auto",
                        scrollbarWidth: 'thin',
                        '&::-webkit-scrollbar': {
                            width: '0.4em',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: "#f1f1f1",
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#888',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: '#555'
                        }
                        
                    }}
                >
                    <Card 
                        sx={{ 
                            border:0.1,
                            minWidth:cardMinWidth,  // ARMANDO NEW CODE
                            borderColor: 'primary.main'
                        }}
                    >

                        <CardHeader 
                            title={_node.name}
                            // subheader={(nodeHover as CustomNodeObject).nodeType}
                            action={
                                <IconButton onClick={handleCardClose}  aria-label="close"> <CloseIcon />
                                </IconButton>
                            }
                        />
                        
                        <CardContent>
                        <Box>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={nccnValue} onChange={handleNCCNChange} aria-label="basic tabs example">
                                    <Tab label="Gene" {...a11yProps(0)} />
                                    <Tab label="NCCN Guidelines" {...a11yProps(1)} />
                                    </Tabs>
                                </Box>
                                <TabPanel value={nccnValue} index={0}>

                                <Box>
                                <Graph
                                    drawerOpen={false}
                                    width={325}
                                    height={300}
                                    name='disease'
                                    specialist='Generic'
                                    genes={[_node.name]}
                                    organs={[]}
                                    syndromes={[]}
                                    diseases={[]}
                                    finalVerdict='Confirmed'
                                    graphScheme={defaultGraphScheme}
                                    enableZoom={false}
                                    onClick={() => handleNodeTypeClick(_node.nodeType)}
                                />
                                <p>
                                    <b> Name: </b>  {_node.fullName}
                                </p>
                                <p>
                                    <b> Alternate Names : </b>
                                    {_node.altName}
                                </p>
                                <div>
                                    <b>  Description: </b> 
                                    {_node.description}
                                    
                                </div>
                            </Box>
                           
                                </TabPanel>

                                <TabPanel value={nccnValue} index={1}>
                                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                <TableHead>
                                <TableRow>
    
                                    <StyledTableCell align="center">Organ/Modality</StyledTableCell>
                                    <StyledTableCell align="center">Gender</StyledTableCell>
                                    <StyledTableCell align="center">Recommendation</StyledTableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {nccnData.map((row: cardNCCNDataObject) => {
                                    
                                    const nccnRender = []
                                    
                                    if (row.organ_specialist == "1")
                                    {
                                        nccnRender.push (<StyledTableRow2 key={row.organ}>
                                            <StyledTableCell2 colSpan={3} align="justify" component="th" scope="row" >{row.organ}</StyledTableCell2>
                                            </StyledTableRow2>
                                            );

                                        row.data.forEach((element)  => {
                                                nccnRender.push(
                                                    <TableRow key={element.modality}>
                                                    <StyledTableCell2 component="th" scope="row">{element.modality}</StyledTableCell2>
                                                    <StyledTableCell2 align="justify">{element.gender}</StyledTableCell2>
                                                    <StyledTableCell2 align="justify">{element.recommendation}</StyledTableCell2>
                                                    </TableRow>
                                                );
                                            });
                                    }  
                                    else {
                                        nccnRender.push(<StyledTableRow key={row.organ}>
                                            <StyledTableCell colSpan={3} align="justify" component="th" scope="row">{row.organ}</StyledTableCell>
                                            </StyledTableRow>
                                        );

                                        row.data.forEach((element)  => {
                                            nccnRender.push(
                                                <TableRow key={element.modality}>
                                                <StyledTableCell component="th" scope="row">{element.modality}</StyledTableCell>
                                                <StyledTableCell align="justify">{element.gender}</StyledTableCell>
                                                <StyledTableCell align="justify">{element.recommendation}</StyledTableCell>
                                                </TableRow>
                                            );
                                        });
                                    }



                                        return (                                   
                                            nccnRender              
                                          );                
                                    
                                    }
    

                                ) }
                                </TableBody>    
                            </Table>
                                <div>
                                    <div>{footnoteArray}</div>
                                </div>

                                </TabPanel>
                                </Box>
                        </CardContent>
                    </Card>
                </Box>,
                document.body
            ))
            } else if ((nodeHover as CustomNodeObject).nodeType === 'Organ'){
                                                                                console.log('-------------------->',(nodeHover as CustomNodeObject).name   )
                const _node = nodeHover as CustomNodeObject
                return (ReactDOM.createPortal(
                    <Box
                        className="nodeCard"
                        sx={{
                            position: "absolute",
                            margin: "2px 0px 2px 0px",
                            left: 20,
                            top: 160,
                            width: 350,
                            height: 300
                        }}
                    >
                        <Card 
                            sx={{ 
                                border:1,
                                minWidth:275, 
                                borderColor: 'primary.main'
                            }}
                        >
                            <CardHeader 
                                title={_node.name}
                                // subheader={(nodeHover as CustomNodeObject).nodeType}
                                action={
                                    <IconButton 
                                        onClick={handleCardClose}
                                        aria-label="close"
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                }
                            />
                            <CardContent>
                                <Box>
                                    <Graph
                                        drawerOpen={false}
                                        width={325}
                                        height={300}
                                        name='organ'
                                        genes={[]}
                                        specialist='Generic'
                                        organs={[(nodeHover as CustomNodeObject).name]}
                                        // organs={[]}
                                        syndromes={[]}
                                        diseases={[]}
                                        finalVerdict='Confirmed'
                                        graphScheme={defaultGraphScheme}
                                        enableZoom={false}
                                        onClick={() => handleNodeTypeClick((nodeHover as CustomNodeObject).nodeType)}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>,
                    document.body
                ))
            } else if ((nodeHover as CustomNodeObject).nodeType === 'Disease'){
                const _node = nodeHover as CustomNodeObject
                return (ReactDOM.createPortal(
                    <Box
                        className="nodeCard"
                        sx={{
                            position: "absolute",
                            margin: "2px 0px 2px 0px",
                            left: 20,
                            top: 160,
                            width: 350,
                            height: 300
                        }}
                    >
                        <Card 
                            sx={{ 
                                border:1,
                                minWidth:275, 
                                borderColor: 'primary.main'
                            }}
                        >
                            <CardHeader 
                                title={(nodeHover as CustomNodeObject).name}
                                // subheader={(nodeHover as CustomNodeObject).nodeType}
                                action={
                                    <IconButton onClick={handleCardClose}  aria-label="close"> <CloseIcon />
                                    </IconButton>
                            }
    
                            />
                            <CardContent>
                            <Box>
                                <Graph
                                    drawerOpen={false}
                                    width={325}
                                    height={300}
                                    name={'disease'}
                                    specialist='Generic'                                    
                                    genes={[]}
                                    organs={[]}
                                    syndromes={[]}
                                    diseases={[(nodeHover as CustomNodeObject).name]}
                                    finalVerdict='Confirmed'
                                    graphScheme={defaultGraphScheme}
                                    enableZoom={false}
                                    onClick={() => handleNodeTypeClick((nodeHover as CustomNodeObject).nodeType)}
                            />
                            </Box>
                            </CardContent>
                        </Card>
                    </Box>,
                    document.body
                ))
            } else if ((nodeHover as CustomNodeObject).nodeType === 'Subtype'){
                const _node = nodeHover as CustomNodeObject
                return (ReactDOM.createPortal(
                    <Box
                        className="nodeCard"
                        sx={{
                            position: "absolute",
                            margin: "2px 0px 2px 0px",
                            left: 20,
                            top: 160,
                            width: 350,
                            height: 300
                        }}
                    >
                        <Card 
                            sx={{ 
                                border:1,
                                minWidth:275, 
                                borderColor: 'primary.main'
                            }}
                        >
                            <CardHeader 
                                title={(nodeHover as CustomNodeObject).name}
                                // subheader={(nodeHover as CustomNodeObject).nodeType}
                                action={
                                    <IconButton onClick={handleCardClose}  aria-label="close"> <CloseIcon />
                                    </IconButton>
                            }
    
                            />
                            <CardContent>
                            <Box>
                                <Graph
                                    drawerOpen={false}
                                    width={325}
                                    height={300}
                                    name={'gene-disease-subtype' as GraphName}
                                    specialist={specialist}
                                    genes={[]}
                                    organs={[]}
                                    syndromes={[]}
                                    diseases={[(nodeHover as SubtypeNodeObject).disease]}
                                    finalVerdict='Confirmed'
                                    graphScheme={defaultGraphScheme}
                                    enableZoom={false}
                                    onClick={() => handleNodeTypeClick((nodeHover as CustomNodeObject).nodeType)}
                            />
                            </Box>
                            </CardContent>
                        </Card>
                    </Box>,
                    document.body
                ))
            } else if ((nodeHover as CustomNodeObject).nodeType === 'Syndrome'){
                const _node = nodeHover as SyndromeNodeObject

                return (ReactDOM.createPortal(
                    <Box
                        className="nodeCard"
                        sx={{
                            position: "absolute",
                            margin: "2px 0px 2px 0px",
                            left: 20,
                            top: 160,
                            width: 350,
                            height: 300
                        }}
                    >
                        <Card sx={{
                                border:1,
                             minWidth:275,                             
                            borderColor: 'primary.main'
                        }}>

                            <CardHeader 
                                title={(nodeHover as CustomNodeObject).name}
                                // subheader={(nodeHover as CustomNodeObject).nodeType}
                                action={
                                    <IconButton onClick={handleCardClose}  aria-label="close"> <CloseIcon />
                                    </IconButton>
                            }
    
                            />
                            <CardContent>
                            <Box>
                                <Graph
                                drawerOpen={false}
                                width={325}
                                height={300}
                                name={'syndrome-disease' as GraphName}
                                specialist={specialist}
                                genes={[]}
                                organs={[]}
                                syndromes={[_node.name]}
                                diseases={[]}
                                finalVerdict='Confirmed'
                                graphScheme={defaultGraphScheme}
                                enableZoom={false}
                                onClick={() => handleNodeTypeClick(_node.nodeType)}
                            />
                            {/* // Armando */}
                            <p>
                                <b> Inheritance Type: </b>  {_node.hereditaryType}
                            </p>
                            {/* // Aramando - end */}
                            </Box>
                        </CardContent>
                    </Card>
                </Box>,
                document.body
            ))
        } 
        
    }
        return (<></>)

    }

    if (drawerOpen) {
        width = width - drawerWidth
    }
    
    const context = useContext(Neo4jContext), driver = context.driver


    const [data, setData] =  useState<Force2DData>( {nodes: [], links: []} )

    useEffect( () => {

        const onData = (data: Force2DData) =>{
            setData(data)
        }

        switch (name) {
            case 'gene-organ': {
                loadGeneOrganData(driver, specialist, genes, organs,finalVerdict, graphScheme, onData)
                break
            }
            case 'gene-disease': {
                loadGeneDiseaseData(driver, specialist, genes, finalVerdict, graphScheme, onData)
                break
            }
            case 'gene-disease-subtype': {
                loadGeneDiseaseSubtypeData(driver, specialist,diseases, genes,finalVerdict, graphScheme, onData)
                break
            }
            case 'organ': {
                loadOrganGeneData(driver, specialist, genes, organs, finalVerdict, graphScheme, onData)
                break
            }
            case 'disease': {
                loadDiseaseData(driver, specialist, diseases, genes, finalVerdict, graphScheme, onData)
                break
            }
            case 'syndrome-disease': {
                loadSyndromeDiseaseData(driver, specialist, syndromes, finalVerdict, graphScheme, onData)
                break
            }
            case 'syndrome-gene-disease': {
                loadSyndromeGeneDiseaseData(driver, specialist, syndromes, finalVerdict, graphScheme, onData)
                break
            }
        }

    },[ name, genes, organs, diseases, syndromes, finalVerdict, graphScheme] )
    
    const forceRef : MutableRefObject<ForceGraphMethods | undefined> = useRef()      


    let handleEngineStop: ()=>void | undefined = () => {
        if (forceRef.current) {
            (forceRef.current as ForceGraphMethods).zoomToFit(400);
        }
    }
    
    if (!graphScheme.fitViewPort) {
        if (forceRef.current) {}
    }
    return ( 
        <Box id='graph-box-xx' 
            sx={{
                padding:'2px'
            }} 
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseOver={(e)=>{
                if (onMouseOver) {
                    onMouseOver()
                }
            }}
            onMouseOut={(e)=>{
                if (onMouseOut)  {
                    onMouseOut()
                }
            }}
        >
            {renderBack()}
            {renderHover()}
            <ForceGraph2D 
                ref={forceRef}
                width={width}
                height={height}
                graphData={data}
                nodeId='name'  
                nodeColor='nodeColor' 
                nodeLabel='name' 
                linkDirectionalArrowRelPos={1} 
                linkDirectionalArrowLength={2} 
                cooldownTicks={100}
                onEngineStop={handleEngineStop}
                nodeVal={graphScheme.nodeVal}
                nodeRelSize={graphScheme.nodeRelSize}
                nodeCanvasObjectMode={() => 'after'}
                // nodeCanvasObject={paintNode}
                nodeCanvasObject={(node, ctx, current) => paintNode(node,'Red',ctx,current)}
                nodePointerAreaPaint={paintNode}
                onNodeClick={handleNodeClick}
                onNodeHover={handleNodeHover}
                enableZoomInteraction={enableZoom}
                // enableNodeDrag={false}
            />
            
        </Box>
    )
}
