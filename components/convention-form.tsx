'use client';

import { useState } from 'react';
import { FieldDefinition, FormValues } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface ConventionFormProps {
  fields: FieldDefinition[];
  onValuesChange: (values: FormValues, separator: string) => void;
}

export function ConventionForm({ fields, onValuesChange }: ConventionFormProps) {
  const [values, setValues] = useState<FormValues>({});
  const [separator, setSeparator] = useState('_');
  const [customSeparator, setCustomSeparator] = useState('');

  const handleFieldChange = (fieldName: string, value: string) => {
    const newValues = { ...values, [fieldName]: value };
    setValues(newValues);
    const finalSeparator = separator === 'custom' ? customSeparator : separator;
    onValuesChange(newValues, finalSeparator);
  };

  const handleSeparatorChange = (value: string) => {
    setSeparator(value);
    const finalSeparator = value === 'custom' ? customSeparator : value;
    onValuesChange(values, finalSeparator);
  };

  const handleCustomSeparatorChange = (value: string) => {
    setCustomSeparator(value);
    if (separator === 'custom') {
      onValuesChange(values, value);
    }
  };

  const sortedFields = [...fields].sort((a, b) => a.field_order - b.field_order);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Enter Field Values</h2>
        <p className="text-sm text-muted-foreground">Fill in the details for your naming convention</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sortedFields.map((field) => (
          <TooltipProvider key={field.id}>
            <Tooltip>
              <Field>
                <TooltipTrigger asChild>
                  <FieldLabel className="flex items-center gap-2">
                    {field.display_name}
                    {field.required && <span className="text-destructive">*</span>}
                    {field.description && (
                      <Info className="h-4 w-4 text-muted-foreground" />
                    )}
                  </FieldLabel>
                </TooltipTrigger>
                {field.description && (
                  <TooltipContent side="right" className="max-w-xs">
                    {field.description}
                    {field.example && <div className="mt-2 text-xs">Example: {field.example}</div>}
                  </TooltipContent>
                )}
              </Field>
              <Input
                placeholder={field.format || 'Enter value'}
                value={values[field.field_name] || ''}
                onChange={(e) => handleFieldChange(field.field_name, e.target.value)}
                className="mt-2"
              />
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
        <h3 className="font-semibold text-foreground">Separator</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Select value={separator} onValueChange={handleSeparatorChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_">Underscore (_)</SelectItem>
                <SelectItem value="-">Hyphen (-)</SelectItem>
                <SelectItem value=".">Dot (.)</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {separator === 'custom' && (
            <Input
              placeholder="Enter custom separator"
              value={customSeparator}
              onChange={(e) => handleCustomSeparatorChange(e.target.value)}
              maxLength={5}
            />
          )}
        </div>
      </div>
    </div>
  );
}
