// Global type declarations for packages without type definitions

declare module 'aria-query' {
  export const elementRoles: Map<string, Set<string>>;
  export const roles: Map<string, any>;
}

declare module 'shimmer' {
  const shimmer: (width: number, height: number) => string;
  export default shimmer;
}

declare module 'stack-utils' {
  class StackUtils {
    constructor(options?: any);
    clean(stack: string): string;
  }
  export = StackUtils;
}

// Suppress implicit any errors for these modules
declare module 'tough-cookie';
declare module 'yargs-parser';
declare module 'estree';
declare module 'json-schema';

// Database type modules (if not using them, just declare as any)
declare module 'mysql';
declare module 'pg';
declare module 'pg-pool';
declare module 'tedious';

// Babel modules
declare module '@babel/core';
declare module '@babel/generator';
declare module '@babel/template';
declare module '@babel/traverse';

// Test-related modules
declare module 'istanbul-lib-coverage';
declare module 'istanbul-lib-report';
declare module 'istanbul-reports';
declare module 'jsdom';

// Utility modules
declare module 'connect';