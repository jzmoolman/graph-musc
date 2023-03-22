import { Driver, }  from  'neo4j-driver'

import { 
    arrayToStrV2,
    CustomNodeObject, defaultGraphScheme, GraphScheme}
from '../tools/graphtools'

import { finalVerdictClauseV2 } from '../tools/graphdata'


export interface GeneNode extends CustomNodeObject {
    fullName: string
    altName: string
    description: string
}

type loadGenesProps = {
    graphScheme?: GraphScheme,
    geneFilter: string[],
    organFilter: string[],
    onData: (data: GeneNode[]) => void
}

export const  loadGenes_OrganV2 = async (
    driver: Driver | undefined,
    {
        graphScheme = defaultGraphScheme, 
        geneFilter = [],
        organFilter = [],
        onData}: loadGenesProps
) => {

    if (driver == null) {
        console.log('error: Driver not loaded')
        return 
    }
   
    let filterStr = ''
    if (geneFilter.length > 0) {
        filterStr += `AND g.name in ${arrayToStrV2(geneFilter)}`
    }

    if (organFilter.length > 0) {
        filterStr += `AND o.name in ${arrayToStrV2(organFilter)}`
    }
    
    const query = 
        `MATCH (g:MGene)--(o:organ)
         WHERE ${finalVerdictClauseV2('Confirmed')}      
         ${filterStr}
         RETURN g`
    console.log('---->query', query)

    let session = driver.session()

    let data : GeneNode[] = []
    try {
        console.log('---->debug', 1)
        let r = await session.run(query)
        r.records.forEach(row => {
            const g = row.get('g')
            let gene: GeneNode = { 
                nodeType: 'Gene',
                name: g.properties.name,
                id: g.identity,
                fullName: g.properties.fullName,
                altName: g.properties.altName,
                description: g.properties.description,
                nodeColor: graphScheme.geneNode, 
                fontColor: graphScheme.geneFont,
                nodeVal: graphScheme.nodeVal,
                nodeRelSize: graphScheme.nodeRelSize,
                scaleFont: graphScheme.scaleFont,
            }
            data.push(gene)
        })
        session.close();
        onData(data);
    } catch (e) {
        throw e
    }
    finally {
        await session.close()
        return data;

    }
}
