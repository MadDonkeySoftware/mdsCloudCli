export type Cache = {
  set(key: string, value: unknown): void;
  get(key: string): unknown;
  remove(key: string): void;
  removeAll(): void;
};

export class InMemoryCache implements Cache {
  private data: Map<string, unknown> = new Map();

  set(key: string, value: unknown): void {
    this.data.set(key, value);
  }

  get(key: string): unknown {
    return this.data.get(key);
  }

  remove(key: string): void {
    this.data.delete(key);
  }

  removeAll(): void {
    this.data.clear();
  }
}
