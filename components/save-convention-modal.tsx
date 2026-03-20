'use client';

import { useState } from 'react';
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
import { Spinner } from '@/components/ui/spinner';
import { FormValues } from '@/lib/schema';

interface SaveConventionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  convention: string;
  formValues: FormValues;
  separator: string;
}

export function SaveConventionModal({
  open,
  onOpenChange,
  convention,
  formValues,
  separator,
}: SaveConventionModalProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!name.trim()) {
        setError('Please enter a name for this convention');
        setLoading(false);
        return;
      }

      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Please sign in to save conventions');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/conventions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          name,
          convention_values: formValues,
          separator,
        }),
      });

      if (!response.ok) throw new Error('Failed to save convention');

      setName('');
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
          <DialogTitle>Save Convention</DialogTitle>
          <DialogDescription>
            Give this naming convention a memorable name to save it for later
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-3 font-mono text-sm break-all">
            {convention}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field>
              <FieldLabel>Convention Name</FieldLabel>
              <Input
                placeholder="e.g., Q1 2024 UGC Campaign"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </Field>

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
                  'Save Convention'
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
