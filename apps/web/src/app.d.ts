// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare module "*.md" {
  import type { Component } from "svelte";

  const component: Component;
  export default component;

  export const metadata: {
    title: string;
    description: string;
    date: string;
    readingTime: string;
    slug: string;
  };
}

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
