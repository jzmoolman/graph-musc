
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
            const gene = row.get('g') 
            if (!ids.has(gene.properties.name)) {
                let node = { 
                    id: gene.identity,
                    name: gene.properties.name,
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
                link.source = gene.properties.name
            }
        
            const organ = row.get('o') 
            if (!ids.has(organ.properties.name)) {
                let node = { 
                    id: organ.identity,
                    name: organ.properties.name,
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
                link.target = organ.properties.name
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
            const gene = row.get('g') 
            if (!ids.has(gene.properties.name)) {
                let node = { 
                    id: gene.identity,
                    name: gene.properties.name,
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
                link.target = gene.properties.name
            }
        
            const organ = row.get('o') 
            if (!ids.has(organ.properties.name)) {
                let node = { 
                    id: organ.identity,
                    name: organ.properties.name,
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
                link.source = organ.properties.name
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

export const  loadSyndromeData = async (driver: Driver | undefined,
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
            const gene = row.get('g') 
            if (!ids.has(gene.properties.name)) {
                let node = { 
                    id: gene.identity,
                    name: gene.properties.name,
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
                link.target = gene.properties.name
            }
        
            const target = row.get('s') 
            if (!ids.has(target.properties.name)) {
                let node = { 
                    id: target.identity,
                    name: target.properties.name,
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
                link.source = target.properties.name
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