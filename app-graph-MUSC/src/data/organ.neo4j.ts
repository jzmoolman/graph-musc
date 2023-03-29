import { Driver, }  from  'neo4j-driver'

import { 
    CustomNodeObject, 
    defaultGraphScheme, 
    GraphScheme
} from '../tools/graphtools'

import { finalVerdictClauseV2 } from '../tools/graphdata'

export interface OrganNode extends CustomNodeObject {
    male_risk: number|undefined,
    female_risk: number|undefined,
    male_population_risk: number|undefined,
    female_population_risk: number|undefined,
}

type loadOrgansProps = {
    graphScheme?: GraphScheme,
    geneFilter: string,
    onData?: (data: OrganNode[]) => void
}

export const  loadOrgans_filterby_gene = async (
    driver: Driver | undefined,
    {
        graphScheme = defaultGraphScheme, 
        geneFilter,
        onData}: loadOrgansProps
) => {

    if (driver == null) {
        console.log('error: Driver not loaded')
        return 
    }
    const where = `AND g.name = ${geneFilter}`

    const query = 
        `MATCH (g:MGene)->(o:Organ) 
         WHERE ${finalVerdictClauseV2('Confirmed')}      
         ${where}
         RETURN o`
    console.log('---->geneFilter', geneFilter)
    console.log('---->query', query)

    let session = driver.session()

    let data : OrganNode[] = []
    try {
        let r = await session.run(query)
        r.records.forEach(row => {
            const g = row.get('g')
            let organ: OrganNode = { 
                nodeType: 'Organ',
                name: g.properties.name,
                id: g.identity,
                nodeColor: graphScheme.organNode, 
                fontColor: graphScheme.organFont,
                nodeVal: graphScheme.nodeVal,
                nodeRelSize: graphScheme.nodeRelSize,
                scaleFont: graphScheme.scaleFont,
                male_risk: undefined,
                female_risk: undefined,
                male_population_risk: undefined,
                female_population_risk: undefined,
            }
            data.push(organ)
        })
        session.close();
        if (onData) {
            onData(data);
        }
    } catch (e) {
        throw e
    }
    finally {
        await session.close()
        return data;
    }
}

export const loadGeneOrgans = async (
    driver: Driver | undefined,
    
) => {
    console.log('---->Debug: expandGeneOrgans')

    console.log('---->Debug: expandGeneOrgans - end')
}