/// <reference types="vite/client" />

// Allow importing Figma asset pseudo-modules like "figma:asset/....png"
declare module "figma:asset/*" {
  const src: string;
  export default src;
}