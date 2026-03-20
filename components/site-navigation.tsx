'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';

export function SiteNavigation() {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">NCE</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/generator">
              <Button variant="ghost">Generator</Button>
            </Link>
            <Link href="/documentation">
              <Button variant="ghost">Documentation</Button>
            </Link>
            <Link href="/saved">
              <Button variant="ghost">Saved</Button>
            </Link>
            <Link href="/admin/fields">
              <Button variant="ghost">Admin</Button>
            </Link>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button size="icon" variant="ghost">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/generator">Generator</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/documentation">Documentation</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/saved">Saved</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/fields">Admin</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
