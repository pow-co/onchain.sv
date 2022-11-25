require('dotenv').config()

import * as models from './src/models'

async function run() {

  const results = await models.Event.findAll({
    limit: 1000
  })

    //const results = await rankContent()

    for (let result of results) {

        console.log(result.txid)

        console.log({
            app: result.app,
            type: result.type,
        })

    }

}

run()
