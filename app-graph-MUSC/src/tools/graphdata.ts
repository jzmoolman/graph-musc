
import { GraphScheme, Force2DData, ArrayToStr, applayFilter, GeneNodeObject, cardNCCNDataObject, CustomNodeObject, SubtypeNodeObject, SyndromeNodeObject } from './graphtools'
import { Driver }  from  'neo4j-driver'

export type FinalVerdict = 'Confirmed' | 'Maybe' | 'Both'


const getPreferredGenes =  (specialist: string) => {
    let list : string[] = []
    switch (specialist) {
        case 'Generic': list = ['BRCA1', 'BRCA2']; break;
    }
    return list;
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

export const loadSpecialists = async (
        driver: Driver | undefined, 
        onData?:(data:string[]
    )=> void
) => {

    let result: string[] = []
    if (driver == null) {
        console.log('Driver not loaded')
        return result
    }
    const query = `MATCH (n:LKP_SPECIALISTS_BY_ORGAN) MATCH (o:LKP_SPECIALIST_WEBSITE) WHERE n.PrimarySpecialist = o.PrimarySpecialist AND o.ShowAsWebsite_1Yes = 1   RETURN DISTINCT n.PrimarySpecialist as name  ORDER BY name`
    let session = driver.session()
    try {
        let res = await session.run(query)
        result = res.records.map(row => {
            return row.get('name')
        })
        session.close();
        if (onData !== undefined) {
            onData( result )
        }
    } catch (e) {
        throw e
    }
    finally {
        await session.close()
        return result
    }
}

export const loadGene= async (
        driver: Driver | undefined, 
        specialist: string, 
        onData?:(data:string[]
    )=> void
) => {

    let genes: string[] = []
    if (driver == null) {
        console.log('Driver not loaded')
        return genes
    }
    let whereCLAUSE: string =  `WHERE g.finalVerdict in [1]`
    if ( (specialist !== 'Generic') ) {
        whereCLAUSE = whereCLAUSE + ` AND o.name in ${ArrayToStr(await loadOrgan(driver, specialist))}`
    }

    const query = `MATCH (g:MGene)-[:AFFECTS]->(o:Organ) ${whereCLAUSE} RETURN DISTINCT g.name as name ORDER BY name`  

    let session = driver.session()
    try {
        let res = await session.run(query)
        genes = res.records.map(row => {
            return row.get('name')
        })
        session.close();
        if (onData !== undefined) {
            onData( genes )
        }
    } catch (e) {
        throw e
    }
    finally {
        await session.close()
    
        return genes
    }
}

export const loadOrgan= async (
    driver: Driver | undefined, 
    specialist: string,
    onData?:(data:string[])=> void
) => {

    let organs: string[] = []
    if (driver == null) {
        console.log('Driver not loaded')
        return organs
    }

    let query = ''
    if (specialist == 'Generic') {
        query = `MATCH (o:Organ) RETURN DISTINCT o.name as name ORDER BY name`
    } else {
        query = `MATCH (o:Organ) MATCH (n:LKP_SPECIALISTS_BY_ORGAN) WHERE o.name = n.Organ_System AND n.PrimarySpecialist ="${specialist}"  RETURN DISTINCT o.name as name ORDER BY name`
    }
    let session = driver.session()
    try {
        let res = await session.run(query)
        organs = 
        res.records.map(row => {
            return row.get('name')
        })
        session.close();
        if (onData !== undefined) {
            onData( organs )
        }

    } catch (e) {
        throw e
    }
    finally {
        await session.close()
        return organs
    }
}

export const loadDisease= async (
    driver: Driver | undefined, 
    specialist: string,
    onData:(data:string[])=> void
) => {

    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    let whereCLAUSE: string =  `WHERE g.finalVerdict in [1]`
    whereCLAUSE = whereCLAUSE + ` AND g.name in ${ArrayToStr(await loadGene(driver, specialist))}`

    const query =  `MATCH (g:MGene)-[r:CAUSE]->(d:Disease) ${whereCLAUSE} RETURN DISTINCT d.name as name ORDER BY name`

    let session = driver.session()

    try {
        let res = await session.run(query)
        const genes: string[] = 
        res.records.map(row => {
            return row.get('name')
        })
        session.close();
        onData( genes )
    } catch (e) {
        throw e
    }
    finally {
        await session.close()
    }
}

export const loadSyndrome= async (
    driver: Driver | undefined,
    specialist: string,
    onData:(data:string[])=> void
) => {

    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }
    
    let whereCLAUSE: string = getFinalVerdictClause('Both')  
    whereCLAUSE = whereCLAUSE + ` AND g.name in ${ArrayToStr(await loadGene(driver, specialist))}`

    const query = `MATCH (g:MGene)-[r]->(s:Syndrome) ${whereCLAUSE} RETURN DISTINCT s.name as name ORDER BY name`
    let session = driver.session()

    try {
        let res = await session.run(query)
        const genes: string[] = 
        res.records.map(row => {
            return row.get('name')
        })
        session.close();
        onData( genes )
    } catch (e) {
        throw e
    }
    finally {
        await session.close()
    }
}

export const  loadNCCNData = async (driver: Driver | undefined,
    genes: string[],
    finalVerdict: FinalVerdict,
    onCardData: (nccnData: any[])=> void
    ) => {

    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    let whereCLAUSE = getFinalVerdictClause(finalVerdict)

    if ( genes.length !== 0 ) { 
        whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + ArrayToStr(genes)
    }
    
    const query = `MATCH (n:NCCN_GUIDELINES)<-[rn:NCCN_MGENE]-(g:MGene) ${whereCLAUSE} WITH n ORDER BY n.OrganSystem, n.Modality, n.Gender RETURN n.OrganSystem as organ, COLLECT({modality: n.Modality, gender: n.Gender, recommendation: n.OriginalAction}) as data, apoc.text.join([n.GuidelineBody, n.GuidelineName, n.GuidelineVersion, n.GuidelineYear], '_') as footnote
    `
    let session = driver.session()

    try {
        let res = await session.run(query)
        let nccnData : any[] = []
        res.records.forEach(row => {
            let card: cardNCCNDataObject = { 
                organ: row.get("organ"),
                data: row.get("data"),
                footnote: row.get("footnote"),
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

export const  loadGeneOrganData = async (
    driver: Driver | undefined,
    specialist: string, 
    genes: string[],
    organs: string[],
    finalVerdict: FinalVerdict,
    graphScheme : GraphScheme,
    onData:(data: Force2DData)=> void) => {

    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    let whereCLAUSE = getFinalVerdictClause(finalVerdict)

    const geneSpecialistList = await loadGene(driver, specialist)
    const geneSpecialistFilteredList = applayFilter(geneSpecialistList, genes)
    if (geneSpecialistFilteredList.length == 0 ) {
        console.log('The intersect of list and filter is nil and therefore the result is empty.')
        return []
    }
    
    whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + ArrayToStr(geneSpecialistFilteredList)

    const query = `MATCH (g:MGene)-[r]->(o:Organ) ${whereCLAUSE} RETURN g,r,o`
                                                         console.log("gene-organ", query)

    let session = driver.session()

    try {
        let res = await session.run(query)
        let ids = new  Set<string>()
        let nodes : any[] = []
        let links : any[] = []
        res.records.forEach(row => {
            let link  = { source: '', target: ''}
            const source = row.get('g') 
            if (!ids.has(source.properties.name)) {
                let node: GeneNodeObject = { 
                    nodeType: 'Gene',
                    id: source.identity,
                    name: source.properties.name,
                    fullName: source.properties.fullName,
                    altName: source.properties.altName,
                    description: source.properties.description,
                    nodeColor: graphScheme.geneNode, 
                    fontColor: graphScheme.geneFont,
                    nodeVal: graphScheme.nodeVal,
                    nodeRelSize: graphScheme.nodeRelSize,
                    scaleFont: graphScheme.scaleFont
                }
                nodes.push(node) 
                link.source = node.name
                ids.add(node.name)
            } else {
                link.source = source.properties.name
            }
        
            const target = row.get('o') 
            if (!ids.has(target.properties.name)) {
                let node: CustomNodeObject = { 
                    id: target.identity,
                    name: target.properties.name,
                    nodeType: 'Organ',
                    nodeColor: graphScheme.organNode,
                    fontColor: graphScheme.organFont,
                    nodeVal: graphScheme.nodeVal,
                    nodeRelSize: graphScheme.nodeRelSize,
                    scaleFont: graphScheme.scaleFont
                }
                nodes.push(node) 
                link.target = node.name
                ids.add(node.name)
            } else {
                link.target = target.properties.name
            }

            links.push(link)

        })
        session.close();
        onData( {nodes, links} )
    } catch (e) {
        throw e
    }
    finally {
        await session.close()

    }
}

export const  loadGeneDiseaseData = async (
    driver: Driver | undefined,
    specialist: string, 
    genes: string[],
    finalVerdict: FinalVerdict,
    graphScheme : GraphScheme,
    onData:(data: Force2DData)=> void) => {

    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }


    let whereCLAUSE = getFinalVerdictClause(finalVerdict)
    
    if ( genes.length > 0) {
        whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + ArrayToStr(genes)
    }

    whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + ArrayToStr(await loadGene(driver, specialist))
    
    const query = 
        `MATCH (g:MGene)-[r:CAUSE]->(d:Disease) MATCH(g)-[:AFFECTS]->(o:Organ) ${whereCLAUSE} RETURN g,d,o`

    let session = driver.session()

    try {
        let res = await session.run(query)
        let ids = new  Set<string>()
        let nodes : any[] = []
        let links : any[] = []
        res.records.forEach(row => {
            let link1  = { source: '', target: ''}
            let source = row.get('g') 
            if (!ids.has(source.properties.name)) {
                let node: GeneNodeObject = { 
                    nodeType: 'Gene',
                    id: source.identity,
                    name: source.properties.name,
                    fullName: source.properties.fullName,
                    altName: source.properties.altName,
                    description: source.properties.description,
                    nodeColor: graphScheme.geneNode,
                    fontColor: graphScheme.geneFont,
                    nodeVal: graphScheme.nodeVal,
                    nodeRelSize: graphScheme.nodeRelSize,
                    scaleFont: graphScheme.scaleFont
                }
                nodes.push(node) 
                link1.source = node.name
                ids.add(node.name)
            } else {
                link1.source = source.properties.name
            }

            let target = row.get('d') 
            if (!ids.has(target.properties.name)) {
                let node: CustomNodeObject = { 
                    nodeType: 'Disease',
                    id: target.identity,
                    name: target.properties.name,
                    nodeColor: graphScheme.diseaseNode, 
                    fontColor: graphScheme.diseaseFont,
                    nodeVal: graphScheme.nodeVal,
                    nodeRelSize: graphScheme.nodeRelSize,
                    scaleFont: graphScheme.scaleFont
                }
                nodes.push(node) 
                link1.target = node.name
                ids.add(node.name)
            } else {
                link1.target = target.properties.name
            }
            links.push(link1)

        })
        session.close();
        onData( {nodes, links} )
    } catch (e) {
        throw e
    }
    finally {
        await session.close()

    }
}

export const  loadGeneDiseaseSubtypeData = async (
    driver: Driver | undefined,
    specialist: string,
    diseases: string[],
    genes: string[],
    finalVerdict: FinalVerdict,
    graphScheme : GraphScheme,
    onData:(data: Force2DData)=> void) => {
    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    let whereCLAUSE = getFinalVerdictClause(finalVerdict)
    
    if ( genes.length > 0) {
        whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + ArrayToStr(genes)
    }
    whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + ArrayToStr(await loadGene(driver, specialist))
    
    const query = 
        `MATCH (g:MGene)-[r:CAUSE]->(d:Disease) MATCH(g)-[:AFFECTS]->(o:Organ) ${whereCLAUSE} RETURN g,d,o`
    
    let session = driver.session()

    try {
        let res = await session.run(query)
        let ids = new  Set<string>()
        let nodes : any[] = []
        let links : any[] = []
        res.records.forEach(row => {
            let link  = { source: '', target: ''}

            const source = row.get('g') 
            if (!ids.has(source.properties.name)) {
                let node: GeneNodeObject = { 
                    nodeType: 'Gene',
                    id: source.identity,
                    name: source.properties.name,
                    fullName: source.properties.fullName,
                    altName: source.properties.altName,
                    description: source.properties.description,
                    nodeColor: graphScheme.geneNode,
                    fontColor: graphScheme.geneFont,
                    nodeVal: graphScheme.nodeVal,
                    nodeRelSize: graphScheme.nodeRelSize,
                    scaleFont: graphScheme.scaleFont
                }
                nodes.push(node) 
                link.source = node.name
                ids.add(node.name)
            } else {
                link.source = source.properties.name
            }

           let target = row.get('d') 
            if (!ids.has(target.properties.name)) {
                let node: CustomNodeObject = { 
                    nodeType: 'Disease',
                    id: target.identity,
                    name: target.properties.name,
                    nodeColor: graphScheme.diseaseNode, 
                    fontColor: graphScheme.diseaseFont,
                    nodeVal: graphScheme.nodeVal,
                    nodeRelSize: graphScheme.nodeRelSize,
                    scaleFont: graphScheme.scaleFont
                }
                nodes.push(node) 
                link.target = node.name
                ids.add(node.name)
            } else {
                link.target = target.properties.name
            }
            links.push(link)

            target = row.get('d') 
            if ( target.properties.subtype !== 'Unknown' && target.properties.subtype !== "") {
                let link2  = { source: '', target: ''}
                link2.source = link.target
                
                if (!ids.has(target.properties.subtype)) {
                    let node: SubtypeNodeObject = { 
                        nodeType: 'Subtype',
                        id: target.identity,
                        name: target.properties.subtype,
                        disease: target.properties.name,
                        nodeColor: graphScheme.diseaseSubtypeNode, 
                        fontColor: graphScheme.diseaseSubtypeFont,
                        nodeVal: graphScheme.nodeVal,
                        nodeRelSize: graphScheme.nodeRelSize,
                        scaleFont: graphScheme.scaleFont
                    }
                    nodes.push(node) 
                    link2.target = node.name
                    ids.add(node.name)
                } else {
                    link2.target = target.properties.subtype
                }
                links.push(link2)
            }

        })
        session.close();
        onData( {nodes, links} )
    } catch (e) {
        throw e
    }
    finally {
        await session.close()

    }
}

export const  loadOrganGeneData = async (
    driver: Driver | undefined,
    specialist: string,
    genes: string[],
    organs: string[],
    finalVerdict : FinalVerdict,
    graphScheme : GraphScheme,
    onData:(data: Force2DData)=> void) => {


    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    let whereCLAUSE = getFinalVerdictClause(finalVerdict)
    if ( organs.length === 0 ) { 
        whereCLAUSE = whereCLAUSE + ' AND o.name IN ' + ArrayToStr(await loadOrgan(driver, specialist))
    } else {
        whereCLAUSE = whereCLAUSE + ' AND o.name IN ' + ArrayToStr(organs)
    }
    const query = `MATCH (g:MGene)-[r]->(o:Organ) ${whereCLAUSE} RETURN g,r,o`

    let session = driver.session()

    try {
        let res = await session.run(query)
        let ids = new  Set<string>()
        let nodes : any[] = []
        let links : any[] = []
        res.records.forEach(row => {
            let link  = { source: '', target: ''}
        
            const source = row.get('o') 
            if (!ids.has(source.properties.name)) {
                let node: CustomNodeObject = { 
                    nodeType: 'Organ',
                    id: source.identity,
                    name: source.properties.name,
                    nodeColor: graphScheme.organNode,
                    fontColor: graphScheme.organFont,
                    nodeVal: graphScheme.nodeVal,
                    nodeRelSize: graphScheme.nodeRelSize,
                    scaleFont: graphScheme.scaleFont
                }
                nodes.push(node) 
                link.source = node.name
                ids.add(node.name)
            } else {
                link.source = source.properties.name
            }

            const target = row.get('g') 
            if (!ids.has(target.properties.name)) {
                let node: GeneNodeObject = { 
                    nodeType: 'Gene',
                    id: target.identity,
                    name: target.properties.name,
                    fullName: target.properties.fullName,
                    altName: target.properties.altName,
                    description: target.properties.description,
                    nodeColor: graphScheme.geneNode, 
                    fontColor: graphScheme.geneFont,
                    nodeVal: graphScheme.nodeVal,
                    nodeRelSize: graphScheme.nodeRelSize,
                    scaleFont: graphScheme.scaleFont
                }
                nodes.push(node) 
                link.target = node.name
                ids.add(node.name)
            } else {
                link.target = target.properties.name
            }
            links.push(link)

        })
        session.close();
        onData( {nodes, links} )
    } catch (e) {
        throw e
    }
    finally {
        await session.close()

    }
}
export const  loadDiseaseData = async (
    driver: Driver | undefined,
    specialist: string,
    diseases: string[],
    genes: string[],
    finalVerdict: FinalVerdict,
    graphScheme : GraphScheme,
    onData:(data: Force2DData)=> void) => {

        if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    const str_diseases = ArrayToStr(diseases)

    let whereCLAUSE = getFinalVerdictClause(finalVerdict)


    if ( genes.length > 0) {
        whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + ArrayToStr(genes) 
    }
    
    if ( diseases.length > 0) {
        whereCLAUSE = whereCLAUSE + ' AND d.name IN ' + str_diseases
    }

    whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + ArrayToStr(await loadGene(driver, specialist))

    const query = 
         `MATCH (g:MGene)-[r:CAUSE]->(d:Disease) ${whereCLAUSE} RETURN g,r,d`

    let session = driver.session()

    try {
        let res = await session.run(query)
        let ids = new  Set<string>()
        let nodes : any[] = []
        let links : any[] = []
        res.records.forEach(row => {
            let link1  = { source: '', target: ''}
            let source = row.get('g') 
            if (!ids.has(source.properties.name)) {
                let node: GeneNodeObject = { 
                    nodeType: 'Gene',
                    id: source.identity,
                    name: source.properties.name,
                    fullName: source.properties.fullName,
                    altName: source.properties.altName,
                    description: source.properties.description,
                    nodeColor: graphScheme.geneNode,
                    fontColor: graphScheme.geneFont,
                    nodeVal: graphScheme.nodeVal,
                    nodeRelSize: graphScheme.nodeRelSize,
                    scaleFont: graphScheme.scaleFont
                }
                nodes.push(node) 
                link1.source = node.name
                ids.add(node.name)
            } else {
                link1.source = source.properties.name
            }

            let target = row.get('d') 
            if (!ids.has(target.properties.name)) {
                let node: CustomNodeObject = { 
                    nodeType: 'Disease',
                    id: target.identity,
                    name: target.properties.name,
                    nodeColor: graphScheme.diseaseNode, 
                    fontColor: graphScheme.diseaseFont,
                    nodeVal: graphScheme.nodeVal,
                    nodeRelSize: graphScheme.nodeRelSize,
                    scaleFont: graphScheme.scaleFont
                }
                nodes.push(node) 
                link1.target = node.name
                ids.add(node.name)
            } else {
                link1.target = target.properties.name
            }
            links.push(link1)

        })
        session.close();
        onData( {nodes, links} )
    } catch (e) {
        throw e
    }
    finally {
        await session.close()

    }
}

export const  loadSyndromeDiseaseData = async (
    driver: Driver | undefined,
    specialist: string,
    syndromes: string[],
    finalVerdict: FinalVerdict,
    graphScheme : GraphScheme,
    onData:(data: Force2DData)=> void) => {

    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }


    let whereCLAUSE = getFinalVerdictClause(finalVerdict)

    if ( syndromes.length > 0) {
        whereCLAUSE = whereCLAUSE + ' AND s.name IN ' + ArrayToStr(syndromes)    
    }
    
    whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + ArrayToStr(await loadGene(driver, specialist))

    const query = `MATCH (g:MGene)-[:ATTR]->(s:Syndrome)-[:ATTR2]->(sv:SyndromeVerbiage)` +
        ` MATCH (g)-[:CAUSE]->(d:Disease)` +
        ` MATCH (g)-[:AFFECTS]->(o:Organ)` +
        ` ${whereCLAUSE} RETURN g,s,sv,d,o`

    let session = driver.session()

    try {
        let res = await session.run(query)
        let ids = new  Set<string>()
        let nodes : any[] = []
        let links : any[] = []
        res.records.forEach(row => {
            let link  = { source: '', target: ''}

            const source = row.get('sv') 
            if (!ids.has(source.properties.name)) {
                let node: SyndromeNodeObject = { 
                    nodeType: 'Syndrome',
                    id: source.identity,
                    name: source.properties.name,
                    hereditaryType: source.properties.hereditaryType,
                    nodeColor: graphScheme.syndromeNode,
                    fontColor: graphScheme.syndromeFont,
                    nodeVal: graphScheme.nodeVal,
                    nodeRelSize: graphScheme.nodeRelSize,
                    scaleFont: graphScheme.scaleFont
                }
                nodes.push(node) 
                link.source = node.name
                ids.add(node.name)
            } else {
                link.source = source.properties.name
            }

           let target = row.get('d') 
            if (!ids.has(target.properties.name)) {
                let node: CustomNodeObject = { 
                    nodeType: 'Disease',
                    id: target.identity,
                    name: target.properties.name,
                    nodeColor: graphScheme.diseaseNode, 
                    fontColor: graphScheme.diseaseFont,
                    nodeVal: graphScheme.nodeVal,
                    nodeRelSize: graphScheme.nodeRelSize,
                    scaleFont: graphScheme.scaleFont
                }
                nodes.push(node) 
                link.target = node.name
                ids.add(node.name)
            } else {
                link.target = target.properties.name
            }
            links.push(link)

        })
        session.close();
        onData( {nodes, links} )
    } catch (e) {
        throw e
    }
    finally {
        await session.close()

    }
}

export const  loadSyndromeGeneDiseaseData = async (
    driver: Driver | undefined,
    specialist: string,
    syndromes: string[],
    finalVerdict: FinalVerdict,
    graphScheme : GraphScheme,
    onData:(data: Force2DData)=> void) => {

    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    let whereCLAUSE = getFinalVerdictClause(finalVerdict)

    if ( syndromes.length > 0) {
        whereCLAUSE = whereCLAUSE + ' AND s.name IN ' + ArrayToStr(syndromes)    
    }
    
    whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + ArrayToStr(await loadGene(driver, specialist))

    const query = `MATCH (g:MGene)-[:ATTR]->(s:Syndrome)-[:ATTR2]->(sv:SyndromeVerbiage)` +
        ` MATCH (g)-[:CAUSE]->(d:Disease)` +
        ` MATCH (g)-[:AFFECTS]->(o:Organ)` + 
        ` ${whereCLAUSE} RETURN g, s, sv, d`

    let session = driver.session()

    try {
        let res = await session.run(query)
        let ids = new  Set<string>()
        let nodes : any[] = []
        let links : any[] = []
        res.records.forEach(row => {
            let link  = { source: '', target: ''}

            const source = row.get('sv') 
            if (!ids.has(source.properties.name)) {
                let node: SyndromeNodeObject = { 
                    nodeType: 'Syndrome',
                    id: source.identity,
                    name: source.properties.name,
                    hereditaryType: source.properties.hereditaryType,
                    nodeColor: graphScheme.syndromeNode,
                    fontColor: graphScheme.syndromeFont,
                    nodeVal: graphScheme.nodeVal,
                    nodeRelSize: graphScheme.nodeRelSize,
                    scaleFont: graphScheme.scaleFont
                }
                nodes.push(node) 
                link.source = node.name
                ids.add(node.name)
            } else {
                link.source = source.properties.name
            }

           let target = row.get('g') 
            if (!ids.has(target.properties.name)) {
                let node:GeneNodeObject = { 
                    nodeType: 'Gene',
                    id: target.identity,
                    name: target.properties.name,
                    fullName: target.properties.fullName,
                    altName: target.properties.altName,
                    description: target.properties.description,
                    nodeColor: graphScheme.geneNode, 
                    fontColor: graphScheme.geneFont,
                    nodeVal: graphScheme.nodeVal,
                    nodeRelSize: graphScheme.nodeRelSize,
                    scaleFont: graphScheme.scaleFont
                }
                nodes.push(node) 
                link.target = node.name
                ids.add(node.name)
            } else {
                link.target = target.properties.name
            }
            links.push(link)

            let link2  = { source: '', target: ''}
            link2.source = link.target
            
            target = row.get('d') 
            if (!ids.has(target.properties.name)) {
                let node:CustomNodeObject = { 
                    nodeType: 'Disease',
                    id: target.identity,
                    name: target.properties.name,
                    nodeColor: graphScheme.diseaseNode, 
                    fontColor: graphScheme.diseaseFont,
                    nodeVal: graphScheme.nodeVal,
                    nodeRelSize: graphScheme.nodeRelSize,
                    scaleFont: graphScheme.scaleFont
                }
                nodes.push(node) 
                link2.target = node.name
                ids.add(node.name)
            } else {
                link2.target = target.properties.name
            }
            links.push(link2)

        })
        session.close();
        onData( {nodes, links} )
    } catch (e) {
        throw e
    }
    finally {
        await session.close()

    }
}