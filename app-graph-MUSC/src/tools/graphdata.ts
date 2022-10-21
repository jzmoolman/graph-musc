
import { GraphScheme, Force2DData, ArrayToStr, GeneNodeObject, SiteName, cardNCCNDataObject } from './graphtools'
import { Driver }  from  'neo4j-driver'
import { ControlCamera } from '@mui/icons-material'

const giOrgans = ['Colorectal', 'Esophagus', 'Gallbladder', 'Gastric', 'GI', 'Liver', 'Pancreas', 'Stomach',
'Small Bowel','UGI', 'UGI-Small Bowel', 'Bile Duct']

const getFinalVerdictClause = (finalVerdict: string) => {
    let whereClause = ''

    if ( finalVerdict === 'Confirmed' ) {
        whereClause = 'WHERE g.finalVerdict = 1'
    } else if ( finalVerdict === 'Maybe') {
        whereClause = 'WHERE g.finalVerdict = 9'
    } else if ( finalVerdict === 'Both' ) {
        whereClause = 'WHERE g.finalVerdict in [1,9]'
    } else {
        whereClause = 'WHERE g.finalVerdict in [0,1,9]'
    }
    return whereClause
}

const getSpecialityClause = (site: SiteName) => {
    let clause = ''
    switch ( site ) {
        case 'generic': {
            clause = '';
            break;
        }
        case 'gi': {
            //# GI Speciial
            clause = `WHERE o.name IN ${ArrayToStr(giOrgans)}` 
            break;
        }
    }
    return clause
}

export const loadSpecialistsByOrgan= async (
        driver: Driver | undefined, 
        onData?:(data:string[]
    )=> void
) => {

    let result: string[] = []
    if (driver == null) {
        console.log('Driver not loaded')
        return result
    }
    // const query = `MATCH (n:LKP_SPECIALISTS_BY_ORGAN)RETURN DISTINCT n.Organ_System as name ORDER BY name`  
    const query = `MATCH (n:LKP_SPECIALISTS_BY_ORGAN)RETURN WHERE n.PrimarySpecialist in ["Gynecology", "Urology"] DISTINCT n.PrimarySpecialist as name ORDER BY name`  

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
        site: SiteName, 
        onData?:(data:string[]
    )=> void
) => {

    let genes: string[] = []
    if (driver == null) {
        console.log('Driver not loaded')
        return genes
    }
    let whereCLAUSE: string =  `WHERE g.finalVerdict in [1]`
    switch ( site ) {
        case 'gi': {
            whereCLAUSE = whereCLAUSE + ` AND o.name in ${ArrayToStr(giOrgans)}`
        }
    }
    const query = `MATCH (g:MGene)-[:AFFECTS]->(o:Organ) ${whereCLAUSE} RETURN DISTINCT g.name as name ORDER BY name`  

    console.log('loadGenes ', query)
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
    site: SiteName,
    onData?:(data:string[])=> void
) => {

    let organs: string[] = []
    if (driver == null) {
        console.log('Driver not loaded')
        return organs
    }

    const query = `MATCH (o:Organ) ${getSpecialityClause(site)} RETURN DISTINCT o.name as name ORDER BY name`
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
    site: SiteName,
    onData:(data:string[])=> void
) => {

    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    let whereCLAUSE: string =  `WHERE g.finalVerdict in [1]`
    switch ( site ) {
        case 'gi': {
            whereCLAUSE = whereCLAUSE + ` AND g.name in ${ArrayToStr(await loadGene(driver, site))}`
        }
    }

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
    site: SiteName,
    onData:(data:string[])=> void
) => {

    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }
    
    let whereCLAUSE: string = getFinalVerdictClause('Both')  
    switch ( site ) {
        case 'gi': {
            whereCLAUSE = whereCLAUSE + ` AND g.name in ${ArrayToStr(await loadGene(driver, site))}`
        }
    }

    const query = `MATCH (g:MGene)-[r]->(s:Syndrome) ${whereCLAUSE}RETURN DISTINCT s.name as name ORDER BY name`
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
    finalVerdict: string,
    onCardData: (nccnData: any[])=> void
    ) => {

    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    const str_genes = ArrayToStr(genes)

    let whereCLAUSE = getFinalVerdictClause(finalVerdict)

    if ( str_genes !== '') {
        whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + str_genes
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
    site: SiteName, 
    genes: string[],
    organs: string[],
    finalVerdict: string,
    graphScheme : GraphScheme,
    onData:(data: Force2DData)=> void) => {

    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    const str_genes = ArrayToStr(genes)

    let whereCLAUSE = getFinalVerdictClause(finalVerdict)

    if ( str_genes !== '') {
        whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + str_genes
    }
    switch ( site ) {
        case 'gi': {
            if ( organs.length === 0 ) { 
                whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + ArrayToStr(await loadGene(driver,site))
            } else {
                whereCLAUSE = whereCLAUSE + ' AND o.name IN ' + ArrayToStr(organs)
            }
        }
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
            const source = row.get('g') 
            if (!ids.has(source.properties.name)) {
                let node: GeneNodeObject = { 
                    nodeType: 'gene',
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
                let node = { 
                    id: target.identity,
                    name: target.properties.name,
                    nodeType: 'organ',
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
    site: SiteName, 
    genes: string[],
    finalVerdict: string,
    graphScheme : GraphScheme,
    onData:(data: Force2DData)=> void) => {

    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    const str_genes = ArrayToStr(genes)

    let whereCLAUSE = getFinalVerdictClause(finalVerdict)
    
    if ( str_genes !== '') {
        whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + str_genes 
    }

    switch ( site ) {
        case 'gi': {
                whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + ArrayToStr(await loadGene(driver, site))
                break;
        }
    }
    
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
                let node = { 
                    nodeType: 'gene',
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
                let node = { 
                    nodeType: 'disease',
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
    site: SiteName,
    diseases: string[],
    genes: string[],
    finalVerdict: string,
    graphScheme : GraphScheme,
    onData:(data: Force2DData)=> void) => {
    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    const str_diseases = ArrayToStr(diseases)
    const str_genes = ArrayToStr(genes)

    let whereCLAUSE = getFinalVerdictClause(finalVerdict)
    
    if ( str_diseases !== '') {
        whereCLAUSE = whereCLAUSE + ' AND d.name IN ' + str_diseases
    }
    if ( str_genes !== '') {
        whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + str_genes
    }

    switch ( site ) {
        case 'gi': {
                whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + ArrayToStr(await loadGene(driver, site))
                break;
        }
    }
    
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
                let node = { 
                    nodeType: 'gene',
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
                let node = { 
                    nodeType: 'disease',
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
            if ( target.properties.subtype !== 'Unknown') {
                let link2  = { source: '', target: ''}
                link2.source = link.target
                
                if (!ids.has(target.properties.subtype)) {
                    let node = { 
                        nodeType: 'subtype',
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
    site: SiteName,
    genes: string[],
    organs: string[],
    finalVerdict : string,
    graphScheme : GraphScheme,
    onData:(data: Force2DData)=> void) => {


    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    const str_genes = ArrayToStr(genes)

    let whereCLAUSE = getFinalVerdictClause(finalVerdict)

    if ( str_genes !== '') {
        whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + str_genes
    }
    
    switch ( site ) {
        case 'gi': {
            if ( organs.length === 0 ) { 
                whereCLAUSE = whereCLAUSE + ' AND o.name IN ' + ArrayToStr(await loadOrgan(driver, site))
            } else {
                whereCLAUSE = whereCLAUSE + ' AND o.name IN ' + ArrayToStr(organs)
            }
            break
        }
        default: { 
            if ( organs.length !== 0 ) { 
                whereCLAUSE = whereCLAUSE + ' AND o.name IN ' + ArrayToStr(organs)
            }
        }
    }
    const query = `MATCH (g:MGene)-[r]->(o:Organ) ${whereCLAUSE} RETURN g,r,o`

    console.log('Orgran-Gene', query)

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
                let node = { 
                    nodeType: 'organ',
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
                let node = { 
                    nodeType: 'gene',
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
    site: SiteName,
    diseases: string[],
    genes: string[],
    finalVerdict: string,
    graphScheme : GraphScheme,
    onData:(data: Force2DData)=> void) => {
    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    const str_diseases = ArrayToStr(diseases)
    const str_genes = ArrayToStr(genes)

    let whereCLAUSE = getFinalVerdictClause(finalVerdict)
    
    if ( str_diseases !== '') {
        whereCLAUSE = whereCLAUSE + ' AND d.name IN ' + str_diseases
    }
    if ( str_genes !== '') {
        whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + str_genes
    }

    switch ( site ) {
        case 'gi': {
                whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + ArrayToStr(await loadGene(driver, site))
                // whereCLAUSE = whereCLAUSE + ' AND o.name IN ' + ArrayToStr(giOrgans)
                break;
        }
    }
    const query = 
        `MATCH (g:MGene)-[r:CAUSE]->(d:Disease) MATCH(g)-[:AFFECTS]->(o:Organ) ${whereCLAUSE} RETURN g,r,d,o`

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
                let node = { 
                    nodeType: 'gene',
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
                let node = { 
                    nodeType: 'disease',
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
    site: SiteName,
    syndromes: string[],
    finalVerdict:string,
    graphScheme : GraphScheme,
    onData:(data: Force2DData)=> void) => {

    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    const str_syndrome = ArrayToStr(syndromes)

    let whereCLAUSE = getFinalVerdictClause(finalVerdict)

    if ( str_syndrome !== '') {
        whereCLAUSE = whereCLAUSE + ' AND s.name IN ' + str_syndrome
    }
    
    switch ( site ) {
        case 'gi': {
                whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + ArrayToStr(await loadGene(driver, site))
                break;
        }
    }
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
                let node = { 
                    id: source.identity,
                    name: source.properties.name,
                    hereditaryType: source.properties.hereditaryType,
                    nodeType: 'syndrome',
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
                let node = { 
                    nodeType: 'disease',
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
    site: SiteName,
    syndromes: string[],
    finalVerdict:string,
    graphScheme : GraphScheme,
    onData:(data: Force2DData)=> void) => {

    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    const str_syndrome = ArrayToStr(syndromes)

    let whereCLAUSE = getFinalVerdictClause(finalVerdict)

    if ( str_syndrome !== '') {
        whereCLAUSE = whereCLAUSE + ' AND s.name IN ' + str_syndrome
    }
    
    switch ( site ) {
        case 'gi': {
                whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + ArrayToStr(await loadGene(driver, site))
                break;
        }
    }
    const query = `MATCH (g:MGene)-[:ATTR]->(s:Syndrome)-[:ATTR2]->(sv:SyndromeVerbiage)` +
        ` MATCH (g)-[:CAUSE]->(d:Disease)` +
        ` MATCH (g)-[:AFFECTS]->(o:Organ)` + 
        ` ${whereCLAUSE} RETURN g,s,sv,d`

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
                let node = { 
                    id: source.identity,
                    name: source.properties.name,
                    hereditaryType: source.properties.hereditaryType,
                    nodeType: 'syndrome',
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
                let node = { 
                    nodeType: 'gene',
                    id: target.identity,
                    name: target.properties.name,
                    fullName: target.properties.fullName,
                    geneAltName: target.properties.altName,
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
                let node = { 
                    nodeType: 'disease',
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