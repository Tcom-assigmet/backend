/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { CalculationFactor, MemberData, SubProcessData } from '../../../types/benefitcalculator';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f766e',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f766e',
    marginBottom: 10,
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f766e',
    marginBottom: 8,
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cellHeader: {
    backgroundColor: '#f0fdfa',
    fontWeight: 'bold',
    color: '#7F8CAA',
  },
  highlight: {
    color: '#059669',
    fontWeight: 'bold',
  },
  memberBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#f0fdfa',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#B8CFCE',
  },
  bannerText: {
    fontSize: 10,
    color: '#7F8CAA',
    fontWeight: 'bold',
  },
  bannerBadge: {
    backgroundColor: '#ffffff',
    padding: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#B8CFCE',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#6b7280',
  },
});

interface BenefitPdfDocumentProps {
  memberData: MemberData;
  subProcessData: SubProcessData;
  calculationFactors: CalculationFactor[];
  today: string;
  logoSrc?: string;
  reportTitle?: string;
  companyName?: string;
}

const BenefitPdfDocument: React.FC<BenefitPdfDocumentProps> = ({
  memberData,
  subProcessData,
  calculationFactors,
  today,
  logoSrc = "/logo.png",
  reportTitle = "Benefit Calculation Statement",
  companyName = "",
}) => {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB');
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value?: string | number): string => {
    if (!value || value === '0.0') return '$0.00';
    const numValue = parseFloat(value.toString());
    if (isNaN(numValue)) return '$0.00';
    return `$${numValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatFactorValue = (key: string, value: string | number | undefined): string => {
    if (key.toLowerCase().includes('sal') || key.toLowerCase().includes('salary')) {
      return formatCurrency(value);
    }
    return value?.toString() || '-';
  };

  const calculateAge = (birthDate?: string, effectiveDate?: string): string | number => {
    if (!birthDate || !effectiveDate) return '-';
    try {
      const birth = new Date(birthDate);
      const effective = new Date(effectiveDate);
      let age = effective.getFullYear() - birth.getFullYear();
      const m = effective.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && effective.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    } catch {
      return '-';
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image src={logoSrc} style={{ width: 48, height: 48, marginRight: 10 }}    />
            {companyName && (
              <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0f766e' }}>
                  {companyName}
                </Text>
              </View>
            )}
          </View>
          <View>
            <Text style={styles.title}>{reportTitle}</Text>
            <Text style={{ fontSize: 10, color: '#6b7280' }}>Generated: {today}</Text>
          </View>
        </View>

        {/* Member ID Banner */}
        <View style={styles.memberBanner}>
          <View>
            <Text style={styles.bannerText}>Member ID: {memberData.memberId || '-'}</Text>
          </View>
          <View style={styles.bannerBadge}>
            <Text style={[styles.bannerText, { color: '#0f766e' }]}>
              {memberData.paymentTypeDesc || 'Benefit Calculation'}
            </Text>
          </View>
        </View>

        {/* Member Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Member Information</Text>
          <View style={styles.table}>
            {/* First Name, Last Name */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.cellHeader, { width: '25%' }]}>
                <Text>First Name</Text>
              </View>
              <View style={[styles.tableCell, { width: '25%' }]}>
                <Text>{memberData.firstName || '-'}</Text>
              </View>
              <View style={[styles.tableCell, styles.cellHeader, { width: '25%' }]}>
                <Text>Last Name</Text>
              </View>
              <View style={[styles.tableCell, { width: '25%' }]}>
                <Text>{memberData.lastName || '-'}</Text>
              </View>
            </View>
            
            {/* Date of Birth, Effective Date */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.cellHeader, { width: '25%' }]}>
                <Text>Date of Birth</Text>
              </View>
              <View style={[styles.tableCell, { width: '25%' }]}>
                <Text>{formatDate(memberData.dateOfBirth)}</Text>
              </View>
              <View style={[styles.tableCell, styles.cellHeader, { width: '25%' }]}>
                <Text>Effective Date</Text>
              </View>
              <View style={[styles.tableCell, { width: '25%' }]}>
                <Text>{formatDate(memberData.effectiveDate)}</Text>
              </View>
            </View>

            {/* Date Joined Fund, Calculation Date */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.cellHeader, { width: '25%' }]}>
                <Text>Date Joined Fund</Text>
              </View>
              <View style={[styles.tableCell, { width: '25%' }]}>
                <Text>{formatDate(memberData.dateJoinedFund)}</Text>
              </View>
              <View style={[styles.tableCell, styles.cellHeader, { width: '25%' }]}>
                <Text>Calculation Date</Text>
              </View>
              <View style={[styles.tableCell, { width: '25%' }]}>
                <Text>{formatDate(memberData.calculationDate)}</Text>
              </View>
            </View>

            {/* Age at Effective Date */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.cellHeader, { width: '25%' }]}>
                <Text>Age at Effective Date</Text>
              </View>
              <View style={[styles.tableCell, { width: '25%' }]}>
                <Text>{calculateAge(memberData.dateOfBirth, memberData.effectiveDate)}</Text>
              </View>
              <View style={[styles.tableCell, { width: '25%' }]}></View>
              <View style={[styles.tableCell, { width: '25%' }]}></View>
            </View>
          </View>
        </View>

        {/* Benefit Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefit Details</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.cellHeader, { width: '25%' }]}>
                <Text>Benefit Class</Text>
              </View>
              <View style={[styles.tableCell, { width: '25%' }]}>
                <Text>{memberData.benefitClass || '-'}</Text>
              </View>
              <View style={[styles.tableCell, styles.cellHeader, { width: '25%' }]}>
                <Text>Payment Type</Text>
              </View>
              <View style={[styles.tableCell, { width: '25%' }]}>
                <Text>{memberData.paymentTypeDesc || '-'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Calculation Factors Section */}
        {calculationFactors.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Calculation Factors</Text>
            <View style={styles.table}>
              {calculationFactors.map((factor, index) => {
                if (index % 2 === 0) {
                  const nextFactor = calculationFactors[index + 1];
                  return (
                    <View key={factor.key} style={styles.tableRow}>
                      <View style={[styles.tableCell, styles.cellHeader, { width: '25%' }]}>
                        <Text>{factor.label}</Text>
                      </View>
                      <View style={[styles.tableCell, { width: '25%' }]}>
                        <Text>{formatFactorValue(factor.key, factor.value)}</Text>
                      </View>
                      {nextFactor ? (
                        <>
                          <View style={[styles.tableCell, styles.cellHeader, { width: '25%' }]}>
                            <Text>{nextFactor.label}</Text>
                          </View>
                          <View style={[styles.tableCell, { width: '25%' }]}>
                            <Text>{formatFactorValue(nextFactor.key, nextFactor.value)}</Text>
                          </View>
                        </>
                      ) : (
                        <>
                          <View style={[styles.tableCell, { width: '25%' }]}></View>
                          <View style={[styles.tableCell, { width: '25%' }]}></View>
                        </>
                      )}
                    </View>
                  );
                }
                return null;
              })}
            </View>
          </View>
        )}

        {/* Benefit Calculation Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefit Calculation Summary</Text>
          
          {/* Benefit Payment Section */}
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.subSectionTitle}>Benefit Payment</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell, styles.cellHeader, { width: '65%' }]}>
                  <Text>Payment Type</Text>
                </View>
                <View style={[styles.tableCell, { width: '35%' }]}>
                  <Text>{memberData.paymentTypeDesc || '-'}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell, styles.cellHeader, { width: '65%' }]}>
                  <Text>Payment Amount</Text>
                </View>
                <View style={[styles.tableCell, { width: '35%' }]}>
                  <Text style={styles.highlight}>
                    {formatCurrency(subProcessData.pymntAmt)}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell, styles.cellHeader, { width: '65%' }]}>
                  <Text>Minimum Check</Text>
                </View>
                <View style={[styles.tableCell, { width: '35%' }]}>
                  <Text>{formatCurrency(subProcessData.minBenCheck)}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell, styles.cellHeader, { width: '65%' }]}>
                  <Text>Maximum Check</Text>
                </View>
                <View style={[styles.tableCell, { width: '35%' }]}>
                  <Text>{subProcessData.maxBenCheck === "" ? "N/A" : formatCurrency(subProcessData.maxBenCheck)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Voluntary Accounts Section */}
          <View>
            <Text style={styles.subSectionTitle}>Voluntary Accounts</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell, styles.cellHeader, { width: '65%' }]}>
                  <Text>Total Voluntary Accounts (additions)</Text>
                </View>
                <View style={[styles.tableCell, { width: '35%' }]}>
                  <Text>{formatCurrency(subProcessData.totalVolAcctsAdd)}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell, styles.cellHeader, { width: '65%' }]}>
                  <Text>Total Voluntary Accounts (subtractions)</Text>
                </View>
                <View style={[styles.tableCell, { width: '35%' }]}>
                  <Text>{formatCurrency(subProcessData.totalVolAcctsSub)}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell, styles.cellHeader, { width: '65%' }]}>
                  <Text>Net Value of Voluntary Accounts</Text>
                </View>
                <View style={[styles.tableCell, { width: '35%' }]}>
                  <Text style={styles.highlight}>
                    {formatCurrency(subProcessData.totalVolAcctsNet)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>This statement is generated automatically and is for informational purposes only.</Text>
          <Text>Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  );
};

export default BenefitPdfDocument;