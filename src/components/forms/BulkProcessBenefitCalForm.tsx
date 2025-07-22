"use client"
import React, { useState, useEffect, useRef, JSX } from 'react';
import { Button } from '@/src/components/ui/button';
import { Upload, FileText, CheckCircle, XCircle, Clock, Download } from 'lucide-react';
import { useStore } from '@/src/store/useStore';

interface BulkProcessBenefitCalFormProps {
  onClose?: () => void;
}

interface BatchStatus {
  batchId: string;
  status: string;
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  startTime: string;
  endTime?: string;
}

interface MemberData {
  firstName: string;
  lastName: string;
  memberId: string;
  dateOfBirth: string;
  dateJoinedFund?: string;
  benefitClass: string;
  paymentType: string;
  paymentTypeDesc?: string;
  effectiveDate?: string;
  calculationDate?: string;
  [key: string]: string | number | null | undefined; 
}

interface SubProcessData {
  pymntAmt?: string;
  [key: string]: string | number |  null | undefined; 
}

interface CalculationResult {
  memberData: MemberData;
  subProcessData?: SubProcessData;
}

interface ProcessingResult {
  batchId: string;
  processInstanceId: string;
  taskId: string;
  memberData: MemberData;
  calculationResult?: CalculationResult;
  success: boolean;
  processedAt: string;
}

interface UploadResponse {
  batchId: string;
  message?: string;
}

interface ErrorResponse {
  message: string;
}

const BulkProcessBenefitCalForm: React.FC<BulkProcessBenefitCalFormProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [batchId, setBatchId] = useState<string>('');
  const [batchStatus, setBatchStatus] = useState<BatchStatus | null>(null);
  const [results, setResults] = useState<ProcessingResult[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const { bulkprocessBatchId, setBulkprocessBatchId, setBulkprocessBatchStatus} = useStore();

  useEffect(() => {
    const savedBatchId = bulkprocessBatchId || sessionStorage.getItem('currentBatchId');
    if (savedBatchId) {
      setBatchId(savedBatchId);
      if (!bulkprocessBatchId) {
        setBulkprocessBatchId(savedBatchId);
      }
      
    }
  }, [bulkprocessBatchId, setBulkprocessBatchId]);

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension === 'csv' || fileExtension === 'xlsx' || fileExtension === 'xls') {
        setSelectedFile(file);
        setUploadError('');
      } else {
        setUploadError('Please select a CSV or Excel file');
        setSelectedFile(null);
      }
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${baseUrl}/bulk-benefit-calculator/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        const result: UploadResponse = await response.json();
        const newBatchId = result.batchId;
        setBatchId(newBatchId);
        setBulkprocessBatchId(newBatchId); // Update store
        setBulkprocessBatchStatus('PROCESSING'); // Update store status
        sessionStorage.setItem('currentBatchId', newBatchId);
  
        startPolling(newBatchId);
      } else {
        const errorData: ErrorResponse = await response.json();
        setUploadError(errorData.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Network error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  const checkBatchStatus = async (batchIdToCheck: string): Promise<void> => {
    try {
      const response = await fetch(`${baseUrl}/bulk-benefit-calculator/batch/${batchIdToCheck}/status`, {
        credentials: 'include'
      });

      if (response.ok) {
        const status: BatchStatus = await response.json();
        setBatchStatus(status);
        setBulkprocessBatchStatus(status.status); // Update store with current status

        if (status.status === 'COMPLETED' || status.status === 'FAILED') {
         
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }
          
          if (status.status === 'COMPLETED') {
            fetchResults(batchIdToCheck);
          }
        }
      }
    } catch (error) {
      console.error('Error checking batch status:', error);
    }
  };

  const fetchResults = async (batchIdToCheck: string): Promise<void> => {
    try {
      const response = await fetch(`${baseUrl}/bulk-benefit-calculator/batch/${batchIdToCheck}/results`, {
        credentials: 'include'
      });

      if (response.ok) {
        const resultsData: ProcessingResult[] = await response.json();
        setResults(resultsData);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const startPolling = (batchIdToCheck: string): void => {

    pollingIntervalRef.current = setInterval(() => {
      checkBatchStatus(batchIdToCheck);
    }, 2000); // Poll every 2 seconds
  };


  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'PROCESSING':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getProgressPercentage = (): number => {
    if (!batchStatus || batchStatus.totalRecords === 0) return 0;
    return Math.round((batchStatus.processedRecords / batchStatus.totalRecords) * 100);
  };

  const handleClose = (): void => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    if (onClose) onClose();
  };

  const exportResults = (): void => {
    if (results.length === 0) return;
    
    const fixedColumns = [
      'Member ID',
      'First Name',
      'Last Name',
      'Date of Birth',
      'Date Joined Fund',
      'Benefit Class',
      'Payment Type',
      'Payment Type Description',
      'Effective Date',
      'Calculation Date'
    ];
    
    const dynamicMemberDataColumns = new Set<string>();
    const dynamicSubProcessColumns = new Set<string>();
    
    results.forEach(result => {
      const memberData = result.calculationResult?.memberData || result.memberData;
      const subProcessData = result.calculationResult?.subProcessData || {};
      
      Object.keys(memberData || {}).forEach(key => {
        const fixedKeys = ['memberId', 'firstName', 'lastName', 'dateOfBirth', 'dateJoinedFund', 
                          'benefitClass', 'paymentType', 'paymentTypeDesc', 'effectiveDate', 'calculationDate'];
        if (!fixedKeys.includes(key)) {
          dynamicMemberDataColumns.add(key);
        }
      });
      
      Object.keys(subProcessData || {}).forEach(key => {
        dynamicSubProcessColumns.add(key);
      });
    });
    
    const sortedDynamicMemberColumns = Array.from(dynamicMemberDataColumns).sort();
    const sortedDynamicSubProcessColumns = Array.from(dynamicSubProcessColumns).sort();
    
    const formatColumnName = (key: string): string => {
      return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ') 
        .replace(/^\w/, c => c.toUpperCase())
        .replace(/\s+/g, ' ') 
        .trim();
    };
    
    const csvHeaders = [
      ...fixedColumns,
      ...sortedDynamicMemberColumns.map(formatColumnName),
      ...sortedDynamicSubProcessColumns.map(formatColumnName),
      'Success',
      'Process Instance ID',
      'Task ID',
      'Processed At'
    ];
    
    const csvData = results.map(result => {
      const memberData = result.calculationResult?.memberData || result.memberData;
      const subProcessData = result.calculationResult?.subProcessData || {};
      
      const row: (string | number)[] = [
        memberData?.memberId || '',
        memberData?.firstName || '',
        memberData?.lastName || '',
        memberData?.dateOfBirth ? new Date(memberData.dateOfBirth).toLocaleDateString() : '',
        memberData?.dateJoinedFund ? new Date(memberData.dateJoinedFund).toLocaleDateString() : '',
        memberData?.benefitClass || '',
        memberData?.paymentType || '',
        memberData?.paymentTypeDesc || '',
        memberData?.effectiveDate ? new Date(memberData.effectiveDate).toLocaleDateString() : '',
        memberData?.calculationDate ? new Date(memberData.calculationDate).toLocaleDateString() : '',
        ...sortedDynamicMemberColumns.map(key => memberData?.[key] || ''),
        ...sortedDynamicSubProcessColumns.map(key => subProcessData?.[key] || ''),
        
        result.success ? 'Yes' : 'No',
        result.processInstanceId || '',
        result.taskId || '',
        new Date(result.processedAt).toLocaleString()
      ];
      
      return row.map(field => {
        const fieldStr = String(field);
        if (fieldStr.includes(',') || fieldStr.includes('"')) {
          return `"${fieldStr.replace(/"/g, '""')}"`;
        }
        return fieldStr;
      });
    });
    
    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk_calculation_results_${batchId}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const shouldShowUploadSection = !batchStatus || 
    batchStatus.status === 'COMPLETED' || 
    batchStatus.status === 'FAILED';

  return (
    <div className="bg-card rounded-md shadow-sm h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-4 sm:px-6 py-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <h1 className="text-lg sm:text-xl font-medium text-foreground">Bulk Data Upload Calculations</h1>
        </div>
      </div>

      {/* Navigation text in top right */}
      <div className="flex justify-end px-4 sm:px-6 py-2 flex-shrink-0">
        <div className="text-lg sm:text-xl font-bold">Novigi</div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        {!showResults ? (
          <div className="space-y-6">
            {/* File Upload Section */}
            {shouldShowUploadSection && (
              <div>
                <h2 className="text-base sm:text-lg font-medium text-foreground mb-4">Upload File</h2>
                <div className="border-2 border-dashed border-border rounded-lg p-4 sm:p-8 text-center">
                  <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">
                    Drag and drop your CSV or Excel file here, or click to browse
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="mb-4"
                  >
                    Choose File
                  </Button>
                  
                  {selectedFile && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                      <FileText className="w-4 h-4" />
                      <span className="break-all">{selectedFile.name}</span>
                    </div>
                  )}
                  
                  {uploadError && (
                    <p className="text-red-500 text-sm">{uploadError}</p>
                  )}
                  
                  {selectedFile && !uploadError && (
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      {isUploading ? "Uploading..." : "Upload & Process"}
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Status Section */}
            {batchStatus && (
              <div>
                <h2 className="text-base sm:text-lg font-medium text-gray-700 mb-4">Processing Status</h2>
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {getStatusIcon(batchStatus.status)}
                    <span className="text-base sm:text-lg font-medium capitalize">
                      {batchStatus.status.toLowerCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Total Records</p>
                      <p className="text-lg sm:text-xl font-bold">{batchStatus.totalRecords}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Processed</p>
                      <p className="text-lg sm:text-xl font-bold">{batchStatus.processedRecords}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Successful</p>
                      <p className="text-lg sm:text-xl font-bold text-green-600">{batchStatus.successfulRecords}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Failed</p>
                      <p className="text-lg sm:text-xl font-bold text-red-600">{batchStatus.failedRecords}</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{getProgressPercentage()}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage()}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                    <p>Started: {new Date(batchStatus.startTime).toLocaleString()}</p>
                    {batchStatus.endTime && (
                      <p>Completed: {new Date(batchStatus.endTime).toLocaleString()}</p>
                    )}
                  </div>
                  
                  {batchStatus.status === 'COMPLETED' && results.length > 0 && (
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() => setShowResults(true)}
                        className="bg-teal-600 hover:bg-teal-700 text-white"
                      >
                        View Results
                      </Button>
                      <Button
                        onClick={exportResults}
                        variant="outline"
                        className="text-teal-600"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-base sm:text-lg font-medium text-gray-700">Calculation Results</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => setShowResults(false)}
                  variant="outline"
                >
                  Back to Status
                </Button>
                <Button
                  onClick={exportResults}
                  variant="outline"
                  className="text-teal-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium truncate">
                          {result.memberData.firstName} {result.memberData.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">ID: {result.memberData.memberId}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {result.success ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                          {result.success ? 'Success' : 'Failed'}
                        </span>
                      </div>
                    </div>
                    
                    {result.success && result.calculationResult?.subProcessData && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Payment Amount:</span>
                          <span className="ml-2 font-medium">
                            ${result.calculationResult.subProcessData.pymntAmt ? 
                              parseFloat(result.calculationResult.subProcessData.pymntAmt).toLocaleString() : 
                              'N/A'
                            }
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Processed:</span>
                          <span className="ml-2">
                            {new Date(result.processedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="border-t border-gray-200 px-4 sm:px-6 py-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            className="text-teal-600"
            onClick={handleClose}
          >
            Back
          </Button>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              className="text-teal-600"
              onClick={handleClose}
            >
              Close
            </Button>
            {batchStatus && batchStatus.status !== 'COMPLETED' && batchStatus.status !== 'FAILED' && (
              <Button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 text-white"
                disabled
              >
                Processing...
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkProcessBenefitCalForm;