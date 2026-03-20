'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Settings, Copy, BookOpen, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="flex-1 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="space-y-6 text-center">
            <h2 className="text-5xl font-bold text-balance text-foreground">
              Streamline Your Ad Creative Naming
            </h2>
            <p className="text-xl text-muted-foreground text-balance">
              Create consistent, professional naming conventions for your ad creatives with just a few clicks. Perfect for teams managing complex creative workflows.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/generator">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/documentation">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Zap className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Real-time Preview</CardTitle>
                <CardDescription>
                  See your naming convention formatted instantly as you type
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Copy className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>One-Click Copy</CardTitle>
                <CardDescription>
                  Copy your generated names to clipboard with a single click
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Settings className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Customizable Fields</CardTitle>
                <CardDescription>
                  Add, edit, or remove fields to match your naming requirements
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Detailed Documentation</CardTitle>
                <CardDescription>
                  Each field includes format guides, descriptions, and examples
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* How It Works */}
          <div className="space-y-8 py-12">
            <h3 className="text-center text-3xl font-bold text-foreground">How It Works</h3>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                  1
                </div>
                <h4 className="font-semibold text-foreground">Fill Fields</h4>
                <p className="text-muted-foreground">
                  Enter values for each field in the naming convention form
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                  2
                </div>
                <h4 className="font-semibold text-foreground">Choose Separator</h4>
                <p className="text-muted-foreground">
                  Select how to join the fields: underscore, hyphen, dot, or custom
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                  3
                </div>
                <h4 className="font-semibold text-foreground">Copy & Use</h4>
                <p className="text-muted-foreground">
                  Copy the generated convention to use in your creative files
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted py-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>Naming Convention Ease — Making creative naming simple and consistent</p>
        </div>
      </footer>
    </main>
  );
}
