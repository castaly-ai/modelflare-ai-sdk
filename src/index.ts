import { createOpenAICompatible, type OpenAICompatibleProvider } from '@ai-sdk/openai-compatible'
import { ATTRIBUTION_HEADER, KEYS_URL, attributionValue, resolveBaseUrl, signUpUrl } from '@modelflare/core'

const VERSION = __MODELFLARE_PLUGIN_VERSION__

export interface ModelflareProviderSettings {
  /** Smart API Key. Defaults to the `MODELFLARE_API_KEY` environment variable, read per request. */
  apiKey?: string
  /** `global` (default), `china`, or a custom base URL. Defaults to `MODELFLARE_BASE_URL`. */
  baseURL?: string
  /** Extra request headers. */
  headers?: Record<string, string>
  /** Custom fetch implementation. */
  fetch?: typeof globalThis.fetch
}

export type ModelflareProvider = OpenAICompatibleProvider<string, string, string, string>

function environment(name: string): string | undefined {
  return typeof process === 'undefined' ? undefined : process.env[name]
}

/**
 * Creates a Modelflare provider. With a Smart API Key every model available to
 * your account works, including models released after this package.
 */
export function createModelflare(settings: ModelflareProviderSettings = {}): ModelflareProvider {
  const baseFetch = settings.fetch ?? globalThis.fetch
  return createOpenAICompatible({
    name: 'modelflare',
    baseURL: resolveBaseUrl(settings.baseURL ?? environment('MODELFLARE_BASE_URL')),
    headers: { ...settings.headers, [ATTRIBUTION_HEADER]: attributionValue('modelflare-ai-sdk', VERSION) },
    includeUsage: true,
    // The key is resolved when a request is sent, so the default `modelflare`
    // instance works even if the environment is loaded after import.
    fetch: async (input, init) => {
      const headers = new Headers(init?.headers)
      if (!headers.has('authorization')) {
        const apiKey = settings.apiKey ?? environment('MODELFLARE_API_KEY')
        if (!apiKey) {
          throw new Error(
            `Modelflare API key is missing. Pass apiKey or set MODELFLARE_API_KEY. Create a Smart API Key at ${KEYS_URL}; no account yet: ${signUpUrl('ai-sdk')}`,
          )
        }
        headers.set('Authorization', `Bearer ${apiKey}`)
      }
      return baseFetch(input, { ...init, headers })
    },
  })
}

/** Default provider using `MODELFLARE_API_KEY` and `MODELFLARE_BASE_URL`. */
export const modelflare = createModelflare()
