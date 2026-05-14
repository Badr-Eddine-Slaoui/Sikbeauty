/**
 * Safe server-side fetch helper.
 * Restricts requests to the trusted internal API host only.
 */

const ALLOWED_HOSTS = ['back-end', 'localhost'];

function getInternalApiUrl() {
  const url = process.env.INTERNAL_API_URL || 'http://back-end:3000/api/v1';
  try {
    const parsed = new URL(url);
    if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
      throw new Error(`Untrusted API host: ${parsed.hostname}`);
    }
    return url.replace(/\/$/, '');
  } catch {
    return 'http://back-end:3000/api/v1';
  }
}

export const INTERNAL_API_URL = getInternalApiUrl();

/**
 * Fetch wrapper that only allows requests to the trusted internal API.
 */
export async function internalFetch(path, options = {}) {
  if (!path.startsWith('/')) path = `/${path}`;
  const url = `${INTERNAL_API_URL}${path}`;
  // Re-validate the final URL
  const parsed = new URL(url);
  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    throw new Error(`Blocked request to untrusted host: ${parsed.hostname}`);
  }
  return fetch(url, options);
}
