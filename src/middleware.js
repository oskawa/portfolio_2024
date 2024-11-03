// src/middleware.js

import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname, origin } = request.nextUrl;

  console.log("Current path:", pathname);

  // If accessing the root path, redirect to /fr
  if (pathname === '/') {
    console.log("Redirecting to /fr");
    // Use new URL to create an absolute URL
    return NextResponse.redirect(new URL('/fr', origin));
  }

  // Allow all other paths to proceed
  return NextResponse.next();
}
