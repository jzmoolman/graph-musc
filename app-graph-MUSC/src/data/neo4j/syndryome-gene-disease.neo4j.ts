import { Driver, }  from  'neo4j-driver'
import { Integer } from 'neo4j-driver-core'

import { 
    arrayToStrV2,
} from '../../tools/graphtools'

import { Gene } from '../gene.neo4j'
import { Disease } from '../disease.neo4j'
import { Syndrome } from '../syndrome.neo4j'



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
    console.log('---->Debug: load_syndrome_gene_cause_disease')
    let result : SyndromeGeneCauseDisease[] = []
    if (driver == null) {
        console.log('error: Driver not loaded')
        return result
    }

    console.log('--->Debug load_syndrome_gene_cause_disease')
    console.log('--->Debug gender', gender)
   
    // Example
    // MATCH (s:syndrome)<-[a:ASSOCIATED]-(g:gene {name:'BRCA1'})-[c:CAUSE {finalVerdict:1}]->(d:disease)
    // RETURN s,a,g,c,d

    let query = ''
    if (specialist !== 'None' ) {
        query = 
        `MATCH (n:LKP_SPECIALISTS_BY_ORGAN)\n
            WHERE n.PrimarySpecialist ='${specialist}'\n       
            WITH COLLECT(DISTINCT n.Organ_System) AS organs\n
        MATCH p=(g:gene)-[a:AFFECT {finalVerdict:1}]->(o:organ)\n
            WHERE o.name in organs\
            WITH COLLECT( DISTINCT g.name) AS genes\
        MATCH (s:syndrome)<-[a:ASSOCIATED]-(g:gene)-[c:CAUSE {finalVerdict:1}]->(d:disease)\
        WHERE g.name in genes\n`
        if ( gender !== 'Node')  {
            query += `AND c.gender in ["${gender}","Either"]\n`

        }
        query += 'RETURN s,a,g,c,d'
    } else {
        //Example
        // MATCH p=(g:gene {name:'BRCA2'})-[c:CAUSE {finalVerdict:1}]->(d:disease)
        //      WHERE 1=1
        //      RETURN g,c,d
        query = 
            `MATCH (s:syndrome)<-[a:ASSOCIATED]-(g:gene)-[c:CAUSE {finalVerdict:1}]->(d:disease)\
            WHERE 1=1\n` // Dummy WHERE that is always true
            if  ( gender !== 'None' ) {
                query += ` AND c.gender in ["${gender}","Either"]\n` 
            }
            if (syndromeFilter.length > 0) {
                query += ` AND s.name in ${arrayToStrV2(syndromeFilter)}`
            }
            if (geneFilter.length > 0) {
                query += ` AND g.name in ${arrayToStrV2(geneFilter)}\n`
            }
            if (diseaseFilter.length > 0) {
                query += ` AND d.name in ${arrayToStrV2(diseaseFilter)}\n`
            }
            query += 'RETURN s,a,g,c,d'
    }

    

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
