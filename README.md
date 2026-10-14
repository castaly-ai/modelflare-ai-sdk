# Modelflare provider for the Vercel AI SDK

One Modelflare **Smart API Key** for every model available to your account — GPT, Claude, Gemini and more — in the [AI SDK](https://ai-sdk.dev).

一个 Modelflare **Smart API Key**，在 AI SDK 里调用你账号可用的全部模型。

## Get a Smart API Key / 获取 Smart API Key

1. Sign up / 注册: https://modelflare.dev/sign-up?utm_source=ai-sdk&utm_medium=plugin&utm_campaign=integrations
2. Console → API Keys → **Create Smart API Key**, and pick a routing strategy (Balanced / Stability first / Low price first).

## Install / 安装

```bash
npm install @modelflare/ai-sdk-provider ai
```

## Use / 使用

```ts
import { generateText } from 'ai'
import { modelflare } from '@modelflare/ai-sdk-provider'

// Reads MODELFLARE_API_KEY (and optional MODELFLARE_BASE_URL) per request.
const { text } = await generateText({
  model: modelflare('<model-id>'),
  prompt: 'Write a haiku about routers.',
})
```

Model IDs are those your key lists at `GET https://modelflare.dev/v1/models`; new models work without updating this package.

```ts
import { createModelflare } from '@modelflare/ai-sdk-provider'

const modelflare = createModelflare({
  apiKey: process.env.MODELFLARE_API_KEY,
  baseURL: 'china', // 'global' (default), 'china', or a custom URL
})
```

| Option | Value |
|---|---|
| `apiKey` | your Smart API Key (default `MODELFLARE_API_KEY`) |
| `baseURL` | `global` → https://modelflare.dev/v1 (default) · `china` → https://origin.modelflare.dev/v1 · or a custom URL (default `MODELFLARE_BASE_URL`) |
| `headers` | extra request headers |
| `fetch` | custom fetch implementation |

Chat models use `modelflare(id)` or `modelflare.chatModel(id)`. OpenAI-compatible image models (not Gemini image models) work with `modelflare.imageModel(id)`. Routing across groups, fallback and the routing strategy are handled by the Smart API Key on the server.

## Links

Docs: https://docs.modelflare.dev/ · Pricing: https://modelflare.dev/pricing

## License

MIT © Havenbyte LLC
