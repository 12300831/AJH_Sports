/// <reference types="vite/client" />

// Google API Client Library Type Declarations
declare global {
  interface Window {
    gapi: any;
  }
}

// Allow importing Figma asset pseudo-modules like "figma:asset/....png"
declare module "figma:asset/*" {
  const src: string;
  export default src;
}