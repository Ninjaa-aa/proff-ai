// // middleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { verifyToken } from '@/lib/auth';

// export function middleware(request: NextRequest) {
//   // Add paths that require authentication
//   const protectedPaths = ['/chatbot'];
//   const publicPaths = ['/', '/login', '/signup'];
  
//   const path = request.nextUrl.pathname;
//   const token = request.cookies.get('token')?.value;
  
//   // Allow public paths
//   if (publicPaths.includes(path)) {
//     // If user is already logged in, redirect to chatbot from login/signup
//     if (token && (path === '/login' || path === '/signup')) {
//       return NextResponse.redirect(new URL('/chatbot', request.url));
//     }
//     return NextResponse.next();
//   }

//   // Check if the current path is protected
//   if (protectedPaths.includes(path)) {
//     if (!token) {
//       const url = new URL('/login', request.url);
//       url.searchParams.set('redirectTo', path);
//       return NextResponse.redirect(url);
//     }

//     // Verify token
//     const decoded = verifyToken(token);
//     if (!decoded) {
//       const url = new URL('/login', request.url);
//       url.searchParams.set('redirectTo', path);
//       return NextResponse.redirect(url);
//     }
//   }
  
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/chatbot', '/login', '/signup', '/']
// };