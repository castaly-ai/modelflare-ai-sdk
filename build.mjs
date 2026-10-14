import { execFileSync } from 'node:child_process'
import { copyFile, readFile, rm } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { build } from 'esbuild'

const root = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))

await build({
  entryPoints: [path.join(root, 'src/index.ts')],
  outfile: path.join(root, 'dist/index.js'),
  bundle: true,
  platform: 'neutral',
  format: 'esm',
  target: 'es2022',
  sourcemap: true,
  // Runtime dependencies come from npm; @modelflare/core is bundled.
  external: Object.keys(pkg.dependencies ?? {}).flatMap((name) => [name, `${name}/*`]),
  alias: { '@modelflare/core': path.join(root, './shared/core-ts/src/index.ts') },
  define: { __MODELFLARE_PLUGIN_VERSION__: JSON.stringify(pkg.version) },
  logLevel: 'info',
})

// The public types do not reference @modelflare/core, so only this package's
// declaration is published.
const tsc = createRequire(import.meta.url).resolve('typescript/bin/tsc')
execFileSync(process.execPath, [tsc, '-p', path.join(root, 'tsconfig.build.json')], { stdio: 'inherit' })
// tsconfig.build.json sets rootDir to the parent directory, so declarations
// land under this package's directory name.
await copyFile(path.join(root, 'dist-types', path.basename(root), 'src/index.d.ts'), path.join(root, 'dist/index.d.ts'))
await rm(path.join(root, 'dist-types'), { recursive: true, force: true })
