import { spawnSync } from 'child_process'

import { transform } from '../src/transform'

const code = `
import { arrayFirst, result } from 'https://esm.sh/deeno-module-test'

console.log(result)
console.log(arrayFirst([1,2,3]))
`

;(async () => {
    const { code: js } = await transform(code)

    console.log('transformed js', js)

    spawnSync(
        'node',
        [
            '-e',
            js
        ],
        {
            stdio: 'inherit'
        }
    )
})()
