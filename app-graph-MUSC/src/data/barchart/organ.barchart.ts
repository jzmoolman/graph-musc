import { OrganPenetranceNode, defaultGraphSchemeV2 } from "../forcegraph/types.forcegraph";
import { GeneNode } from "../forcegraph/types.forcegraph";
import { Gene } from "../gene.neo4j";
import { Penetrance } from "../neo4j/_relationships_.neo4j";
import { GeneAffectPenetranceOrgan } from "../neo4j/gene-_-organ.neo4j";
import { Organ } from "../organ.neo4j";




export type GeneBarChart = Gene & {
    organs: OrganBarChart[]
}

export type OrganBarChart = Organ &  Penetrance  & {

}

export const build_gene_organ_barchart = (gender: string, data: GeneAffectPenetranceOrgan[]) => {
    if (data.length === 0 ) {
        return undefined
    }

    let result : GeneBarChart = {
        ...data[0].gene,
        organs: [],
    }

    data.forEach(gene_affect_risk_organ => {

        // if ( result.name !== gene_affect_risk_organ.gene.name  ) { 
        //     //error data contain more than one organ!!!
        //     return result
        // }

        let organBarChart: OrganBarChart

        if (gene_affect_risk_organ.relation.type === 'RISK') {
            // const penetrance = gene_affect_risk_organ.relation as Penetrance
            // console.log('---->Debug: gene-_organ.forcegraph penetrance', penetrance)
            organBarChart = {
                ...gene_affect_risk_organ.organ,
                ...gene_affect_risk_organ.relation as Penetrance,
            }
            result.organs.push(organBarChart)

        }
    })
    return result
}