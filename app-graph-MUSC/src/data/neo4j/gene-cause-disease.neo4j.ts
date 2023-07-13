import { Driver, }  from  'neo4j-driver'
import { Integer } from 'neo4j-driver-core'

import { 
    arrayToStrV2,
} from '../../tools/graphtools'

import { Gene } from '../gene.neo4j'
import { Disease } from '../disease.neo4j'
import { Cause } from './_relationships_.neo4j'





export type GeneCauseDisease = {
    gene: Gene,
    cause: Cause,
    disease: Disease,
}

type loadProps = {
    specialist?: string,
    gender?: string,
    geneFilter?: string[],
    diseaseFilter?: string[],
    onData?: (data: GeneCauseDisease[]) => void
}


export const load_gene_cause_disease = async (
    driver: Driver | undefined,
    {
        specialist ='None',
        gender = 'None',
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
   
    let query = ''
    if (specialist !== 'None' ) {
        query = 
        `MATCH (n:LKP_SPECIALISTS_BY_ORGAN)\
            WHERE n.PrimarySpecialist ='${specialist}'\        
            WITH COLLECT(DISTINCT n.Organ_System) AS organs\
        MATCH p=(g:gene)-[a:AFFECT {finalVerdict:1}]->(o:organ)\
            WHERE o.name in organs\
            WITH COLLECT( DISTINCT g.name) AS genes\
        MATCH (g)-[c:CAUSE {finalVerdict:1}]->(d:disease)
        WHERE g.name in genes
        RETURN g,c,d`
    } else {
        //Example
        // MATCH p=(g:gene {name:'BRCA2'})-[c:CAUSE {finalVerdict:1}]->(d:disease)
        //      WHERE 1=1
        //      RETURN g,c,d
        query = 
            `MATCH p=(g:gene)-[c:CAUSE {finalVerdict:1}]->(d:disease)\
            WHERE 1=1\n` // Dummy WHERE that is always true
            if  ( gender !== 'None' ) {
                query += ` AND c.gender in ["${gender}","Either"]\n` 
            }
            if (geneFilter.length > 0) {
                query += ` AND g.name in ${arrayToStrV2(geneFilter)}\n`
            }
            if (diseaseFilter.length > 0) {
                query += ` AND d.name in ${arrayToStrV2(diseaseFilter)}\n`
            }

            query += ' RETURN g, c, d'

        console.log('---->Debug: load_gene_cause_disease', query)

    }

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
                    pmids: g.properties.pmids,
                    references: g.properties.references,
                    mechanism: g.properties.mechanism,
                },
                cause: {
                    type: 'CAUSE',
                    id: Integer.toString(c.identity),
                    gender: c.properties.gender,
                    finalVerdict: c.properties.finalVerdict,
                    diseaseName: c.properties.diseaseName,
                    diseaseType: c.properties.diseaseType,
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
