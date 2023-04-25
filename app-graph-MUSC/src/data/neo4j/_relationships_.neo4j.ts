
export type Relation = {
    type: string,
}

export type Cause =  Relation & {
    id: string,
    gender: string,
    finalVerdict: number,
    diseaseName: string,
    diseaseType: string,
    predominantCancerSubType: string,
}


export type Affect =   Relation &  {
    id: string,
    gender: string,
    finalVerdict: number,
    diseaseName: string,
    diseaseType: string,
    predominantCancerSubType: string,
}

export type Penetrance = Relation &  {
    id: string,
    gender: string,
    risk: number,
    population_gender: string,
    population_risk: number,
}