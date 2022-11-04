require('dotenv').config()

import { rankContent } from './src/rankings'

import * as moment from 'moment'

async function run() {

    const results = await rankContent({
        app: 'boostpatriots.win',
        type: 'post',
        author: '18h6yhKBBqXQge6XRauMTeEaQ9HF4jR1qV',
        start_date: moment().subtract(1, 'week').toDate(),
        end_date: moment().subtract(1, 'week').add(2, 'days').toDate(),
        include_not_boosted: true
    })

    for (let result of results) {

        console.log({
            app: result.app,
            type: result.type,
            difficulty: result.difficulty,
            author: result.author,
            txid: result.txid
        })

    }

}

run()
