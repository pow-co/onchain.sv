require('dotenv').config()

import { rankContent } from './src/rankings'

async function run() {

    const results = await rankContent({
        app: 'boostpatriots.win',
        type: 'post',
        author: '18h6yhKBBqXQge6XRauMTeEaQ9HF4jR1qV'
    })

    for (let result of results) {

        console.log(result.txid, result.difficulty)

        console.log({
            app: result.app,
            type: result.type,
            difficulty: result.difficulty,
            author: result.author
        })

    }

}

run()
