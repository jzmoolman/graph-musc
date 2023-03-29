import { Driver, }  from  'neo4j-driver'

import { 
    arrayToStrV2,
    defaultGraphScheme, 
    FinalVerdict, 
    GraphScheme
} from '../tools/graphtools'

import { finalVerdictClauseV2 } from '../tools/graphdata'
import { GeneNode } from './gene.neo4j'
import { OrganNode } from './organ.neo4j'

export interface GeneOrgansNode extends GeneNode {
    organs: OrganNode[]
}

type loadGenesProps = {
    graphScheme?: GraphScheme,
    geneFilter?: string[],
    organFilter?: string[],
    specialistFilter?: string,
    finalVerdict?:  FinalVerdict,
    onData?: (data: GeneNode[]) => void
}

export const  load_gene_organs = async (
    driver: Driver | undefined,
    {
        graphScheme = defaultGraphScheme, 
        geneFilter = [],
        organFilter = [],
        specialistFilter ='Generic',
        finalVerdict = 'Confirmed',
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
        `MATCH (g:MGene)--(o:Organ)
         WHERE ${finalVerdictClauseV2(finalVerdict)}      
         ${filterStr}
         RETURN g,o`
    console.log('---->query', query)

    let session = driver.session()

    let data : GeneOrgansNode[] = []
    try {
        // console.log('---->debug', 1)
        let r = await session.run(query)
        r.records.forEach(row => {
            const g = row.get('g')
            let gene = data.find( d => d.name === g.properties.name )
            if ( !gene ) {
                gene = { 
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
                    organs: [],
                }
                data.push(gene)
            }
            const o = row.get('o') 
            let organ: OrganNode = { 
                    id: o.identity,
                    name: o.properties.name,
                    nodeType: 'Organ',
                    nodeColor: graphScheme.organNode,
                    fontColor: graphScheme.organFont,
                    nodeVal: graphScheme.nodeVal,
                    nodeRelSize: graphScheme.nodeRelSize,
                    scaleFont: graphScheme.scaleFont,
                    male_risk: o.properties.male_risk,
                    female_risk: o.properties.female_risk,
                    male_population_risk: o.properties.male_population_risk,
                    female_population_risk: o.properties.female_population_risk,
            }
            if ( gene.name === 'BRCA2') {
                console.log('---->Debug: load gene-organs organ', gene.name, organ)
            }
            gene.organs.push(organ) 
        })

        session.close();
        // console.log('---->Debug: data', data)
        if ( onData) {
            console.log('---->Debug: before onData')
            onData(data);
            console.log('---->Debug: after onData')
        }
    } catch (e) {
        throw e
    } finally {
        await session.close()
        return data;

    }
}
