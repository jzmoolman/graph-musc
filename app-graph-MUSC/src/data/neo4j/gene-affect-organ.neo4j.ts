import { Driver, }  from  'neo4j-driver'
import { Integer } from 'neo4j-driver-core'

import { 
    arrayToStrV2,
} from '../../tools/graphtools'

import { Gene } from '../gene.neo4j'
import { Organ } from '../organ.neo4j'

type Affect = {
    id: string,
    gender: string,
    finalVerdict: number,
    diseaseName: string,
    diseaseType: string,
    predominantCancerSubType: string,
}

export interface GeneAffectOrgan {
    gene: Gene,
    affect: Affect
    organ: Organ,
}

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

type loadGeneEffectOrganProps = {
    specialist?: string,
    gender?: string,
    geneFilter?: string[],
    organFilter?: string[],
    onData?: (data: GeneAffectOrgan[]) => void
}

type loadGeneOrgansProps = {
    specialist?: string,
    gender?: string,
    geneFilter?: string[],
    organFilter?: string[],
    onData?: (data: Gene_Organs[]) => void
}

type loadGeneOrganRisksProps = {
    geneFilter?: string[],
    organFilter?: string[],
    specialist?: string,
    gender?: string,
    onData?: (data: Gene_OrganRisks[]) => void
}


export const load_gene_affect_organ = async ( 
    driver: Driver | undefined,
    {
        specialist ='None',
        gender = 'None',
        geneFilter = [],
        organFilter = [],
        onData}: loadGeneEffectOrganProps
) => {
    // console.log('---->Debug: load_gene_affects_organ geneFilter', geneFilter)

    let result : GeneAffectOrgan[] = []
    if (driver == null) {
        console.log('error: Driver not loaded')
        return result
    }
    let query = ''
    if (specialist !== 'None' ) {
        query = `MATCH (n:LKP_SPECIALISTS_BY_ORGAN)\
        WHERE n.PrimarySpecialist ='${specialist}'\
        WITH COLLECT(DISTINCT n.Organ_System) AS organs\
        MATCH p=(g:gene)-[a:AFFECT {finalVerdict:1}]->(o:organ)\
        WHERE o.name in organs\n`
        if  ( gender !== 'None' ) {
            query += `AND a.gender in ["${gender}","Either"]` 
        }
        query += 'RETURN g, a, o'

    } else {
        query = `MATCH p=(g:gene)-[a:AFFECT {finalVerdict:1} ]->(o:organ)\
        WHERE 1=1\n`
        if  ( gender !== 'None' ) {
            query += `AND a.gender in ["${gender}","Either"]\n` 
        }
        if (geneFilter.length > 0) {
            query += ` AND g.name in ${arrayToStrV2(geneFilter)}\n`
        }
        if (organFilter.length > 0) {
            query += ` AND o.name in ${arrayToStrV2(organFilter)}\n`
        }
        query += ' RETURN g, a, o'
    }
    console.log('---->Debug: load_gene_affect_organ', query)

    let session = driver.session()
    try {
        let r = await session.run(query)
        r.records.forEach(row => {
            const g = row.get('g')
            const a = row.get('a')
            const o = row.get('o')
            let data : GeneAffectOrgan  = {
                gene:  { 
                    id: Integer.toString(g.identity),
                    name: g.properties.name,
                    fullName: g.properties.fullName,
                    altName: g.properties.altName,
                    description: g.properties.description,
                    mechanism: g.properties.mechanism,
                },
                affect: {
                    id: Integer.toString(a.identity),

                    gender: a.properties.gender,
                    finalVerdict: a.properties.finalVerdict,
                    diseaseName: a.properties.diseaseName,
                    diseaseType: a.properties.diseaseType,
                    predominantCancerSubType: a.properties.predominantCancerSubType,
                },
                organ: {
                    id: Integer.toString(o.identity),
                    name: o.properties.name, 
                },
            }
            result.push(data)
        })
        await session.close();
    } catch (e) {
        console.log('error: load_gene_affect_organ e', e )
        console.log('error: load_gene_affect_organ query', query )
        // throw e
    } finally {
        if ( onData !== undefined) {
            onData(result);
        }
        return result;
    }
}

// CHECK ALL CODE BELOW

export const load_gene_affects_organ_old = async (
    driver: Driver | undefined,
    {
        specialist ='None',
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
        `MATCH p=(g:gene)-[r:AFFECT {finalVerdict:1}]->(o:organ) 
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
        console.log('error: load_gene_affect_organ e', e )
        console.log('error: load_gene_affect_organ query', query )
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
        specialist ='None',
        gender ='Node',
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
    let query = ''
    let GENDER

    if (gender ==='All') {
        //Do nothing special
        GENDER = ''
    } else {
        GENDER = `, gender:"${gender}"`
    }
    let WHERE = 'WHERE 1=1' // Dummy WHERE that is always true

    // Graph is limited to specialist ony when no genefilter is present.
    // Thus give us an overview of the spcialist, but when looking at a filterd gene then we want to incluse all organs affected by gene 
    if (specialist === 'None' || geneFilter.length !== 0) {
        query = `MATCH p=(g:gene)-[r:AFFECT {finalVerdict:1 ${GENDER} }]->(o:organ)\n` 
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
        MATCH p=(g:gene)-[r:AFFECT {finalVerdict:1 ${GENDER}}]->(o:organ)\
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
        specialist ='None',
        gender= 'Male',
        geneFilter = [],
        organFilter = [],
        onData}: loadGeneOrganRisksProps
) => {

    console.log('---->Debug: load_gene_affects_organ')
    let result : Gene_OrganRisks[] = []
    if (driver == null) {
        console.log('error: Driver not loaded')
        return result
    }
   
    let WHERE = `WHERE (type(r) = 'AFFECT'\
        AND r.finalVerdict =1) OR type(r) = 'RISK'`

    if (geneFilter.length > 0) {
        WHERE += ` AND g.name in ${arrayToStrV2(geneFilter)}`
    }

    if (organFilter.length > 0) {
        WHERE += ` AND o.name in ${arrayToStrV2(organFilter)}`
    }
    
    const query = `MATCH p=(g:gene)-[r:AFFECT |RISK ]->(o:organ)\
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
