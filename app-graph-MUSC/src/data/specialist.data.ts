export const getPreferredGenesBySpecialist = (
        specialist: string,
 ) => {

    let result: string[] = ['BRCA2']
    switch (specialist) {
        case 'Breast Surgery': result = ['BRCA2']; break
        case 'Colorectal surgery': result = ['CHEK2','EPCAM']; break
        case 'Dermatology': return result = ['PTEN','PMS2']; break
        case 'Endocrine Surgery': return result = ['MEN1', 'FH']; break
        case 'Endocrinology': return result = ['APC', 'TP53']; break
        case 'Gastroenterology': return result = ['MLH1', 'MSH2']; break
        case 'Gynecologic Oncology': return result = ['BRCA1', 'BRCA2']; break
        case 'Hepatobiliary Surgery': return result = ['BRCA1', 'BRCA2']; break
        case 'Neurosurgery': return result = ['BRCA1', 'APC']; break //ERRORR WIH ONE???
        case 'Ophthalmology': return result = ['BAP1', 'BRCA2']; break 
        case 'Orthopedic Oncology': return result = ['TP53', 'BRCA2']; break 
        case 'Pediatric surgery': return result = ['BAP1', 'BRCA2']; break // No data???
        case 'Pulmonology': return result = ['MEN1', 'TERT']; break
        case 'Surgical Oncology': return result = ['PTEN', 'RB1']; break
        case 'Thoracic': return result = ['PTEN', 'CHEK2']; break
        case 'Urology': return result = ['MLH1','MSH2']; break
    }
    return result
}

export const getPreferredOrgansBySpecialist = (
        specialist: string,
 ) => {
    let result: string[] = ['Breast']
    switch (specialist) {

        case 'Breast Surgery': result = ['Breast']; break
        case 'Colorectal surgery': result = ['Colorectal']; break
        case 'Dermatology': return result = ['Skin','PMS2']; break
        case 'Endocrine Surgery': return result = ['Adrenal']; break
        case 'Endocrinology': return result = ['Adrenal']; break
        case 'Gastroenterology': return result = ['Small Bowel', 'Liver']; break
        case 'Gynecologic Oncology': return result = ['BRCA1', 'BRCA2']; break
        case 'Hepatobiliary Surgery': return result = ['BRCA1', 'BRCA2']; break
        case 'Neurosurgery': return result = ['BRCA1', 'APC']; break //ERRORR WIH ONE???
        case 'Ophthalmology': return result = ['BAP1', 'BRCA2']; break 
        case 'Orthopedic Oncology': return result = ['TP53', 'BRCA2']; break 
        case 'Pediatric surgery': return result = ['BAP1', 'BRCA2']; break // No data???
        case 'Pulmonology': return result = ['MEN1', 'TERT']; break
        case 'Surgical Oncology': return result = ['PTEN', 'RB1']; break
        case 'Thoracic': return result = ['Thyroid']; break
        case 'Urology': return result = ['MLH1','MSH2']; break

    }
    
    return result
}

export const getPreferredDiseaseBySpecialist = (
        specialist: string,
 ) => {

    let result: string[] = ['Breast Cancer']
    switch (specialist) {
        case 'Breast Surgery': result = ['Breast Cancer', ]; break
        case 'Colorectal surgery': result = ['Skin (Benign)','Brain Tumor']; break
        case 'Dermatology': return result = ['Skin (Benign)','Brain Tumor']; break
        case 'Endocrinology': return result = ['Skin (Benign)','Brain Tumor']; break
        case 'Endocrine Surgery': return result = ['Eye (Benign)']; break
        case 'Endocrinology': return result = ['Adrenal']; break
        case 'Gastroenterology': return result = ['Skin (Benign)']; break
        case 'Gynecologic Oncology': return result = ['BRCA1', 'BRCA2']; break
        case 'Hepatobiliary Surgery': return result = ['BRCA1', 'BRCA2']; break
        case 'Neurosurgery': return result = ['BRCA1', 'APC']; break //ERRORR WIH ONE???
        case 'Ophthalmology': return result = ['BAP1', 'BRCA2']; break 
        case 'Orthopedic Oncology': return result = ['TP53', 'BRCA2']; break 
        case 'Pediatric surgery': return result = ['BAP1', 'BRCA2']; break // No data???
        case 'Pulmonology': return result = ['MEN1', 'TERT']; break
        case 'Surgical Oncology': return result = ['PTEN', 'RB1']; break
        case 'Thoracic': return result = ['Thyroid Cancer']; break

        case 'Urology': return result = ['MLH1','MSH2']; break

    }
    
    return result
}
export const getPreferredSyndromeBySpecialist = (
        specialist: string,
 ) => {

    let result: string[] = ['Cowden Syndrome']
    switch (specialist) {
        case 'Breast Surgery': result = ['Cowden Syndrome']; break
        case 'Colorectal surgery': result = ['Cowden Syndrome','Lynch Syndrome']; break
        case 'Dermatology': return result = ['Lynch Syndrome']; break
        case 'Endocrine Surgery': return result = ['Lynch Syndrome']; break
        case 'Endocrinology': return result = ['Watson Syndrome']; break
        case 'Gastroenterology': return result = ['Lynch Syndrome']; break
        case 'Gynecologic Oncology': return result = ['BRCA1', 'BRCA2']; break
        case 'Hepatobiliary Surgery': return result = ['BRCA1', 'BRCA2']; break
        case 'Neurosurgery': return result = ['BRCA1', 'APC']; break //ERRORR WIH ONE???
        case 'Ophthalmology': return result = ['BAP1', 'BRCA2']; break 
        case 'Orthopedic Oncology': return result = ['TP53', 'BRCA2']; break 
        case 'Pediatric surgery': return result = ['BAP1', 'BRCA2']; break // No data???
        case 'Pulmonology': return result = ['MEN1', 'TERT']; break
        case 'Surgical Oncology': return result = ['PTEN', 'RB1']; break
        case 'Thoracic': return result = ['Gorlin Syndrome']; break
        case 'Urology': return result = ['Lynch Syndrome']; break
    }
    return result
}