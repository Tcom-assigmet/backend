import { FormDataProcessor } from '@/src/utils/FormDataProcessor';
import { DataType, FormValue, RequiredField } from '@/src/types/benefitcalculator';

describe('FormDataProcessor', () => {
  describe('processFormValues', () => {
    const mockFields: RequiredField[] = [
      { id: 'stringField', label: 'String Field', dataType: 'String' },
      { id: 'doubleField', label: 'Double Field', dataType: 'Double' },
      { id: 'booleanField', label: 'Boolean Field', dataType: 'Boolean' },
      { id: 'dateField', label: 'Date Field', dataType: 'Date' },
    ];

    it('should process string values correctly', () => {
      const rawValues = {
        stringField: 'test string',
        doubleField: '123.45',
        booleanField: true,
        dateField: '2023-01-01',
      };

      const result = FormDataProcessor.processFormValues(mockFields, rawValues);

      expect(result).toEqual({
        stringField: 'test string',
        doubleField: 123.45,
        booleanField: true,
        dateField: '2023-01-01',
      });
    });

    it('should handle empty string values', () => {
      const rawValues = {
        stringField: '',
        doubleField: '',
        booleanField: '',
        dateField: '',
      };

      const result = FormDataProcessor.processFormValues(mockFields, rawValues);

      expect(result).toEqual({
        stringField: null,
        doubleField: null,
        booleanField: null,
        dateField: null,
      });
    });

    it('should handle null and undefined values', () => {
      const rawValues = {
        stringField: null,
        doubleField: undefined,
        booleanField: null,
        dateField: undefined,
      };

      const result = FormDataProcessor.processFormValues(mockFields, rawValues);

      expect(result).toEqual({
        stringField: null,
        doubleField: null,
        booleanField: null,
        dateField: null,
      });
    });

    it('should convert string numbers to doubles', () => {
      const rawValues = {
        doubleField: '456.78',
      };

      const result = FormDataProcessor.processFormValues([mockFields[1]], rawValues);

      expect(result).toEqual({
        doubleField: 456.78,
      });
    });

    it('should convert various values to boolean', () => {
      const fields = [
        { id: 'bool1', label: 'Bool 1', dataType: 'Boolean' as DataType },
        { id: 'bool2', label: 'Bool 2', dataType: 'Boolean' as DataType },
        { id: 'bool3', label: 'Bool 3', dataType: 'Boolean' as DataType },
        { id: 'bool4', label: 'Bool 4', dataType: 'Boolean' as DataType },
      ];

      const rawValues = {
        bool1: true,
        bool2: false,
        bool3: 'true',
        bool4: 0,
      };

      const result = FormDataProcessor.processFormValues(fields, rawValues);

      expect(result).toEqual({
        bool1: true,
        bool2: false,
        bool3: true,
        bool4: false,
      });
    });

    it('should handle missing fields in rawValues', () => {
      const rawValues = {
        stringField: 'test',
        // missing other fields
      };

      const result = FormDataProcessor.processFormValues(mockFields, rawValues);

      expect(result).toEqual({
        stringField: 'test',
        doubleField: null,
        booleanField: null,
        dateField: null,
      });
    });

    it('should handle numeric string for double conversion', () => {
      const rawValues = {
        doubleField: '123',
      };

      const result = FormDataProcessor.processFormValues([mockFields[1]], rawValues);

      expect(result).toEqual({
        doubleField: 123,
      });
    });

    it('should handle non-numeric string for double conversion', () => {
      const rawValues = {
        doubleField: 'not a number',
      };

      const result = FormDataProcessor.processFormValues([mockFields[1]], rawValues);

      expect(result.doubleField).toBeNaN();
    });
  });

  describe('prepareSubmissionData', () => {
    const processInstanceId = 'test-process-123';
    const mockFields: RequiredField[] = [
      { id: 'stringField', label: 'String Field', dataType: 'String' },
      { id: 'doubleField', label: 'Double Field', dataType: 'Double' },
      { id: 'booleanField', label: 'Boolean Field', dataType: 'Boolean' },
      { id: 'dateField', label: 'Date Field', dataType: 'Date' },
    ];

    it('should prepare submission data with correct types', () => {
      const processedValues = {
        stringField: 'test string',
        doubleField: 123.45,
        booleanField: true,
        dateField: '2023-01-01',
      };

      const result = FormDataProcessor.prepareSubmissionData(
        processInstanceId,
        mockFields,
        processedValues
      );

      expect(result).toEqual({
        processInstanceId: 'test-process-123',
        variables: {
          stringField: {
            value: 'test string',
            type: 'String',
          },
          doubleField: {
            value: 123.45,
            type: 'Double',
          },
          booleanField: {
            value: true,
            type: 'String',
          },
          dateField: {
            value: '2023-01-01',
            type: 'String',
          },
        },
      });
    });

    it('should handle null values', () => {
      const processedValues = {
        stringField: null,
        doubleField: null,
      };

      const result = FormDataProcessor.prepareSubmissionData(
        processInstanceId,
        mockFields.slice(0, 2),
        processedValues
      );

      expect(result).toEqual({
        processInstanceId: 'test-process-123',
        variables: {
          stringField: {
            value: null,
            type: 'String',
          },
          doubleField: {
            value: null,
            type: 'Double',
          },
        },
      });
    });

    it('should handle empty processedValues', () => {
      const result = FormDataProcessor.prepareSubmissionData(
        processInstanceId,
        [],
        {}
      );

      expect(result).toEqual({
        processInstanceId: 'test-process-123',
        variables: {},
      });
    });

    it('should handle values not in fields (should be ignored)', () => {
      const processedValues = {
        stringField: 'test string',
        unknownField: 'should be ignored',
      };

      const result = FormDataProcessor.prepareSubmissionData(
        processInstanceId,
        [mockFields[0]], // Only stringField
        processedValues
      );

      expect(result).toEqual({
        processInstanceId: 'test-process-123',
        variables: {
          stringField: {
            value: 'test string',
            type: 'String',
          },
          unknownField: {
            value: 'should be ignored',
            type: 'String', // Default type when field not found
          },
        },
      });
    });

    it('should assign Double type only for Double dataType fields', () => {
      const fields = [
        { id: 'doubleField1', label: 'Double 1', dataType: 'Double' as DataType },
        { id: 'doubleField2', label: 'Double 2', dataType: 'Double' as DataType },
        { id: 'stringField', label: 'String Field', dataType: 'String' as DataType },
      ];

      const processedValues = {
        doubleField1: 123.45,
        doubleField2: 678.90,
        stringField: 'test',
      };

      const result = FormDataProcessor.prepareSubmissionData(
        processInstanceId,
        fields,
        processedValues
      );

      expect(result.variables.doubleField1.type).toBe('Double');
      expect(result.variables.doubleField2.type).toBe('Double');
      expect(result.variables.stringField.type).toBe('String');
    });
  });

  describe('integration test', () => {
    it('should process and prepare data end-to-end', () => {
      const fields: RequiredField[] = [
        { id: 'name', label: 'Name', dataType: 'String' },
        { id: 'salary', label: 'Salary', dataType: 'Double' },
        { id: 'isActive', label: 'Is Active', dataType: 'Boolean' },
      ];

      const rawValues = {
        name: 'John Doe',
        salary: '75000.50',
        isActive: true,
      };

      const processInstanceId = 'process-456';

      // Process values
      const processedValues = FormDataProcessor.processFormValues(fields, rawValues);

      // Prepare submission data
      const submissionData = FormDataProcessor.prepareSubmissionData(
        processInstanceId,
        fields,
        processedValues
      );

      expect(submissionData).toEqual({
        processInstanceId: 'process-456',
        variables: {
          name: {
            value: 'John Doe',
            type: 'String',
          },
          salary: {
            value: 75000.50,
            type: 'Double',
          },
          isActive: {
            value: true,
            type: 'String',
          },
        },
      });
    });
  });
});
