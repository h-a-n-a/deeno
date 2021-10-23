import { build, Plugin } from 'esbuild'
import { URL } from 'url'
import { builtinModules } from 'module'
import fetch from 'node-fetch'

import { isValidURL } from './utils'

const resolvePlugin: Plugin = {
    name: 'url-resolve',
    setup (build) {
        build.onResolve({ filter: /.*/ }, args => {
            if (builtinModules.includes(args.path)) {
                return {
                    path: args.path,
                    external: true
                }
            }

            if (isValidURL(args.importer)) {
                return {
                    path: new URL(args.path, args.importer).href,
                    namespace: 'url-resolve-ns'
                }
            }

            if (isValidURL(args.path)) {
                return {
                    path: args.path,
                    namespace: 'url-resolve-ns'
                }
            }

            return {
                path: args.path
            }
        })

        build.onLoad({ filter: /.*/, namespace: 'url-resolve-ns' }, async ({ path, pluginData }) => {
            const code = await fetch(path).then(res => res.text())

            return {
                contents: code
            }
        })
    }
}

export const transform = async (code: string) => {
    const { outputFiles, warnings } = await build({
        write: false,
        bundle: true,
        format: 'cjs',
        sourcemap: 'inline',
        platform: 'node',
        plugins: [resolvePlugin],
        stdin: {
            contents: code
        }
    })

    return {
        code: outputFiles[0].text,
        warnings
    }
}
