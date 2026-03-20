'use client';

import { useEffect, useState } from 'react';
import { NamingConvention } from '@/lib/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Copy, Trash2, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function SavedConventionsPage() {
  const [conventions, setConventions] = useState<NamingConvention[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, get userId from auth context
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);

    if (storedUserId) {
      fetchConventions(storedUserId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchConventions = async (userId: string) => {
    try {
      const response = await fetch(`/api/conventions?user_id=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch conventions');
      const data = await response.json();
      setConventions(data);
    } catch (error) {
      console.error('[v0] Error fetching conventions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/conventions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete convention');
      setConventions(conventions.filter((c) => c.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('[v0] Error deleting convention:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleCopy = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopied(name);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('[v0] Failed to copy:', error);
    }
  };

  if (!userId) {
    return (
      <main className="flex min-h-screen flex-col bg-background">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                You need to sign in to view and manage your saved naming conventions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-8 w-8" />
          <p className="text-muted-foreground">Loading conventions...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Saved Conventions</h1>
            <p className="text-lg text-muted-foreground">
              Manage and reuse your previously created naming conventions
            </p>
          </div>

          {conventions.length === 0 ? (
            <Card className="text-center py-12">
              <CardHeader>
                <CardTitle>No Saved Conventions Yet</CardTitle>
                <CardDescription>
                  Create and save naming conventions from the generator to access them here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <a href="/generator" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Go to Generator
                  </a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {conventions.map((convention) => (
                <Card key={convention.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg">{convention.name}</CardTitle>
                    <CardDescription>
                      Saved{' '}
                      {formatDistanceToNow(new Date(convention.created_at), {
                        addSuffix: true,
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div className="rounded-lg bg-muted p-3 font-mono text-sm break-all">
                      {convention.convention_values &&
                        Object.values(convention.convention_values)
                          .filter((v) => v)
                          .join(convention.separator)}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleCopy(
                            Object.values(convention.convention_values)
                              .filter((v) => v)
                              .join(convention.separator)
                          )
                        }
                        className="flex-1 gap-2"
                      >
                        {copied === Object.values(convention.convention_values)
                          .filter((v) => v)
                          .join(convention.separator) ? (
                          <>
                            <span>✓</span> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteConfirm(convention.id)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Convention</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this saved convention? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete(deleteConfirm!)}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
