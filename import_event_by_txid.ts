
import { fetch, importEventsByTxid } from './src/events'

async function start() {

  const txid = 'a2bd24141a421db1030b82614d1874a9f9294ebb253f1cd608c64c78e3558e14'

  const events = await importEventsByTxid(txid)

  for (let event of events) {

    console.log('event', event)

  }

}

start()


