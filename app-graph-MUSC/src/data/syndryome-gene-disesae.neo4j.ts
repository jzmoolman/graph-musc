import { Driver, }  from  'neo4j-driver'
import { Integer } from 'neo4j-driver-core'

import { 
    arrayToStrV2,
} from '../tools/graphtools'

import { Gene } from './gene.neo4j'
import { Disease } from './disease.neo4j'
import { Syndrome } from './syndrome.neo4j'



type Cause = {
    id: string,
    diseaseType: string,
    gender: string,
    finalVerdict: number,
    predominantCancerSubType: number,
}

export type SyndromeGeneCauseDisease = {
    syndrome: Syndrome,
    gene: Gene,
    cause: Cause,
    disease:Disease,
}

type loadProps = {
    specialist?: string,
    gender?: string,
    syndromeFilter?: string[],
    geneFilter?: string[],
    diseaseFilter?: string[],
    onData?: (data: SyndromeGeneCauseDisease[]) => void
}


export const load_syndrome_gene_cause_disease = async (
    driver: Driver | undefined,
    {
        specialist ='None',
        gender = 'None',
        syndromeFilter = [],
        geneFilter = [],
        diseaseFilter = [],
        onData}: loadProps
) => {
    // console.log('---->Debug: load_syndrome_gene_cause_disease')
    let result : SyndromeGeneCauseDisease[] = []
    if (driver == null) {
        console.log('error: Driver not loaded')
        return result
    }
   
    let WHERE = 'WHERE 1=1' // Dummy WHERE that is always true

    if (syndromeFilter.length > 0) {
        WHERE += ` AND s.name in ${arrayToStrV2(syndromeFilter)}`
    }
    if (geneFilter.length > 0) {
        WHERE += ` AND g.name in ${arrayToStrV2(geneFilter)}`
    }
    if (diseaseFilter.length > 0) {
        WHERE += ` AND d.name in ${arrayToStrV2(diseaseFilter)}`
    }

    // Example
    // MATCH (s:syndrome)<-[a:ASSOCIATED]-(g:gene {name:'BRCA1'})-[c:CAUSE {finalVerdict:1}]->(d:disease)
    // RETURN s,a,g,c,d
    
    const query = `MATCH (s:syndrome)<-[a:ASSOCIATED]-(g:gene)-[c:CAUSE {finalVerdict:1}]->(d:disease)\
        ${WHERE}\
        RETURN s,a,g,c,d`

    console.log('---->Debug: load_gene_cause_disease', query)

    let session = driver.session()

    try {
        let r = await session.run(query)
        r.records.forEach(row => {
            const s = row.get('s')
            const g = row.get('g')
            const c = row.get('c')
            const d = row.get('d')
            let data : SyndromeGeneCauseDisease  = {
                syndrome:{
                    id: Integer.toString(s.identity),
                    name: s.properties.name,
                    types: s.properties.types?s.properties.types:[],
                    verbiages: s.properties.verbiages?s.properties.verbiages:[],
                },
                gene:  { 
                    id: Integer.toString(g.identity),
                    name: g.properties.name,
                    fullName: g.properties.fullName,
                    altName: g.properties.altName,
                    description: g.properties.description,
                    mechanism: g.properties.mechanism,
                },
                cause: {
                    id: Integer.toString(c.identity),
                    diseaseType: c.properties.diseaseType,
                    gender: c.properties.gender,
                    finalVerdict: c.properties.finalVerdict,
                    predominantCancerSubType: c.properties.predominantCancerSubType,
                },
                disease: {
                    id: Integer.toString(d.identity),
                    name: d.properties.name, 
                },
            }
            result.push(data)
        })
        await session.close();
    } catch (e) {
        console.log('error: load_syndrome_gene_cause_disease e', e )
        console.log('error: load_syndrome_gene_cause_disease query', query )
        // throw e
    } finally {
        if ( onData !== undefined) {
            onData(result);
        }
        return result;
    }
}
