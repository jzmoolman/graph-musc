import { useContext, useState } from 'react'

import ForceGraph2D  from 'react-force-graph-2d'
import { Neo4jContext } from 'use-neo4j'

type DataType = {
    nodes: []
    linkgs: []
}

export const MyGraph = () => {
    console.log('Enter graph')
    const [reload, setReload] = useState(0)
    const context = useContext(Neo4jContext), driver = context.driver
    const [data,setData] =  useState({
        nodes: [
            {name:'Jane'},
            {name:'John'},
            {name:'Zack'},
        ],
        links: 
        [{source: 'Jane', target:'John'}]
            
       })

    async function  loadData() {
        console.log('Load data')
        if (driver == null) return 
        let session = driver.session()
        let res = await session.run(`MATCH (n) RETURN n.name as name`)
        session.close();
        console.log('Data loaded')
        
        let nodes = res.records.map( row => {return { name: row.get('name')} })
        setData({ nodes,
            links: []
        })
    

    }


     return(
        <div>
            <button onClick={loadData}>Refresh</button>
            <ForceGraph2D graphData={data} nodeId='name' width={800} height={800} backgroundColor='grey'/>     
        </div>
    
    )

}

export const Graph2 = () => {
    console.log('Enter graph 2')
    const [reload, setReload] = useState(0)
    const context = useContext(Neo4jContext), driver = context.driver
    const [data,setData] =  useState({
        nodes: [
            {name:'Jane'},
            {name:'John'},
            {name:'Zack'},
        ],
        links: 
        [{source: 'Jane', target:'John'}]
            
       })

    async function  loadData() {
        console.log('Load data')
        if (driver == null) return 
        let session = driver.session()
        let res = await session.run(`MATCH (n) RETURN n.name as name`)
        session.close();
        console.log('Data loaded')
        let nodes = res.records.map( row => {return { name: row.get('name')} })
        setData({ nodes,
            links: []
        })
        console.log(data)

    }


     return(
        <div>
            <button onClick={loadData}>Refresh</button>
            <ForceGraph2D graphData={data} nodeId='name' width={800} height={800} backgroundColor='grey'/>     
        </div>
    
    )

}
