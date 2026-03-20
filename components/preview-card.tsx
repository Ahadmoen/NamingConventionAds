'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Save } from 'lucide-react';
import { useState } from 'react';

interface PreviewCardProps {
  convention: string;
  isValid: boolean;
  onSave?: () => void;
}

export function PreviewCard({ convention, isValid, onSave }: PreviewCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(convention);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('[v0] Failed to copy:', error);
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle>Generated Naming Convention</CardTitle>
        <CardDescription>Your formatted convention will appear here</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-lg bg-muted p-4 font-mono text-lg">
          {convention ? (
            <span className="break-all text-foreground">{convention}</span>
          ) : (
            <span className="text-muted-foreground">Fill in the fields above to generate...</span>
          )}
        </div>
        <div className="grid gap-2">
          <Button
            onClick={handleCopy}
            disabled={!convention || !isValid}
            className="w-full"
            variant="default"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
          <Button
            onClick={onSave}
            disabled={!convention || !isValid}
            className="w-full"
            variant="outline"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Convention
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
