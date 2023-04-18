import { Driver }  from  'neo4j-driver'


// Forked from graphdata.ts


export const loadSpecialists = async (
        driver: Driver | undefined, 
        onData?:(data:string[])=> void
 ) => {

    let result: string[] = []
    if (driver == null) {
        console.log('Driver not loaded')
        return result
    }
    const query = `MATCH (n:LKP_SPECIALISTS_BY_ORGAN)\n \
    MATCH (o:LKP_SPECIALIST_WEBSITE)\n \
    WHERE n.PrimarySpecialist = o.PrimarySpecialist\n \
        AND o.ShowAsWebsite_1Yes = 1\n \
    RETURN DISTINCT n.PrimarySpecialist AS name ORDER BY name`

    // console.log('---->Debug query', query)

    let session = driver.session()
    try {
        let r = await session.run(query)
        result = r.records.map(row => {
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
