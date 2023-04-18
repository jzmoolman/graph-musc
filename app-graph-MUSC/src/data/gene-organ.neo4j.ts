import { Driver, }  from  'neo4j-driver'
import { Integer } from 'neo4j-driver-core'

import { 
    arrayToStrV2,
} from '../tools/graphtools'

import { Gene } from './gene.neo4j'
import { Organ } from './organ.neo4j'

export interface OrganRisk extends Organ {
    has_risk: boolean,
    gender: string,
    risk: number,
    population_gender: string,      // . Temp to make data integrity.  Should match gender
    population_risk: number,
}

export interface Gene_Organs {
    gene: Gene,
    organs: Organ[],
}

export interface Gene_OrganRisks {
    gene: Gene,
    organs: OrganRisk[],
}



type loadGeneOrgansProps = {
    geneFilter?: string[],
    organFilter?: string[],
    specialist?: string,
    onData?: (data: Gene_Organs[]) => void
}

type loadGeneOrganRisksProps = {
    geneFilter?: string[],
    organFilter?: string[],
    specialistFilter?: string,
    onData?: (data: Gene_OrganRisks[]) => void
}

export const load_gene_affects_organ = async (
    driver: Driver | undefined,
    {
        specialist ='Generic',
        geneFilter = [],
        organFilter = [],
        onData}: loadGeneOrgansProps
) => {

    // console.log('---->Debug: load_gene_affects_organ')
    let result : Gene_Organs[] = []
    if (driver == null) {
        console.log('error: Driver not loaded')
        return result
    }
   
    let WHERE = 'WHERE 1=1' // Dummy WHERE that is always true
    if (geneFilter.length > 0) {
        WHERE += ` AND g.name in ${arrayToStrV2(geneFilter)}`
    }

    if (organFilter.length > 0) {
        WHERE += ` AND o.name in ${arrayToStrV2(organFilter)}`
    }
    
    const query = 
        `MATCH p=(g:gene)-[r:AFFECTS {finalVerdict:1}]->(o:organ) 
         ${WHERE}
         RETURN g,r,o`
    // console.log('---->Debug: load_gene_affects_organ', query)

    let session = driver.session()

    try {
        let r = await session.run(query)
        r.records.forEach(row => {
            const g = row.get('g')
            let gene_organs = result.find( d => d.gene.name === g.properties.name )
            if ( gene_organs ===  undefined) {
                gene_organs = { 
                    gene:  { 
                        id: Integer.toString(g.identity),
                        name: g.properties.name,
                        fullName: g.properties.fullName,
                        altName: g.properties.altName,
                        description: g.properties.description,
                        mechanism: g.properties.mechanism,
                    },
                    organs: [],
                }
                result.push(gene_organs)
            }
            const o = row.get('o') 
            let organ: Organ= { 
                    id: Integer.toString(o.identity),
                    name: o.properties.name,
            }
            gene_organs.organs.push(organ) 
        })
        await session.close();
    } catch (e) {
        console.log('error: load_gene_affects_organ e', e )
        console.log('error: load_gene_affects_organ query', query )
        // throw e
    } finally {
        if ( onData !== undefined) {
            onData(result);
        }
        return result;
    }
}

export const load_gene_affects_organ_filter_specialist = async (
    driver: Driver | undefined,
    {
        specialist ='Generic',
        geneFilter = [],
        organFilter = [],
        onData}: loadGeneOrgansProps
) => {

    // console.log('---->Debug: load_gene_affects_organ_filter_specialist geneFilter', geneFilter)
    let result : Gene_Organs[] = []
    if (driver == null) {
        console.log('error: Driver not loaded')
        return result
    }
    let WHERE = 'WHERE 1=1' // Dummy WHERE that is always true
    let query = ''

    if (specialist === 'Generic') {
        query = 'MATCH p=(g:gene)-[r:AFFECTS {finalVerdict:1}]->(o:organ)\n' 
        if (organFilter.length > 0) {
            query += WHERE + ` AND o.name in ${arrayToStrV2(organFilter)}\n`
        }
        if (geneFilter.length > 0) {
            query += WHERE + ` AND g.name in ${arrayToStrV2(geneFilter)}\n`
        }
        query += 'RETURN g, r, o'
    } else {
        query = `MATCH (n:LKP_SPECIALISTS_BY_ORGAN)\
        WHERE n.PrimarySpecialist ='${specialist}'\
        WITH COLLECT(DISTINCT n.Organ_System) AS organs\
        MATCH p=(g:gene)-[r:AFFECTS {finalVerdict:1}]->(o:organ)\
        WHERE o.name in organs\n`
        if (geneFilter.length > 0) {
            query += ` AND g.name in ${arrayToStrV2(geneFilter)}\n`
        }
        query += 'RETURN g, r, o'
    }
    //  console.log('---->Debug: load_gene_affects_organ', query)
 
     let session = driver.session()
 
     try {
         let r = await session.run(query)
         r.records.forEach(row => {
             const g = row.get('g')
             let gene_organs = result.find( d => d.gene.name === g.properties.name )
             if ( gene_organs ===  undefined) {
                 gene_organs = { 
                     gene:  { 
                         id: Integer.toString(g.identity),
                         name: g.properties.name,
                         fullName: g.properties.fullName,
                         altName: g.properties.altName,
                         description: g.properties.description,
                         mechanism: g.properties.mechanism,
                     },
                     organs: [],
                 }
                 result.push(gene_organs)
             }
             const o = row.get('o') 
             let organ: Organ= { 
                     id: Integer.toString(o.identity),
                     name: o.properties.name,
             }
             gene_organs.organs.push(organ) 
         })
         await session.close();
     } catch (e) {
         console.log('error: load_gene_affects_organ e', e )
         console.log('error: load_gene_affects_organ query', query )
         // throw e
     } finally {
         if ( onData !== undefined) {
             onData(result);
         }
         return result;
     } 



}

export const load_gene_affects_risk_organ = async (
    driver: Driver | undefined,
    {
        specialistFilter ='Generic',
        geneFilter = [],
        organFilter = [],
        onData}: loadGeneOrganRisksProps
) => {

    // console.log('---->Debug: load_gene_affects_organ')
    let result : Gene_OrganRisks[] = []
    if (driver == null) {
        console.log('error: Driver not loaded')
        return result
    }
   
    let WHERE = `WHERE (type(r) = 'AFFECTS'\
        AND r.finalVerdict =1) OR type(r) = 'RISK'`

    if (geneFilter.length > 0) {
        WHERE += ` AND g.name in ${arrayToStrV2(geneFilter)}`
    }

    if (organFilter.length > 0) {
        WHERE += ` AND o.name in ${arrayToStrV2(organFilter)}`
    }
    
    const query = `MATCH p=(g:gene)-[r:AFFECTS |RISK ]->(o:organ)\
        ${WHERE}\
        RETURN g, collect(r) as r, o`

    // console.log('---->Debug: load_gene_affects_organ query:',  query )

    let session = driver.session()

    try {
        let r = await session.run(query)
        r.records.forEach(row => {
            const g = row.get('g')
            let gene_organs = result.find( d => d.gene.name === g.properties.name )
            if ( gene_organs ===  undefined) {
                gene_organs = { 
                    gene:  { 
                        id: Integer.toString(g.identity),
                        name: g.properties.name,
                        fullName: g.properties.fullName,
                        altName: g.properties.altName,
                        description: g.properties.description,
                        mechanism: g.properties.mechanism,
                    },
                    organs: [],
                }
                result.push(gene_organs)
            }
            const rl = row.get('r')
            // console.log('---->Debug: relationship-list', rl)
            rl.forEach( (r: any) => {
                if ( r.type === 'RISK') {
                    const o = row.get('o') 
                    let organRisk: OrganRisk= { 
                            id: Integer.toString(o.identity),
                            name: o.properties.name,
                            has_risk: true,
                            gender: r.properties.gender,
                            risk: r.properties.risk,
                            population_gender: r.properties.population_gender,
                            population_risk: r.properties.population_risk, 
                    }
                    gene_organs!.organs.push(organRisk) 
                } else {
                    const o = row.get('o') 
                    let organRisk: OrganRisk= { 
                            id: Integer.toString(g.identity),
                            name: o.properties.name,
                            has_risk: false,
                            gender: '',
                            risk: 0,
                            population_gender: '',
                            population_risk: 0, 
                    }
                    gene_organs!.organs.push(organRisk) 
                }
            } )
        })
        await session.close();
    } catch (e) {
        console.log('error: load_gene_affects_organ e', e )
        console.log('error: load_gene_affects_organ query', query )
        // throw e
    } finally {
        if ( onData !== undefined) {
            onData(result);
        }
        return result;
    }
}
