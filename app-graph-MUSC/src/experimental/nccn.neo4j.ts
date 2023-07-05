import { Driver, }  from  'neo4j-driver'

import { 
    FinalVerdict,
    ArrayToStr }
from '../tools/graphtools'

export interface cardNCCNTableObjectV2 {
    organ_specialist: string
    gender: string
    modality: string
    recommendation: string
}

export interface cardNCCNDataObjectV2 {
    organ: string
    data: cardNCCNTableObjectV2[]
    footnote: string
    organ_specialist: string
}

const getFinalVerdictClause = (finalVerdict: FinalVerdict) => {
    let whereClause = ''
    if ( finalVerdict === 'Confirmed' ) {
        whereClause = 'WHERE g.finalVerdict = 1'
    } else if ( finalVerdict === 'Maybe') {
        whereClause = 'WHERE g.finalVerdict = 9'
    } else {
        whereClause = 'WHERE g.finalVerdict in [1,9]'
    }
    return whereClause
}

export const  loadNCCNDataV2 = async (
            driver: Driver | undefined,
            gene: string,
            finalVerdict: FinalVerdict,
            specialist: string,
            onCardData: (nccnData: any[])=> void
        ) => {

    if (driver == null) {
        console.log('error: Driver not loaded')
        return 
    }

    // let whereCLAUSE = getFinalVerdictClause(finalVerdict)
    let whereCLAUSE = 'WHERE 1=1\n'
    if ( gene !== '' ) { 
        whereCLAUSE +=  ` AND g.name = '${gene}'`
    }

    const query = `
    CALL apoc.cypher.run("
    MATCH (sp:LKP_SPECIALISTS_BY_ORGAN)<-[rsp:NCCN_ORGSPEC]-(n:NCCN_GUIDELINES)<-[rn:NCCN_MGENE]-(g:gene) 
    ${whereCLAUSE} 
    WITH n ORDER BY n.OrganSystem, n.Modality, n.Gender  RETURN n.OrganSystem as organ, COLLECT(DISTINCT {modality: n.Modality, gender: n.Gender, recommendation: n.OriginalAction}) as data, apoc.text.join([n.GuidelineBody, n.GuidelineName, n.GuidelineVersion, n.GuidelineYear], '_') as footnote, toInteger(1) as organ_specialist 
    UNION 
    MATCH (sp1:LKP_SPECIALISTS_BY_ORGAN)<-[rsp:NCCN_ORGSPEC]-(n:NCCN_GUIDELINES)<-[rn:NCCN_MGENE]-(g:gene) 
    WITH collect(sp1.Organ_System) as OrganSystem
    MATCH (sp2:LKP_SPECIALISTS_BY_ORGAN)<-[rsp:NCCN_ORGSPEC]-(n2:NCCN_GUIDELINES)<-[rn:NCCN_MGENE]-(g:gene) 
    ${whereCLAUSE} AND not sp2.Organ_System in OrganSystem
    WITH n2 ORDER BY n2.OrganSystem, n2.Modality, n2.Gender  RETURN n2.OrganSystem as organ, COLLECT(DISTINCT {modality: n2.Modality, gender: n2.Gender, recommendation: n2.OriginalAction}) as data, apoc.text.join([n2.GuidelineBody, n2.GuidelineName, n2.GuidelineVersion, n2.GuidelineYear], '_') as footnote, toInteger(0) as organ_specialist
    ",
    {}) yield value
    WITH value.organ as organ, value.organ_specialist as organ_specialist, value.data as data, value.footnote as footnote
    RETURN organ, organ_specialist, data, footnote ORDER BY organ
    `

    console.log('---->Debug: nccn.neo4j query', query)

    let session = driver.session()

    try {
        let res = await session.run(query)
        let nccnData : cardNCCNDataObjectV2[] = []
        res.records.forEach(row => {
            let card: cardNCCNDataObjectV2 = { 
                organ: row.get("organ"),
                data: row.get("data"),
                footnote: row.get("footnote"),
                organ_specialist: row.get("organ_specialist"),
            }
            nccnData.push(card)
        })
        session.close();
        onCardData(nccnData);
    } catch (e) {
        throw e
    }
    finally {
        await session.close()

    }
}
