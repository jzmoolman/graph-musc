import { Driver, }  from  'neo4j-driver'
import { Integer } from 'neo4j-driver-core'

import { 
    arrayToStrV2,
}
from '../tools/graphtools'

export interface Gene {
    id: string
    name: string
    fullName: string
    altName: string
    description: string
    mechanism: string
}

type loadGenesProps = {
    filterGenes?: string[],
    onData?: (data: Gene[]) => void
}

export const  loadGenes = async (
    driver: Driver | undefined,
    {
        filterGenes = [],
        onData
    }: loadGenesProps
) => {

    let result : Gene[] = []
    if (driver == null) {
        console.log('error: Driver not loaded')
        return  result
    }
    
    let WHERE = ''
    if (filterGenes.length > 0) {
        WHERE = `WHERE g.name in ${arrayToStrV2(filterGenes)}`
    }

    const query = 
        `MATCH (g:gene)
         ${WHERE}
         RETURN g`

    let session = driver.session()

    try {
        let r = await session.run(query)
        r.records.forEach(row => {
            const g = row.get('g')
            let gene: Gene = { 
                id: Integer.toString(g.identity),
                name: g.properties.name,
                fullName: g.properties.fullName,
                altName: g.properties.altName,
                description: g.properties.description,
                mechanism: g.properties.machanism
            }
            result.push(gene)
        })
        session.close();
        if (onData !== undefined) {
            onData(result);
        }
    } catch (e) {
        console.log('error: loadGenes', e, query )
        // throw e
    }
    finally {
        await session.close()
        return result;

    }
}

export const  loadGenes_hasFinalVerdict = async (
    driver: Driver | undefined,
    {
        filterGenes = [],
        onData
    }: loadGenesProps
) => {
    let result : Gene[] = []
    if (driver == null) {
        console.log('error: Driver not loaded')
        return result
    }
    let WHERE = ''
    if (filterGenes.length > 0) {
        WHERE = `WHERE g.name in ${arrayToStrV2(filterGenes)}`
    }

    const query = 
        `MATCH p=(g:gene)-[:AFFECTS {finalVerdict:1}]->(o:organ) 
         ${WHERE}
         WITH DISTINCT g.name as name, g
         RETURN g`
    console.log('---->query', query)

    let session = driver.session()

    
    try {
        let r = await session.run(query)
        r.records.forEach(row => {
            const g = row.get('g')
            let gene: Gene = { 
                id: Integer.toString(g.identity),
                name: g.properties.name,
                fullName: g.properties.fullName,
                altName: g.properties.altName,
                description: g.properties.description,
                mechanism: g.properties.machanism
            }
            result.push(gene)
        })
        await session.close()
        if ( onData !== undefined) {
            onData(result);
        }
    } catch (e) {
        console.log('error: loadGenes_hasFinalVerdict', e, query )
        // throw e
    }
    finally {
        return result;

    }
}