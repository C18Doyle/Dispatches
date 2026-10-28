import defaults from "./labels.json";
import { ui } from "./game";

/**
 * The words the screens put around the story, one copy deck: headings and buttons are in Title Case, notes and running text in sentence case.
 * labels.json is the shared deck; a seat's ui.json may carry `labels` to say any of them in its own voice.
 */
export type Labels = typeof defaults;
export const L: Labels = { ...defaults, ...(ui.labels ?? {}) } as Labels;

/** Fills `{name}` holes in a label. */
export function fill(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (_, key: string) => (key in values ? String(values[key]) : `{${key}}`));
}
