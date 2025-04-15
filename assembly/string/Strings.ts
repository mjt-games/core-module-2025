import { StringInterner } from "./StringInterner";

export const interner = new StringInterner();

export function internString(str: string): u32 {
  return interner.intern(str);
}

export function resolveString(id: u32): string | null {
  return interner.resolve(id);
}

export function exportStrings(): string[] {
  return interner.export();
}

export function importStrings(data: string[]): void {
  interner.import(data);
}
