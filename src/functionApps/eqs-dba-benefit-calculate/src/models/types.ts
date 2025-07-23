export interface StartProcessRequest {
    firstName: string;
    lastName: string;
    memberId: string;
    dateOfBirth: string;
    dateJoinedFund: string;
    effectiveDate: string;
    calculationDate: string;
    benefitClass: string;
    paymentType: string;
    planNumber: string;
    paymentTypeDesc: string;
}

export type VariableValue = {
  value:  string | number | boolean | Date
  type:  string | number | boolean | Date;
};

export interface CompleteTaskRequest {
    processInstanceId: string;
    variables: Record<string, VariableValue>;
}

export interface ProcessResponse {
    processInstanceId: string;
    taskId: string;
    requiredFields: RequiredField[];
}

export interface RequiredField {
    name: string;
    type: string;
    label?: string;
    required?: boolean;
}

export interface MemberData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    dateJoinedFund: string;
    memberId: string;
    effectiveDate: string;
    calculationDate: string;
    benefitClass: string;
    planNumber: string;
    paymentType: string;
    paymentTypeDesc: string;
    maxBenMult: string;
    othMult3: string;
    othMult5: string;
    sgMaxContBase: string;
    mbrSGM: string;
    SGM: string;
    fixedSpecSGMult: string;
    accRetMult_PriorDt: string;
    finalAvSal: string;
    discFactA: string;
    dateBenAccr: string;
    accBenMult: string;
    accRetMult: string;
    addtnlSG: string;
    addtnlSGAcct: string;
    addtnlVolDeath: string;
    compAddtnlAcct: string;
    cpiVal1: string;
    cpiVal2: string;
    dbOffsetAcct: string;
    deathMult: string;
    discFactB: string;
    discFactC: string;
    discFactD: string;
    empNotnlAcct: string;
    famLawAcctVal: string;
    fas_920630: string;
    fas_CalcDate: string;
    FutSrvc: string;
    interest: string;
    mbrAcct: string;
    mbrContAcct: string;
    mbrEquitShare: string;
    mbrVolAcct: string;
    notnlInitBal: string;
    notnlAcct: string;
    notnlSgAcct: string;
    notnlSgBal: string;
    othBen1: string;
    othBen2: string;
    othMult1: string;
    othMult2: string;
    othMult4: string;
    oteAddtnl: string;
    rolloverAcct: string;
    salary: string;
    sgAcct: string;
    srchrgAcct: string;
    vestFactA: string;
    sgNotionalAccount: string;
    memberContributions: string;
    finalAvSalForMrb2: string;
}

export interface SubProcessData {
    pymntAmt: string;
    minBenCheck: string;
    maxBenCheck: string;
    totalVolAcctsAdd: string;
    totalVolAcctsSub: string;
    totalVolAcctsNet: string;
}

export interface FinalResultResponse {
    success: boolean;
    message: string;
    processInstanceId: string;
    taskId: string | null;
    memberData: MemberData;
    subProcessData: SubProcessData;
}
