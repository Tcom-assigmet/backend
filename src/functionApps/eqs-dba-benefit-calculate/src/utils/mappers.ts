import { MemberData, SubProcessData, } from '../models/types';

export const getStringValue = (variables: Record<string, string >, key: string): string => {
    const value = variables[key];
    return value ? value.toString() : '';
};

export const mapToMemberData = (variables: Record<string, string >): MemberData => {
    return {
        firstName: getStringValue(variables, 'firstName'),
    lastName: getStringValue(variables, 'lastName'),
    dateOfBirth: getStringValue(variables, 'dateOfBirth'),
    dateJoinedFund: getStringValue(variables, 'dateJoinedFund'),
    memberId: getStringValue(variables, 'memberId'),
    effectiveDate: getStringValue(variables, 'effectiveDate'),
    calculationDate: getStringValue(variables, 'calculationDate'),
    benefitClass: getStringValue(variables, 'benefitClass'),
    planNumber: getStringValue(variables, 'planNumber'),
    paymentType: getStringValue(variables, 'paymentType'),
    paymentTypeDesc: getStringValue(variables, 'paymentTypeDesc'),
    maxBenMult: getStringValue(variables, 'maxBenMult'),
    othMult3: getStringValue(variables, 'othMult3'),
    othMult5: getStringValue(variables, 'othMult5'),
    sgMaxContBase: getStringValue(variables, 'sgMaxContBase'),
    mbrSGM: getStringValue(variables, 'mbrSGM'),
    SGM: getStringValue(variables, 'SGM'),
    fixedSpecSGMult: getStringValue(variables, 'fixedSpecSGMult'),
    accRetMult_PriorDt: getStringValue(variables, 'accRetMult_PriorDt'),
    finalAvSal: getStringValue(variables, 'finalAvSal'),
    discFactA: getStringValue(variables, 'discFactA'),
    dateBenAccr: getStringValue(variables, 'dateBenAccr'),
    accBenMult: getStringValue(variables, 'accBenMult'),
    accRetMult: getStringValue(variables, 'accRetMult'),
    addtnlSG: getStringValue(variables, 'addtnlSG'),
    addtnlSGAcct: getStringValue(variables, 'addtnlSGAcct'),
    addtnlVolDeath: getStringValue(variables, 'addtnlVolDeath'),
    compAddtnlAcct: getStringValue(variables, 'compAddtnlAcct'),
    cpiVal1: getStringValue(variables, 'cpiVal1'),
    cpiVal2: getStringValue(variables, 'cpiVal2'),
    dbOffsetAcct: getStringValue(variables, 'dbOffsetAcct'),
    deathMult: getStringValue(variables, 'deathMult'),
    discFactB: getStringValue(variables, 'discFactB'),
    discFactC: getStringValue(variables, 'discFactC'),
    discFactD: getStringValue(variables, 'discFactD'),
    empNotnlAcct: getStringValue(variables, 'empNotnlAcct'),
    famLawAcctVal: getStringValue(variables, 'famLawAcctVal'),
    fas_920630: getStringValue(variables, 'fas_920630'),
    fas_CalcDate: getStringValue(variables, 'fas_CalcDate'),
    FutSrvc: getStringValue(variables, 'FutSrvc'),
    interest: getStringValue(variables, 'interest'),
    mbrAcct: getStringValue(variables, 'mbrAcct'),
    mbrContAcct: getStringValue(variables, 'mbrContAcct'),
    mbrEquitShare: getStringValue(variables, 'mbrEquitShare'),
    mbrVolAcct: getStringValue(variables, 'mbrVolAcct'),
    notnlInitBal: getStringValue(variables, 'notnlInitBal'),
    notnlAcct: getStringValue(variables, 'notnlAcct'),
    notnlSgAcct: getStringValue(variables, 'notnlSgAcct'),
    notnlSgBal: getStringValue(variables, 'notnlSgBal'),
    othBen1: getStringValue(variables, 'othBen1'),
    othBen2: getStringValue(variables, 'othBen2'),
    othMult1: getStringValue(variables, 'othMult1'),
    othMult2: getStringValue(variables, 'othMult2'),
    othMult4: getStringValue(variables, 'othMult4'),
    oteAddtnl: getStringValue(variables, 'oteAddtnl'),
    rolloverAcct: getStringValue(variables, 'rolloverAcct'),
    salary: getStringValue(variables, 'salary'),
    sgAcct: getStringValue(variables, 'sgAcct'),
    srchrgAcct: getStringValue(variables, 'srchrgAcct'),
    vestFactA: getStringValue(variables, 'vestFactA'),
    sgNotionalAccount: getStringValue(variables, 'sgNotionalAccount'),
    memberContributions: getStringValue(variables, 'memberContributions'),
    finalAvSalForMrb2: getStringValue(variables, 'finalAvSalForMrb2'),

    };
};

export const mapToSubProcessData = (variables: Record<string, string>): SubProcessData => {
    return {
        pymntAmt: getStringValue(variables, 'pymntAmt'),
        minBenCheck: getStringValue(variables, 'minBenCheck'),
        maxBenCheck: getStringValue(variables, 'maxBenCheck'),
        totalVolAcctsAdd: getStringValue(variables, 'totalVolAcctsAdd'),
        totalVolAcctsSub: getStringValue(variables, 'totalVolAcctsSub'),
        totalVolAcctsNet: getStringValue(variables, 'totalVolAcctsNet')
    };
};
