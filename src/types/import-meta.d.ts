interface ImportMeta {
  readonly env: {
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly SSR: boolean;
  };
  glob<T>(pattern: string, options?: { eager?: boolean; query?: string; import?: string }): Record<string, T>;
}
