import { useState, useContext, useEffect, useRef, MutableRefObject } from 'react'
import { Driver }  from  'neo4j-driver'
import { Neo4jContext } from 'use-neo4j'
import ForceGraph2D, { ForceGraphMethods }  from 'react-force-graph-2d'
import { SyndromeDataType } from './SyndromeSelector'
import { paintNode } from './genGraph'
import { TypeNode } from 'typescript'

type SyndromeGeneGraphType = {

    verified: boolean
    selectedSyndromes: SyndromeDataType[]
}

const selectedSyndromesToStr = (seletedSyndromes: SyndromeDataType[]) => {
    let localFilter = '';
    seletedSyndromes.forEach(value => { 
        if (localFilter === '') localFilter = '['
            localFilter = localFilter + '\'' + value.text + '\','
        } )
        if (localFilter !== '') {
            localFilter = localFilter.slice(0, localFilter.length - 1);
            localFilter = localFilter + ']'
        }
    return localFilter
}

type dataType = 
{   nodes: nodeType[] 
    links: linkType[]
}

type nodeType = {
        id:number
        name: string
        nodeColor: string
        fontColor: string
 }
 
type linkType =  {
  source: string,
  target: string

}


const  loadData = async (driver: Driver | undefined, selectedSyndromes: SyndromeDataType[], verified: boolean,
        onData:(data: dataType)=> void) => {
    console.log('enter - loadData')
    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    const syndromesStr = selectedSyndromesToStr(selectedSyndromes)
    console.log('selectedSyndromesStr', syndromesStr)
    let whereCLAUSE = ''
    if ( syndromesStr !== '' && verified ) {
        whereCLAUSE =  'WHERE s.name IN ' + syndromesStr + ' AND g.FinalVerdict = 1'
    } else if ( syndromesStr !== '' && !verified ) {
        whereCLAUSE =  'WHERE s.name IN ' + syndromesStr
    } else if ( syndromesStr === '' && verified ) {
        whereCLAUSE = ' WHERE g.FinalVerdict = 1'
    } else {
        whereCLAUSE = ''
    }

    const qSyndromeGene = `MATCH (g:MGene)-[r:ATTR]->(s:Syndrome) ${whereCLAUSE} RETURN g,r,s`
   
    console.log('gSyndrome', qSyndromeGene)
  
    let session = driver.session()

    try {
        let res = await session.run(qSyndromeGene)
        let keys = new  Set<string>()
        let nodes : nodeType[] = []
        let links : linkType[] = []
        res.records.forEach(row => {
            let link : linkType = { source: '', target: ''}
            const gene = row.get('g') 
            if (!keys.has(gene.properties.name)) {

                let node = { 
                    id: gene.identity,
                    name: gene.properties.name,
                    nodeColor:'blue', 
                    fontColor:'white' 
                }
                nodes.push(node) 
                link.source = node.name
                keys.add(node.name)
            } else {
                link.source = gene.properties.name
            }
           
        
           
            const syndrome = row.get('s') 
            if (!keys.has(syndrome.properties.name)) {
                
                let node = { 
                    id: syndrome.identity,
                    name: syndrome.properties.name,
                    nodeColor:'yellow',
                    fontColor:'black' 
                }
                nodes.push(node) 
                link.target = node.name
                keys.add(node.name)
            } else {
                link.target = syndrome.properties.name
            }
            //const rel = row.get('r') 

            links.push(link)

        })
        console.log(nodes) 
        console.log(links) 
        console.log('Data loaded')
        session.close();
        console.log('nodes', nodes)
        onData( {nodes, links} )
    } catch (e) {
        throw e
    }
    finally {
        await session.close()
    
    }
}

export const SyndromeGeneGraph = ( {verified, selectedSyndromes}: SyndromeGeneGraphType ) => {

    console.log('enter - SyndromeGraph')
    console.log('selectedSyndromes', selectedSyndromes)
    
    const isMounted = useRef(false)
    const [rerender, setRerender] = useState(0);

    let tick = 0 
    console.log('tick', tick )

    const onResize = () => {
        console.log('onResize')
        console.log('tick', tick )
        if ( tick === 0 ) {
            tick = tick + 1
            console.log('send rerender')
            setRerender( rerender + 1 ) 
        }
    }

    useEffect(()=>{
        console.log('Graph mounted')
        isMounted.current = true
        window.addEventListener("resize", onResize )
    },[])

    const context = useContext(Neo4jContext), driver = context.driver
    const [data, setData] =  useState<dataType>( {nodes: [], links: []} )

    useEffect( () => {
        console.log('Reload data')
        const onData = (data: dataType) =>{
            console.log(data)
            setData(data)
            
        }
        loadData(driver, selectedSyndromes, verified,  onData)

    },[selectedSyndromes, verified] )

    const forceRef : MutableRefObject<ForceGraphMethods | undefined> = useRef()      

    const minWidth = window.innerWidth -38 -300
    const minHeight = window.innerHeight -60

    return ( 
        <ForceGraph2D 
            ref={forceRef}
            width={minWidth}
            height={minHeight}
            graphData={data}
            backgroundColor='white'
            nodeId='name'  
            nodeColor='nodeColor' 
            nodeLabel='name' 
            linkDirectionalArrowRelPos={1} 
            linkDirectionalArrowLength={2} 
            cooldownTicks={100}
            onEngineStop={ () => forceRef.current?.zoomToFit(400)} 
            nodeCanvasObjectMode={() => 'after'} 
            nodeCanvasObject={paintNode}
            />
    )
}

