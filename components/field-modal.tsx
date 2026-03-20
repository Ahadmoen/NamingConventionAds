'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { FieldDefinition } from '@/lib/schema';
import { Spinner } from '@/components/ui/spinner';

interface FieldModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  field?: FieldDefinition;
  onSubmit: (data: any) => Promise<void>;
}

export function FieldModal({ open, onOpenChange, field, onSubmit }: FieldModalProps) {
  const [formData, setFormData] = useState({
    field_name: '',
    display_name: '',
    format: '',
    required: true,
    description: '',
    example: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (field) {
      setFormData({
        field_name: field.field_name,
        display_name: field.display_name,
        format: field.format || '',
        required: field.required,
        description: field.description || '',
        example: field.example || '',
      });
    } else {
      setFormData({
        field_name: '',
        display_name: '',
        format: '',
        required: true,
        description: '',
        example: '',
      });
    }
    setError('');
  }, [field, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.field_name.trim() || !formData.display_name.trim()) {
        setError('Field name and display name are required');
        setLoading(false);
        return;
      }

      await onSubmit(formData);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{field ? 'Edit Field' : 'Add New Field'}</DialogTitle>
          <DialogDescription>
            {field ? 'Update the field definition' : 'Create a new custom field for naming conventions'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel>Field Name (snake_case)</FieldLabel>
            <Input
              placeholder="e.g., my_field"
              value={formData.field_name}
              onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
              disabled={!!field}
            />
          </Field>

          <Field>
            <FieldLabel>Display Name</FieldLabel>
            <Input
              placeholder="e.g., My Field"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            />
          </Field>

          <Field>
            <FieldLabel>Format (optional)</FieldLabel>
            <Input
              placeholder="e.g., BXXX or Free text"
              value={formData.format}
              onChange={(e) => setFormData({ ...formData, format: e.target.value })}
            />
          </Field>

          <Field>
            <FieldLabel>Description (optional)</FieldLabel>
            <Textarea
              placeholder="Describe what this field is for"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </Field>

          <Field>
            <FieldLabel>Example (optional)</FieldLabel>
            <Input
              placeholder="e.g., B001"
              value={formData.example}
              onChange={(e) => setFormData({ ...formData, example: e.target.value })}
            />
          </Field>

          <div className="flex items-center gap-2">
            <Checkbox
              id="required"
              checked={formData.required}
              onCheckedChange={(checked) => setFormData({ ...formData, required: checked as boolean })}
            />
            <label htmlFor="required" className="text-sm font-medium cursor-pointer">
              Required field
            </label>
          </div>

          {error && <div className="text-sm text-destructive">{error}</div>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                field ? 'Update Field' : 'Add Field'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
