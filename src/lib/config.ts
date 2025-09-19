type RuntimeEnv = {
  NEXT_PUBLIC_API_BASE_URL?: string;
  NEXT_PUBLIC_FORMSPREE_ID?: string;
} & Record<string, string | undefined>;

/* Reads a value from process.env when running in Next.js. */
function readProcessEnv<T extends keyof RuntimeEnv>(key: T): RuntimeEnv[T] | undefined {
  if (typeof process !== "undefined" && process.env) {
    return process.env[key] as RuntimeEnv[T] | undefined;
  }
  return undefined;
}

/* Resolves values from Vite's import.meta.env when available. */
function readViteEnv(key: string): string | undefined {
  try {
    const viteEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
    const value = viteEnv?.[key];
    return typeof value === "string" && value.length > 0 ? value : undefined;
  } catch (error) {
    // import.meta is undefined in Node/Next runtime; ignore.
    return undefined;
  }
}

/* Resolves API base URL in both Vite (import.meta.env) and Next (process.env) runtimes. */
function resolveApiBaseUrl(): string {
  const fromProcess = readProcessEnv("NEXT_PUBLIC_API_BASE_URL");
  if (fromProcess) {
    return fromProcess;
  }

  const fromVite = readViteEnv("VITE_API_BASE_URL");
  if (fromVite) {
    return fromVite;
  }

  return "/api";
}

function resolveFormspreeFormId(): string | undefined {
  const fromProcess = readProcessEnv("NEXT_PUBLIC_FORMSPREE_ID");
  if (fromProcess) {
    return fromProcess;
  }

  return readViteEnv("VITE_FORMSPREE_ID");
}

export const API_BASE_URL = resolveApiBaseUrl();
export const FORMSPREE_FORM_ID = resolveFormspreeFormId();
