require('dotenv').config()

import { rankTags } from './src/rankings'

async function run() {

    const results = await rankTags()

    for (let result of results) {

        console.log(result)

    }

}

run()
