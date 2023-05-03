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
        case 'Urology': return result = ['BRCA1','BRCA2']; break
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
        case 'Dermatology': return result = ['Skin']; break
        case 'Endocrine Surgery': return result = ['Adrenal']; break
        case 'Endocrinology': return result = ['Adrenal']; break
        case 'Gastroenterology': return result = ['Small Bowel']; break
        case 'Gynecologic Oncology': return result = ['Ovary']; break
        case 'Hepatobiliary Surgery': return result = ['Pancreas']; break
        case 'Neurosurgery': return result = ['Brain']; break //ERRORR WIH ONE???
        case 'Ophthalmology': return result = ['Eye']; break 
        case 'Orthopedic Oncology': return result = ['Bone']; break 
        case 'Pediatric surgery': return result = ['Kidney']; break // No data???
        case 'Pulmonology': return result = ['Lung']; break
        case 'Surgical Oncology': return result = ['Gastric']; break
        case 'Thoracic': return result = ['Heart']; break
        case 'Urology': return result = ['Kidney']; break

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
        case 'Gynecologic Oncology': return result = ['Ovarian Cancer']; break
        case 'Hepatobiliary Surgery': return result = ['Breast Cancer']; break
        case 'Neurosurgery': return result = ['Bone Neoplasm']; break //ERRORR WIH ONE???
        case 'Ophthalmology': return result = ['Brain Tumor']; break 
        case 'Orthopedic Oncology': return result = ['Breast Cancer']; break 
        case 'Pediatric surgery': return result = ['Breast Cancer']; break // No data???
        case 'Pulmonology': return result = ['Breast Cancer']; break
        case 'Surgical Oncology': return result = ['Bladder Cancer']; break
        case 'Thoracic': return result = ['Thyroid Cancer']; break
        case 'Urology': return result = ['Brain Tumor']; break

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
        case 'Gynecologic Oncology': return result = ['Lynch Syndrome']; break
        case 'Hepatobiliary Surgery': return result = ['Gardner Syndrome']; break
        case 'Neurosurgery': return result = ['Cowden Syndrome']; break 
        case 'Ophthalmology': return result = ['Cowden Syndrome']; break 
        case 'Orthopedic Oncology': return result = ['Cowden Syndrome']; break 
        case 'Pediatric surgery': return result = ['Cowden Syndrome']; break
        case 'Pulmonology': return result = ['Frasier Syndrome']; break
        case 'Surgical Oncology': return result = ['Frasier Syndrome']; break
        case 'Thoracic': return result = ['Gorlin Syndrome']; break
        case 'Urology': return result = ['Lynch Syndrome']; break
    }
    return result
}