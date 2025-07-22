import { INPUT_STYLES } from "../../../../configs/benefitCalculatorConfigs";
import { BenefitCalculationDetailFormFieldProps, FormValue } from "../../../../types/benefitcalculator";

export const EnterCalculationDetailFormField: React.FC<BenefitCalculationDetailFormFieldProps> = ({ field, value, error, touched, onChange, onBlur }) => {
  const handleChange = (newValue: FormValue) => {
    onChange(field.id, newValue);
  };

  const handleBlur = () => {
    onBlur?.(field.id);
  };

  const getInputClassName = () => {
    const hasError = touched && error;
    return `${INPUT_STYLES.base} ${hasError ? INPUT_STYLES.invalid : INPUT_STYLES.valid}`;
  };

  const showError = touched && error;
  const isRequired = field.required !== false; // Default to true unless explicitly set to false

  const renderInput = () => {
    switch (field.dataType) {
      case 'Double':
        return (
          <input
            type="number"
            id={field.id}
            value={value?.toString() || ''}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue === '' || (!isNaN(Number(newValue)) && Number(newValue) >= 0)) {
          handleChange(newValue);
              }
            }}
            onBlur={handleBlur}
            className={getInputClassName()}
            step="1"
            min="0"
            max={field.max}
            required={isRequired}
            aria-describedby={showError ? `${field.id}-error` : undefined}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            onKeyDown={(e) => {
              if (
          e.key === 'e' ||
          e.key === 'E' ||
          e.key === '+' ||
          e.key === '-'
              ) {
          e.preventDefault();
              }
            }}
          />
        );
      case 'String':
        return (
          <input
            type="text"
            id={field.id}
            value={value?.toString() || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            className={getInputClassName()}
            pattern={field.pattern}
            required={isRequired}
            aria-describedby={showError ? `${field.id}-error` : undefined}
          />
        );

      case 'Boolean':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.id}
              checked={Boolean(value)}
              onChange={(e) => handleChange(e.target.checked)}
              onBlur={handleBlur}
              className={INPUT_STYLES.checkbox}
              required={isRequired}
              aria-describedby={showError ? `${field.id}-error` : undefined}
            />
            <label htmlFor={field.id} className="ml-2 text-sm text-gray-700">
              Check if applicable
            </label>
          </div>
        );

      case 'Date':
        return (
          <div className="relative">
            <input
              type="date"
              id={field.id}
              value={value?.toString() || ''}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={handleBlur}
              className={getInputClassName()}
              required={isRequired}
              aria-describedby={showError ? `${field.id}-error` : undefined}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        );

      default:
        return (
          <input
            type="text"
            id={field.id}
            value={value?.toString() || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            className={getInputClassName()}
            required={isRequired}
            aria-describedby={showError ? `${field.id}-error` : undefined}
          />
        );
    }
  };

  return (
    <div className="mb-4">
      {field.dataType !== 'Boolean' && (
        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
          {field.label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderInput()}
      {showError && (
        <p id={`${field.id}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
