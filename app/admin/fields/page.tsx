'use client';

import { useEffect, useState } from 'react';
import { FieldDefinition } from '@/lib/schema';
import { FieldManagementTable } from '@/components/field-management-table';
import { FieldModal } from '@/components/field-modal';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Plus } from 'lucide-react';

export default function AdminFieldsPage() {
  const [fields, setFields] = useState<FieldDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<FieldDefinition | undefined>();

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      setLoading(true);
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

  const handleAddField = () => {
    setSelectedField(undefined);
    setModalOpen(true);
  };

  const handleEditField = (field: FieldDefinition) => {
    setSelectedField(field);
    setModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      const userId = localStorage.getItem('userId'); // In real app, get from auth
      
      if (selectedField) {
        // Update existing field
        const response = await fetch('/api/admin/fields', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId || '',
          },
          body: JSON.stringify({
            id: selectedField.id,
            ...data,
          }),
        });
        if (!response.ok) throw new Error('Failed to update field');
      } else {
        // Create new field
        const response = await fetch('/api/admin/fields', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId || '',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create field');
      }

      await fetchFields();
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`/api/admin/fields?id=${fieldId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': userId || '',
        },
      });
      if (!response.ok) throw new Error('Failed to delete field');
      
      await fetchFields();
    } catch (error) {
      throw error;
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
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">Field Management</h1>
              <p className="text-lg text-muted-foreground">
                Add, edit, and manage the fields used in naming conventions
              </p>
            </div>
            <Button onClick={handleAddField} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Field
            </Button>
          </div>

          <FieldManagementTable
            fields={fields}
            onEdit={handleEditField}
            onDelete={handleDeleteField}
          />
        </div>
      </div>

      <FieldModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        field={selectedField}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
