import { FieldDefinition, FormValues } from './schema';

export const generateNamingConvention = (
  values: FormValues,
  separator: string,
  fields: FieldDefinition[]
): string => {
  // Sort fields by field_order
  const sortedFields = [...fields].sort((a, b) => a.field_order - b.field_order);
  
  // Get values for each field in order, filtering out empty values
  const parts = sortedFields
    .map((field) => values[field.field_name])
    .filter((value) => value && value.trim() !== '');
  
  return parts.join(separator);
};

export const getSeparatorLabel = (separator: string): string => {
  switch (separator) {
    case '_':
      return 'Underscore (_)';
    case '-':
      return 'Hyphen (-)';
    case '.':
      return 'Dot (.)';
    default:
      return `Custom (${separator})`;
  }
};

export const validateFormValues = (
  values: FormValues,
  fields: FieldDefinition[]
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  fields.forEach((field) => {
    if (field.required && (!values[field.field_name] || values[field.field_name].trim() === '')) {
      errors[field.field_name] = `${field.display_name} is required`;
    }
  });
  
  return errors;
};
