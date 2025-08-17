"use client";

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

/**
 * Navbar component renders the top navigation bar. It supports RTL layout and
 * highlights the active route. On small screens, the menu collapses into a
 * toggler.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const linkClasses = (href: string) =>
    clsx(
      'px-3 py-2 rounded-md text-sm font-medium',
      pathname === href
        ? 'bg-primary text-white'
        : 'text-gray-200 hover:bg-primary hover:text-white'
    );

  return (
    <nav className="bg-secondary border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <span className="text-white font-bold text-xl">Alpha Drive</span>
            </Link>
          </div>
          {/* Mobile menu button */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setOpen((prev) => !prev)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-primary focus:outline-none focus:bg-primary"
              aria-controls="mobile-menu"
              aria-expanded={open}
            >
              <span className="sr-only">פתח תפריט</span>
              {/* Icon bars */}
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
          {/* Desktop menu */}
          <div className="hidden sm:block">
            <div className="flex space-x-4">
              <Link href="/" className={linkClasses('/')}>בית</Link>
              <Link href="/listings" className={linkClasses('/listings')}>
                קנייה
              </Link>
              <Link href="/sell" className={linkClasses('/sell')}>
                מכירה
              </Link>
              <Link href="/admin" className={linkClasses('/admin')}>
                ניהול
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile menu panel */}
      {open && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className={linkClasses('/')} onClick={() => setOpen(false)}>
              בית
            </Link>
            <Link href="/listings" className={linkClasses('/listings')} onClick={() => setOpen(false)}>
              קנייה
            </Link>
            <Link href="/sell" className={linkClasses('/sell')} onClick={() => setOpen(false)}>
              מכירה
            </Link>
            <Link href="/admin" className={linkClasses('/admin')} onClick={() => setOpen(false)}>
              ניהול
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}