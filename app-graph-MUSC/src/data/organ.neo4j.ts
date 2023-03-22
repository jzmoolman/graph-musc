import { Driver, }  from  'neo4j-driver'

import { 
    CustomNodeObject, 
    defaultGraphScheme, 
    GraphScheme
} from '../tools/graphtools'

import { finalVerdictClauseV2 } from '../tools/graphdata'

export interface OrganNode extends CustomNodeObject {
    male_risk: number
    female_risk: number
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
                male_risk: 0,
                female_risk: 0,
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

export const expandGeneOrgans = async (
    driver: Driver | undefined,
     data:[any]
) => {
    console.log('---->Debug: expandGeneOrgans')
    data.forEach( async row => {
        console.log(row.type = 'gene', row.id)
        if ( row.type = 'gene') {
            let genes = await loadOrgans_filterby_gene(driver, 
                {
                    graphScheme: defaultGraphScheme,
                    geneFilter: row.id,
                } )
            console.log(genes)
        }
    })
    console.log('---->Debug: expandGeneOrgans - end')
}