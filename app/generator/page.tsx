'use client';

import { useEffect, useState } from 'react';
import { ConventionForm } from '@/components/convention-form';
import { PreviewCard } from '@/components/preview-card';
import { SaveConventionModal } from '@/components/save-convention-modal';
import { FieldDefinition, FormValues } from '@/lib/schema';
import { generateNamingConvention, validateFormValues } from '@/lib/conventions';
import { Spinner } from '@/components/ui/spinner';

export default function GeneratorPage() {
  const [fields, setFields] = useState<FieldDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [convention, setConvention] = useState('');
  const [separator, setSeparator] = useState('_');
  const [formValues, setFormValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await fetch('/api/fields');
        if (!response.ok) throw new Error('Failed to fetch fields');
        const data = await response.json();
        setFields(data);
      } catch (error) {
        console.error('[v0] Error fetching fields:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  const handleValuesChange = (values: FormValues, newSeparator: string) => {
    setFormValues(values);
    setSeparator(newSeparator);
    
    // Validate form
    const validationErrors = validateFormValues(values, fields);
    setErrors(validationErrors);
    
    // Generate convention
    if (Object.keys(validationErrors).length === 0) {
      const generated = generateNamingConvention(values, newSeparator, fields);
      setConvention(generated);
    } else {
      setConvention('');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-8 w-8" />
          <p className="text-muted-foreground">Loading fields...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 space-y-2">
            <h1 className="text-4xl font-bold text-foreground">
              Naming Convention Generator
            </h1>
            <p className="text-lg text-muted-foreground">
              Create consistent, professional naming conventions for your ad creatives
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <ConventionForm fields={fields} onValuesChange={handleValuesChange} />
            </div>
            <div className="md:col-span-1">
              <div className="sticky top-20">
                <PreviewCard 
                  convention={convention} 
                  isValid={Object.keys(errors).length === 0}
                  onSave={() => setSaveModalOpen(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SaveConventionModal
        open={saveModalOpen}
        onOpenChange={setSaveModalOpen}
        convention={convention}
        formValues={formValues}
        separator={separator}
      />
    </main>
  );
}
