
import { GraphScheme, Force2DData, ArrayToStr } from '../tools/graphtools'
import { Driver }  from  'neo4j-driver'

export const  loadGeneData = async (driver: Driver | undefined,
    verified: boolean,
    genes: string[],
    organs: string[],
    graphScheme : GraphScheme,
    onData:(data: Force2DData)=> void) => {
    console.log('enter - loadData')
    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    const str_genes = ArrayToStr(genes)
    const str_organs = ArrayToStr(organs)

    let whereCLAUSE = ''
    
    if ( verified ) {
        whereCLAUSE = 'WHERE g.FinalVerdict = 1'
    } else {
        whereCLAUSE = 'WHERE g.FinalVerdict = 0'
    }
    console.log(genes, organs)
    if ( str_genes !== '') {
        whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + str_genes
    }
    if ( str_organs !== '') {
        whereCLAUSE = whereCLAUSE + ' AND o.name IN ' + str_organs
    }
    const query = `MATCH (g:MGene)-[r]->(o:Organ) ${whereCLAUSE} RETURN g,r,o`

    console.log('Gene->Orgran', query)

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
                    id: source.identity,
                    name: source.properties.name,
                    nodeType: 'Gene',
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
        console.log(nodes) 
        console.log(links) 
        console.log('Data loaded')
        session.close();
        console.log('nodes', nodes)
        onData( {nodes, links} )
    } catch (e) {
        throw e
    }
    finally {
        await session.close()

    }
}


export const  loadOrganData = async (driver: Driver | undefined,
    verified: boolean,
    genes: string[],
    organs: string[],
    graphScheme : GraphScheme,
    onData:(data: Force2DData)=> void) => {
    console.log('enter - loadData')
    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    const str_genes = ArrayToStr(genes)
    const str_organs = ArrayToStr(organs)

    let whereCLAUSE = ''
    
    if ( verified ) {
        whereCLAUSE = 'WHERE g.FinalVerdict = 1'
    } else {
        whereCLAUSE = 'WHERE g.FinalVerdict = 0'
    }
    console.log(genes, organs)
    if ( str_genes !== '') {
        whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + str_genes
    }
    if ( str_organs !== '') {
        whereCLAUSE = whereCLAUSE + ' AND o.name IN ' + str_organs
    }
    const query = `MATCH (g:MGene)-[r]->(o:Organ) ${whereCLAUSE} RETURN g,r,o`

    console.log('Gene->Orgran', query)

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
                    id: source.identity,
                    name: source.properties.name,
                    nodeType: 'Organ',
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
                    id: target.identity,
                    name: target.properties.name,
                    nodeType: 'Gene',
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
        console.log('Data loaded')
        console.log(nodes) 
        console.log(links) 
        session.close();
        onData( {nodes, links} )
    } catch (e) {
        throw e
    }
    finally {
        await session.close()

    }
}

export const  loadSyndromeGeneData = async (driver: Driver | undefined,
    verified: boolean,
    syndromes: string[],
    genes: string[],
    graphScheme : GraphScheme,
    onData:(data: Force2DData)=> void) => {
    console.log('enter - loadData')
    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    const str_genes = ArrayToStr(genes)
    const str_syndrome = ArrayToStr(syndromes)

    let whereCLAUSE = ''
    
    if ( verified ) {
        whereCLAUSE = 'WHERE g.FinalVerdict = 1'
    } else {
        whereCLAUSE = 'WHERE g.FinalVerdict = 0'
    }
    console.log(genes, genes)
    if ( str_genes !== '') {
        whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + str_genes
    }
    if ( str_syndrome !== '') {
        whereCLAUSE = whereCLAUSE + ' AND s.name IN ' + str_syndrome
    }

    const query = `MATCH (g:MGene)-[r]->(s:Syndrome) ${whereCLAUSE} RETURN g,r,s`

    console.log('Syndrome->Gene', query)

    let session = driver.session()

    try {
        let res = await session.run(query)
        let ids = new  Set<string>()
        let nodes : any[] = []
        let links : any[] = []
        res.records.forEach(row => {
            let link  = { source: '', target: ''}
        
            const source = row.get('s') 
            if (!ids.has(source.properties.name)) {
                let node = { 
                    id: source.identity,
                    name: source.properties.name,
                    nodeType: 'Syndrome',
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
                    id: target.identity,
                    name: target.properties.name,
                    nameType: 'Gene',
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
        console.log(nodes) 
        console.log(links) 
        console.log('Data loaded')
        session.close();
        console.log('nodes', nodes)
        onData( {nodes, links} )
    } catch (e) {
        throw e
    }
    finally {
        await session.close()

    }
}

export const  loadSyndromeOrganData = async (
    driver: Driver | undefined,
    verified: boolean,
    syndromes: string[],
    organs: string[],
    graphScheme : GraphScheme,
    onData:(data: Force2DData)=> void) => {
    console.log('enter - loadData')
    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    const str_organs = ArrayToStr(organs)
    const str_syndrome = ArrayToStr(syndromes)

    let whereCLAUSE = ''
    
    if ( verified ) {
        whereCLAUSE = 'WHERE g.FinalVerdict = 1'
    } else {
        whereCLAUSE = 'WHERE g.FinalVerdict = 0'
    }
    console.log(organs, organs)
    if ( str_organs !== '') {
        whereCLAUSE = whereCLAUSE + ' AND o.name IN ' + str_organs
    }
    if ( str_syndrome !== '') {
        whereCLAUSE = whereCLAUSE + ' AND s.name IN ' + str_syndrome
    }

    const query = `MATCH (g:MGene)-[r]->(s:Syndrome), (g:MGene)-[r2]->(o:Organ) ${whereCLAUSE} RETURN o,r2,s`

    console.log('Syndrome->Gene', query)

    let session = driver.session()

    try {
        let res = await session.run(query)
        let ids = new  Set<string>()
        let nodes : any[] = []
        let links : any[] = []
        res.records.forEach(row => {
            let link  = { source: '', target: ''}
            const target = row.get('o') 
            if (!ids.has(target.properties.name)) {
                let node = { 
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
        
            const source = row.get('s') 
            if (!ids.has(source.properties.name)) {
                let node = { 
                    id: source.identity,
                    name: source.properties.name,
                    nameType: 'Syndrome',
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

            links.push(link)

        })
        console.log(nodes) 
        console.log(links) 
        console.log('Data loaded')
        session.close();
        console.log('nodes', nodes)
        onData( {nodes, links} )
    } catch (e) {
        throw e
    }
    finally {
        await session.close()

    }
}

export const  loadSyndromeGeneOrganData = async (
    driver: Driver | undefined,
    verified: boolean,
    syndromes: string[],
    genes: string[],
    organs: string[],
    graphScheme : GraphScheme,
    onData:(data: Force2DData)=> void) => {
    console.log('enter - loadData')
    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    const str_syndromes = ArrayToStr(syndromes)
    const str_genes = ArrayToStr(genes)
    const str_organs = ArrayToStr(organs)

    let whereCLAUSE = ''
    
    if ( verified ) {
        whereCLAUSE = 'WHERE g.FinalVerdict = 1'
    } else {
        whereCLAUSE = 'WHERE g.FinalVerdict = 0'
    }
    console.log(organs, organs)
    if ( str_organs !== '') {
        whereCLAUSE = whereCLAUSE + ' AND o.name IN ' + str_organs
    }
    if ( str_syndromes !== '') {
        whereCLAUSE = whereCLAUSE + ' AND s.name IN ' + str_syndromes
    }
    if ( str_genes !== '') {
        whereCLAUSE = whereCLAUSE + ' AND g.name IN ' + str_genes
    }

    const query = 
        `MATCH (g:MGene)-[r]->(s:Syndrome), (g:MGene)-[r2]->(o:Organ) ${whereCLAUSE} RETURN g,o,s`

    console.log('Syndrome->Gene-Organ', query)

    let session = driver.session()

    try {
        let res = await session.run(query)
        let ids = new  Set<string>()
        let nodes : any[] = []
        let links : any[] = []
        res.records.forEach(row => {
            let link1  = { source: '', target: ''}
            let source = row.get('s') 
            if (!ids.has(source.properties.name)) {
                let node = { 
                    id: source.identity,
                    name: source.properties.name,
                    nodeType: 'Symdrome',
                    nodeColor: graphScheme.syndromeNode,
                    fontColor: graphScheme.syndromeFont,
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

            let target = row.get('g') 
            if (!ids.has(target.properties.name)) {
                let node = { 
                    id: target.identity,
                    name: target.properties.name,
                    nodeType: 'Gene',
                    nodeColor: graphScheme.geneNode, 
                    fontColor: graphScheme.geneFont,
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
            // Do not push duplicate links
            console.log("link",link1)
            let link2 = { source: '', target: ''}

            link2.source = link1.target
            target = row.get('o') 
            if (!ids.has(target.properties.name)) {
                let node = { 
                    id: target.identity,
                    name: target.properties.name,
                    nodeType: 'Oragn',
                    nodeColor: graphScheme.organNode,
                    fontColor: graphScheme.organFont,
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
        console.log(nodes) 
        console.log(links) 
        console.log('Data loaded')
        session.close();
        console.log('nodes', nodes)
        onData( {nodes, links} )
    } catch (e) {
        throw e
    }
    finally {
        await session.close()

    }
}