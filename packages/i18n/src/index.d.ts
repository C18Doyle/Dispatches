export interface Language {
  code: string;
  name: string;
}
export const LANGUAGES: Language[];
export type Params = Record<string, unknown> & { context?: string };
/** The text for a message in the current language (English when there is no translation). */
export function t(msg: string, params?: Params): string;
/** Marks a text written at module level as translatable; returns it unchanged. Show it with t(). */
export function T<S extends string>(s: S): S;
export function registerTables(add: Record<string, Record<string, string>>): void;
export function getLanguage(): string;
export function hasLanguage(code: string): boolean;
export function matchLanguage(browserLanguages: readonly string[]): string;
export function setLanguage(code: string, options?: { persist?: boolean }): string;
export function initLanguage(options?: { key?: string; browserLanguages?: readonly string[] }): string;
export function subscribe(fn: () => void): () => void;
export function format(msg: string, params?: Params, lang?: string): string;
export function tablesOf(): Record<string, Record<string, string>>;
