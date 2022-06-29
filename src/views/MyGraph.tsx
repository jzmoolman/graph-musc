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
    //const [query,setQuery] = useState('MATCH (n:Gene) RETURN ID(n)  as id, n.name as name')
    const [queryG,setQueryG] = useState(' MATCH (g:Gene) RETURN ID(g) as id, g.name as name')
    const [queryO,setQueryO] = useState(' MATCH (o:Organ) RETURN ID(o) as id, o.name as name')
    const [queryR,setQueryR] = useState(' MATCH (g:Gene)-[r]->(o:Organ) RETURN ID(g) as sid,ID(o) as tid, g.name as sname, o.name as tname')

    async function  loadData() {
        console.log('Load data')
        if (driver == null) return 
        let session = driver.session()

        let res = await session.run(queryG)
        let nodes = res.records.map( row => {return { name: row.get('name')} })
        console.log('Data loaded - Gene')
 
        res = await session.run(queryO)
        nodes = Array.prototype.concat(nodes, res.records.map( row => {return { name: row.get('name')} }))
        console.log('Data loaded - Organ')

        res = await session.run(queryR)
        let links = res.records.map( row => {return { source: row.get('sname'), target: row.get('tname') } })
        console.log('Data loaded - Relationship')
        


        console.log('Data loaded')
        session.close();
        setData({ nodes,links})
    

    }

   


     return(
        <div>
            {/* <textarea onChange={e=>{setQuery(e.target.value)}} >{query}</textarea> */}
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
            <ForceGraph2D graphData={data} nodeId='name' width={800} height={800} backgroundColor='grey' linkDirectionalArrowRelPos={1}/>     
        </div>
    
    )

}
