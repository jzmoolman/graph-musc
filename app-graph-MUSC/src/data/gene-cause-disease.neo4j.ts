import { Driver, }  from  'neo4j-driver'
import { Integer } from 'neo4j-driver-core'

import { 
    arrayToStrV2,
} from '../tools/graphtools'

import { Gene } from './gene.neo4j'
import { Disease } from './disease.neo4j'



type Cause = {
    id: string,
    diseaseType: string,
    gender: string,
    finalVerdict: number,
    predominantCancerSubType: number,
}

export type GeneCauseDisease = {
    gene: Gene,
    cause: Cause,
    disease:Disease,
}

type loadProps = {
    specialist?: string,
    geneFilter?: string[],
    diseaseFilter?: string[],
    onData?: (data: GeneCauseDisease[]) => void
}


export const load_gene_cause_disease = async (
    driver: Driver | undefined,
    {
        specialist ='Generic',
        geneFilter = [],
        diseaseFilter = [],
        onData}: loadProps
) => {
    // console.log('---->Debug: load_gene_affects_organ')
    let result : GeneCauseDisease[] = []
    if (driver == null) {
        console.log('error: Driver not loaded')
        return result
    }
   
    let WHERE = 'WHERE 1=1' // Dummy WHERE that is always true
    if (geneFilter.length > 0) {
        WHERE += ` AND g.name in ${arrayToStrV2(geneFilter)}`
    }
    if (diseaseFilter.length > 0) {
        WHERE += ` AND d.name in ${arrayToStrV2(diseaseFilter)}`
    }

    //Example
    // MATCH p=(g:gene {name:'BRCA2'})-[c:CAUSE {finalVerdict:1}]->(d:disease)
    //      WHERE 1=1
    //      RETURN g,c,d
    
    const query = 
        `MATCH p=(g:gene)-[c:CAUSE {finalVerdict:1}]->(d:disease)\ 
         ${WHERE}
         RETURN g,c,d`
    // console.log('---->Debug: load_gene_cause_disease', query)

    let session = driver.session()

    try {
        let r = await session.run(query)
        r.records.forEach(row => {
            const g = row.get('g')
            const c = row.get('c')
            const d = row.get('d')
            let data : GeneCauseDisease  = {
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
