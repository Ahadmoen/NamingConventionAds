'use client';

import { useEffect, useState } from 'react';
import { FieldDefinition } from '@/lib/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';

export default function DocumentationPage() {
  const [fields, setFields] = useState<FieldDefinition[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-8 w-8" />
          <p className="text-muted-foreground">Loading documentation...</p>
        </div>
      </div>
    );
  }

  const sortedFields = [...fields].sort((a, b) => a.field_order - b.field_order);

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Field Documentation</h1>
            <p className="text-lg text-muted-foreground">
              Complete guide to all fields used in naming conventions. Each field has specific formatting requirements and examples.
            </p>
          </div>

          <div className="grid gap-6">
            {sortedFields.map((field, index) => (
              <Card key={field.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                          {index + 1}
                        </span>
                        <CardTitle>{field.display_name}</CardTitle>
                        <Badge variant={field.required ? 'default' : 'secondary'}>
                          {field.required ? 'Required' : 'Optional'}
                        </Badge>
                      </div>
                      <CardDescription className="font-mono text-sm">
                        Field name: {field.field_name}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {field.description && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Description</h4>
                      <p className="text-muted-foreground">{field.description}</p>
                    </div>
                  )}

                  {field.format && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Format</h4>
                      <div className="rounded-lg bg-muted p-3 font-mono text-sm text-foreground">
                        {field.format}
                      </div>
                    </div>
                  )}

                  {field.example && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Example</h4>
                      <div className="rounded-lg bg-muted p-3 font-mono text-sm text-foreground">
                        {field.example}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {fields.length === 0 && (
            <Card className="text-center py-12">
              <p className="text-muted-foreground">No fields defined yet</p>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
