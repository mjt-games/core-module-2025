import { describe, expect, test } from "vitest";
import { loadWasm } from "./loadWasm.js";

{
  const instance = await loadWasm();
  const { internString, resolveString, exportStrings, importStrings } =
    instance;
  describe("internStrings", () => {
    const strings = ["hello", "there", "foo"];
    test("internString", async () => {
      const result = internString(strings[0]);
      expect(result).toBe(0);
    });
    test("same string should be same ID", async () => {
      const result = internString(strings[0]);
      expect(result).toBe(0);
    });
    test("new string should be new ID", async () => {
      const result = internString(strings[1]);
      expect(result).toBe(1);
    });
    test("intern resolves to same string", async () => {
      const result = internString(strings[2]);
      expect(resolveString(result)).toBe(strings[2]);
    });

    test("exportStrings", async () => {
      const result = exportStrings();
      expect(result).toEqual(strings);
    });

    test("importStrings", async () => {
      const newStrings = ["bar", "baz", "qux"];
      importStrings(newStrings);
      expect(exportStrings()).toEqual(newStrings);
    });
    test(
      "big import and export",
      {
        timeout: 400,
      },
      async () => {
        const newStrings = Array.from(
          { length: 100_000 },
          (_, i) => `string${i}`
        );
        importStrings(newStrings);
        expect(exportStrings()).toEqual(newStrings);
      }
    );
  });
}
