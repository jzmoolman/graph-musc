import { Driver }  from  'neo4j-driver'

// export const loadPreferredGenesBySpecialist = (
//         driver: Driver | undefined, 
//         specialist: string,
//  ) => {

//     let result: string[] = ['BRCA1','BRCA2']
//     if (driver == null) {
//         console.log('Driver not loaded')
//         return result
//     }
//     switch (specialist) {

//         case 'Breast Surgery': result = ['BRCA1','BRCA2']; break
//         case 'Colorectal surgery': result = ['CHEK2','EPCAM']; break
//         case 'Dermatology': return result = ['PTEN','PMS2']; break
//         case 'Endocrine Surgery': return result = ['MEN1', 'FH']; break
//         case 'Endocrinology': return result = ['APC', 'TP53']; break
//         case 'Gastroenterology': return result = ['MLH1', 'MSH2']; break
//         case 'Gynecologic Oncology': return result = ['BRCA1', 'BRCA2']; break
//         case 'Hepatobiliary Surgery': return result = ['BRCA1', 'BRCA2']; break
//         case 'Neurosurgery': return result = ['BRCA1', 'APC']; break //ERRORR WIH ONE???
//         case 'Ophthalmology': return result = ['BAP1', 'BRCA2']; break 
//         case 'Orthopedic Oncology': return result = ['TP53', 'BRCA2']; break 
//         case 'Pediatric surgery': return result = ['BAP1', 'BRCA2']; break // No data???
//         case 'Pulmonology': return result = ['MEN1', 'TERT']; break
//         case 'Surgical Oncology': return result = ['PTEN', 'RB1']; break
//         case 'Thoracic': return result = ['PTEN', 'CHEK2']; break
//         case 'Urology': return result = ['MLH1','MSH2']; break
//     }
    
//     return result
// }

// export const loadPreferredOrgansBySpecialist = (
//         driver: Driver | undefined, 
//         specialist: string,
//  ) => {

//     let result: string[] = ['Breast']
//     if (driver == null) {
//         console.log('Driver not loaded')
//         return result
//     }
//     switch (specialist) {

//         case 'Breast Surgery': result = ['Breast']; break
//         case 'Colorectal surgery': result = ['Colorectal']; break
//         case 'Dermatology': return result = ['Skin','PMS2']; break
//         case 'Endocrine Surgery': return result = ['Adrenal']; break
//         case 'Endocrinology': return result = ['Adrenal']; break

//         case 'Gastroenterology': return result = ['Small Bowel', 'Liver']; break
//         case 'Gynecologic Oncology': return result = ['BRCA1', 'BRCA2']; break
//         case 'Hepatobiliary Surgery': return result = ['BRCA1', 'BRCA2']; break
//         case 'Neurosurgery': return result = ['BRCA1', 'APC']; break //ERRORR WIH ONE???
//         case 'Ophthalmology': return result = ['BAP1', 'BRCA2']; break 
//         case 'Orthopedic Oncology': return result = ['TP53', 'BRCA2']; break 
//         case 'Pediatric surgery': return result = ['BAP1', 'BRCA2']; break // No data???
//         case 'Pulmonology': return result = ['MEN1', 'TERT']; break
//         case 'Surgical Oncology': return result = ['PTEN', 'RB1']; break
//         case 'Thoracic': return result = ['Thyroid']; break

//         case 'Urology': return result = ['MLH1','MSH2']; break

//     }
    
//     return result
// }

// export const loadPreferredDiseaseBySpecialist = (
//         driver: Driver | undefined, 
//         specialist: string,
//  ) => {

//     let result: string[] = ['Breast Cancer']
//     if (driver == null) {
//         console.log('Driver not loaded')
//         return result
//     }
//     switch (specialist) {

//         case 'Breast Surgery': result = ['Breast Cancer', ]; break
//         case 'Colorectal surgery': result = ['Skin (Benign)','Brain Tumor']; break
//         case 'Dermatology': return result = ['Skin (Benign)','Brain Tumor']; break
//         case 'Endocrinology': return result = ['Skin (Benign)','Brain Tumor']; break
//         case 'Endocrine Surgery': return result = ['Eye (Benign)']; break
//         case 'Endocrinology': return result = ['Adrenal']; break
//         case 'Gastroenterology': return result = ['Skin (Benign)']; break

//         case 'Gynecologic Oncology': return result = ['BRCA1', 'BRCA2']; break
//         case 'Hepatobiliary Surgery': return result = ['BRCA1', 'BRCA2']; break
//         case 'Neurosurgery': return result = ['BRCA1', 'APC']; break //ERRORR WIH ONE???
//         case 'Ophthalmology': return result = ['BAP1', 'BRCA2']; break 
//         case 'Orthopedic Oncology': return result = ['TP53', 'BRCA2']; break 
//         case 'Pediatric surgery': return result = ['BAP1', 'BRCA2']; break // No data???
//         case 'Pulmonology': return result = ['MEN1', 'TERT']; break
//         case 'Surgical Oncology': return result = ['PTEN', 'RB1']; break
//         case 'Thoracic': return result = ['Thyroid Cancer']; break

//         case 'Urology': return result = ['MLH1','MSH2']; break

//     }
    
//     return result
// }
// export const loadPreferredSyndromeBySpecialist = (
//         driver: Driver | undefined, 
//         specialist: string,
//  ) => {

//     let result: string[] = ['Cowden Syndrome']
//     if (driver == null) {
//         console.log('Driver not loaded')
//         return result
//     }
//     switch (specialist) {

//         case 'Breast Surgery': result = ['Cowden Syndrome']; break
//         case 'Colorectal surgery': result = ['Cowden Syndrome','Lynch Syndrome']; break
//         case 'Dermatology': return result = ['Lynch Syndrome']; break
//         case 'Endocrine Surgery': return result = ['Lynch Syndrome']; break
//         case 'Endocrinology': return result = ['Watson Syndrome']; break
//         case 'Gastroenterology': return result = ['Lynch Syndrome']; break

//         case 'Gynecologic Oncology': return result = ['BRCA1', 'BRCA2']; break
//         case 'Hepatobiliary Surgery': return result = ['BRCA1', 'BRCA2']; break
//         case 'Neurosurgery': return result = ['BRCA1', 'APC']; break //ERRORR WIH ONE???
//         case 'Ophthalmology': return result = ['BAP1', 'BRCA2']; break 
//         case 'Orthopedic Oncology': return result = ['TP53', 'BRCA2']; break 
//         case 'Pediatric surgery': return result = ['BAP1', 'BRCA2']; break // No data???
//         case 'Pulmonology': return result = ['MEN1', 'TERT']; break
//         case 'Surgical Oncology': return result = ['PTEN', 'RB1']; break
//         case 'Thoracic': return result = ['Gorlin Syndrome']; break


//         case 'Urology': return result = ['Lynch Syndrome']; break
        
//     }
    
//     return result
// }

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
    console.log('---->Debug query', query)

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
