// load .env file (requires Node v20+)
process.loadEnvFile();

export function getEnvVar(name, fallback) {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(
      `${name} Environment Variable is not set. Add it to .env file`,
    );
  }

  return value;
}
