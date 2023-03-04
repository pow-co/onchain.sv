

import axios from 'axios'

import { importProofsFromTxHex, importProofsFromTxId } from './boostpow'

import * as models from './models'

import * as moment from 'moment'

import { log } from './log'

import delay from 'delay'

export async function run() {

  log.info('crawlers.import_powco_work.start')

  const [storage] = await models.KeyValue.findOrCreate({
    where: {
      key: 'powco_work_importer'
    },
    defaults: {
      key: 'powco_work_importer',
      value: {
        start_timestamp: 0
      }
    }
  })

  const { start_timestamp } = storage.value

  const limit = 25

  let offset = 0

  while (true) {

    const { data } = await axios.get(`https://pow.co/api/v1/boost/work?start=${start_timestamp}&offset=${offset}&limit=${limit}`)

    if (data.work.length === 0) {

      await delay(5000)

      continue;

    }

    for (let { tx_hex, content, timestamp, spend_tx_id: tx_id } of data.work) {

      try {

        if (tx_hex) {

          await importProofsFromTxHex({ tx_hex })

        } else if (tx_id) {

          await importProofsFromTxId({ tx_id })

        }

        storage.value = {
          start_timestamp: moment(timestamp).unix()
        }

        await storage.save()

      } catch(error) {

        log.error('crawlers.import_powco_work', error)

      }

    }

    offset += limit

  }

  log.info('crawlers.import_powco_work.end')

}

export async function sync() {

  while (true) {

    try {

      await run()

    } catch(error) {

      log.error("crawlers.import_powco_work.error", error)

    }

    await delay(5200)

  }

}

