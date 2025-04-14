import { readFile } from "fs/promises";
import path from "path";
import { instantiate } from "../build/release";


export const loadWasm = async (wasmPath = "../build/release.wasm") => {
  const wasmBytes = await readFile(path.resolve(__dirname, wasmPath));
  const module = await WebAssembly.compile(wasmBytes);
  const instance = await instantiate(module, {
    env: {},
  });
  return instance;
};
