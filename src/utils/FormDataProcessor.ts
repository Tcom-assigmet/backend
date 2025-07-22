import { DataType, FormValue, ProcessedFormData, RequiredField } from "@/types/benefitcalculator";
import { FormSubmissionData } from "../types/api";

export class FormDataProcessor {
  static processFormValues(fields: RequiredField[], rawValues: Record<string, FormValue>): ProcessedFormData {
    const processedValues: ProcessedFormData = {};

    fields.forEach(field => {
      const value = rawValues[field.id];
      processedValues[field.id] = this.convertValueByType(value, field.dataType);
    });

    return processedValues;
  }

  private static convertValueByType(value: FormValue, dataType: DataType): FormValue {
    if (value === '' || value === null || value === undefined) {
      return null;
    }

    switch (dataType) {
      case 'Double':
        return parseFloat(String(value));
      case 'Boolean':
        return Boolean(value);
      case 'String':
      case 'Date':
      default:
        return value;
    }
  }

  static prepareSubmissionData(
    processInstanceId: string,
    fields: RequiredField[],
    processedValues: ProcessedFormData
  ): FormSubmissionData {
    const variables: Record<string, { value: FormValue; type: string }> = {};

    Object.keys(processedValues).forEach(key => {
      const field = fields.find(f => f.id === key);
      variables[key] = {
        value: processedValues[key],
        type: field?.dataType === 'Double' ? 'Double' : 'String'
      };
    });

    return {
      processInstanceId,
      variables
    };
  }
}