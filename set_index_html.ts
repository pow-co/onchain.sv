
import { onchain } from 'stag-wallet'

import { log } from './src/log'

async function start() {

  const author = '18h6yhKBBqXQge6XRauMTeEaQ9HF4jR1qV'

  const b_file = '697094f61693fd9a849d2d161deeb05b6cf0a9181402e3929dcd93bff0a8d417'

  log.info('onchain.set_index_html', { author, b_file })

  const existing = await onchain.findOne({
    app: 'onchain.sv',
    key: 'set_index_html',
    author
  })

  if (existing) {

    log.info('onchain.set_index_html.found', existing)

  }
  
  if (existing && existing.content.b_file === b_file) {

    log.info('onchain.set_index_html.already_set', { existing, b_file })

    return

  }

  log.info('onchain.set_index_html.updating', { b_file })

  const result = await onchain.post({
    app: 'onchain.sv',
    key: 'set_index_html',
    val: {
      b_file
    }
  })

  log.info('onchain.set_index_html.updated', result)

}

start()

