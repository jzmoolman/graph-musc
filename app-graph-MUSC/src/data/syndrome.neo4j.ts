import { Driver, }  from  'neo4j-driver'
import { Integer } from 'neo4j-driver-core'
import { arrayToStrV2 } from '../tools/graphtools'

export interface Syndrome {
    id: string
    name: string
    types: []
    verbiages: []
}

type loadProps = {
    specialist?: string,
    syndromeFilter?: string[],
    onData?: (data: Syndrome[]) => void
}

export const load_syndrome = async (
    driver: Driver | undefined,
    {
        specialist ='None',
        syndromeFilter = [],
        onData}: loadProps
) => {
    // console.log('---->Debug: load_syndrome')
    let result : Syndrome[] = []
    if (driver == null) {
        console.log('error: Driver not loaded')
        return result
    }
   
    let WHERE = 'WHERE 1=1' // Dummy WHERE that is always true
    if (syndromeFilter.length > 0) {
        WHERE += ` AND s.name in ${arrayToStrV2(syndromeFilter)}`
    }

    //Example
    // MATCH ...misssing
    //      WHERE 1=1
    //      RETURN g,c,d
    
    const query = 
        `MATCH (s:syndrome)\ 
        ${WHERE}\
        RETURN s`
    console.log('---->Debug: load_syndrome', query)

    let session = driver.session()

    try {
        let r = await session.run(query)
        r.records.forEach(syndrome => {
            const s = syndrome.get('s')
            let data : Syndrome  = {
                id: Integer.toString(s.identity),
                name: s.properties.name,
                types: s.propertes.types,
                verbiages: s.propertes.verbiages,
            }
            result.push(data)
        })
        await session.close();
    } catch (e) {
        console.log('error: load_gene_cause_disease e', e )
        console.log('error: load_gene_cause_disease query', query )
        // throw e
    } finally {
        if ( onData !== undefined) {
            onData(result);
        }
        return result;
    }

}

