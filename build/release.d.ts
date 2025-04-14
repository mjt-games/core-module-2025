declare namespace __AdaptedExports {
  /** Exported memory */
  export const memory: WebAssembly.Memory;
  /**
   * assembly/internString/internString
   * @param str `~lib/string/String`
   * @returns `u32`
   */
  export function internString(str: string): number;
  /**
   * assembly/internString/resolveString
   * @param id `u32`
   * @returns `~lib/string/String | null`
   */
  export function resolveString(id: number): string | null;
  /**
   * assembly/internString/exportStrings
   * @returns `~lib/array/Array<~lib/string/String>`
   */
  export function exportStrings(): Array<string>;
  /**
   * assembly/internString/importStrings
   * @param data `~lib/array/Array<~lib/string/String>`
   */
  export function importStrings(data: Array<string>): void;
}
/** Instantiates the compiled WebAssembly module with the given imports. */
export declare function instantiate(module: WebAssembly.Module, imports: {
  env: unknown,
}): Promise<typeof __AdaptedExports>;
