export class StringInterner {
  private stringToId: Map<string, u32> = new Map<string, u32>();
  private idToString: string[] = [];

  intern(str: string): u32 {
    if (this.stringToId.has(str)) {
      return this.stringToId.get(str);
    }
    const id: u32 = this.idToString.length;
    if (id > 0xffffffff) throw new Error("Too many interned strings for u32");
    this.stringToId.set(str, id);
    this.idToString[id] = str;
    return id;
  }

  resolve(id: u32): string | null {
    return this.idToString[id];
  }

  has(str: string): bool {
    return this.stringToId.has(str);
  }

  get size(): u32 {
    return this.idToString.length;
  }

  clear(): void {
    this.stringToId.clear();
    this.idToString = [];
  }

  export(): string[] {
    return this.idToString;
  }
  import(data: string[]): void {
    this.clear();
    for (let i = 0; i < data.length; i++) {
      const key = data[i];
      this.stringToId.set(key, i);
      this.idToString[i] = key;
    }
  }
}
