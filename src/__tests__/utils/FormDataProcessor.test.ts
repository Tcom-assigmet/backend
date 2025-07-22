import { FormDataProcessor } from '@/utils/FormDataProcessor';
import { DataType, FormValue, RequiredField } from '@/types/benefitcalculator';

describe('FormDataProcessor', () => {
  const mockFields: RequiredField[] = [
    { id: 'firstName', label: 'First Name', dataType: 'String', required: true },
    { id: 'age', label: 'Age', dataType: 'Double', required: true },
    { id: 'isActive', label: 'Is Active', dataType: 'Boolean', required: false },
    { id: 'birthDate', label: 'Birth Date', dataType: 'Date', required: true },
  ];

  describe('processFormValues', () => {
    it('should process string values correctly', () => {
      const rawValues = {
        firstName: 'John Doe',
        age: '25',
        isActive: 'true',
        birthDate: '2024-01-15',
      };

      const result = FormDataProcessor.processFormValues(mockFields, rawValues);

      expect(result.firstName).toBe('John Doe');
      expect(result.age).toBe(25);
      expect(result.isActive).toBe(true);
      expect(result.birthDate).toBe('2024-01-15');
    });

    it('should handle null and undefined values', () => {
      const rawValues = {
        firstName: null,
        age: undefined,
        isActive: '',
        birthDate: '2024-01-15',
      };

      const result = FormDataProcessor.processFormValues(mockFields, rawValues);

      expect(result.firstName).toBeNull();
      expect(result.age).toBeNull();
      expect(result.isActive).toBeNull();
      expect(result.birthDate).toBe('2024-01-15');
    });

    it('should convert numeric strings to numbers for Double type', () => {
      const rawValues = {
        age: '25.5',
      };

      const result = FormDataProcessor.processFormValues(mockFields, rawValues);

      expect(result.age).toBe(25.5);
      expect(typeof result.age).toBe('number');
    });

    it('should convert string to boolean for Boolean type', () => {
      const rawValues = {
        isActive: 'false',
      };

      const result = FormDataProcessor.processFormValues(mockFields, rawValues);

      expect(result.isActive).toBe(true); // Any truthy string becomes true
    });

    it('should handle boolean values for Boolean type', () => {
      const rawValues = {
        isActive: false,
      };

      const result = FormDataProcessor.processFormValues(mockFields, rawValues);

      expect(result.isActive).toBe(false);
    });

    it('should handle empty object', () => {
      const result = FormDataProcessor.processFormValues(mockFields, {});

      // FormDataProcessor processes all fields from the fields array
      // When a field doesn't exist in the input, it gets converted to null
      expect(result.firstName).toBeNull();
      expect(result.age).toBeNull();
      expect(result.isActive).toBeNull();
      expect(result.birthDate).toBeNull();
      
      // The result should have all fields from mockFields
      expect(Object.keys(result)).toHaveLength(mockFields.length);
    });

    it('should only process fields that exist in the fields array', () => {
      const rawValues = {
        firstName: 'John',
        unknownField: 'should not be processed',
      };

      const result = FormDataProcessor.processFormValues(mockFields, rawValues);

      expect(result.firstName).toBe('John');
      expect(result.unknownField).toBeUndefined();
      // Other fields from mockFields should be processed as null since they're not in rawValues
      expect(result.age).toBeNull();
      expect(result.isActive).toBeNull();
      expect(result.birthDate).toBeNull();
    });
  });

  describe('prepareSubmissionData', () => {
    it('should prepare submission data correctly', () => {
      const processInstanceId = 'test-process-123';
      const processedValues = {
        firstName: 'John Doe',
        age: 25,
        isActive: true,
        birthDate: '2024-01-15',
      };

      const result = FormDataProcessor.prepareSubmissionData(
        processInstanceId,
        mockFields,
        processedValues
      );

      expect(result.processInstanceId).toBe(processInstanceId);
      expect(result.variables).toEqual({
        firstName: { value: 'John Doe', type: 'String' },
        age: { value: 25, type: 'Double' },
        isActive: { value: true, type: 'String' },
        birthDate: { value: '2024-01-15', type: 'String' },
      });
    });

    it('should set type to Double for Double dataType fields', () => {
      const processInstanceId = 'test-process-123';
      const processedValues = {
        age: 25.5,
      };

      const result = FormDataProcessor.prepareSubmissionData(
        processInstanceId,
        mockFields,
        processedValues
      );

      expect(result.variables.age.type).toBe('Double');
    });

    it('should set type to String for non-Double dataType fields', () => {
      const processInstanceId = 'test-process-123';
      const processedValues = {
        firstName: 'John',
        isActive: true,
        birthDate: '2024-01-15',
      };

      const result = FormDataProcessor.prepareSubmissionData(
        processInstanceId,
        mockFields,
        processedValues
      );

      expect(result.variables.firstName.type).toBe('String');
      expect(result.variables.isActive.type).toBe('String');
      expect(result.variables.birthDate.type).toBe('String');
    });

    it('should handle empty processedValues', () => {
      const processInstanceId = 'test-process-123';
      const processedValues = {};

      const result = FormDataProcessor.prepareSubmissionData(
        processInstanceId,
        mockFields,
        processedValues
      );

      expect(result.processInstanceId).toBe(processInstanceId);
      expect(result.variables).toEqual({});
    });

    it('should only include values that exist in processedValues', () => {
      const processInstanceId = 'test-process-123';
      const processedValues = {
        firstName: 'John',
        // age is missing
      };

      const result = FormDataProcessor.prepareSubmissionData(
        processInstanceId,
        mockFields,
        processedValues
      );

      expect(result.variables.firstName).toBeDefined();
      expect(result.variables.age).toBeUndefined();
    });

    it('should handle fields not found in mockFields array', () => {
      const processInstanceId = 'test-process-123';
      const processedValues = {
        unknownField: 'test',
      };

      const result = FormDataProcessor.prepareSubmissionData(
        processInstanceId,
        mockFields,
        processedValues
      );

      expect(result.variables.unknownField).toEqual({
        value: 'test',
        type: 'String'
      });
    });
  });

  describe('integration test', () => {
    it('should process and prepare data correctly in sequence', () => {
      const rawValues = {
        firstName: 'Jane Smith',
        age: '30',
        isActive: 'true',
        birthDate: '1994-01-15',
      };

      // First process the values
      const processedValues = FormDataProcessor.processFormValues(mockFields, rawValues);

      // Then prepare submission data
      const submissionData = FormDataProcessor.prepareSubmissionData(
        'process-123',
        mockFields,
        processedValues
      );

      expect(submissionData).toEqual({
        processInstanceId: 'process-123',
        variables: {
          firstName: { value: 'Jane Smith', type: 'String' },
          age: { value: 30, type: 'Double' },
          isActive: { value: true, type: 'String' },
          birthDate: { value: '1994-01-15', type: 'String' },
        },
      });
    });
  });
});