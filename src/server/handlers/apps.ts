
import { badRequest, notFound } from 'boom'

const axios = require('axios')

import { onchain } from 'stag-wallet'

import { log } from '../../log'

/*
 * Example index.html
 *
 * https://bitcoinfiles.org/t/697094f61693fd9a849d2d161deeb05b6cf0a9181402e3929dcd93bff0a8d417
 * 
 */
export async function show(req, h) {


  try {

    const { app_id } = req.params

    log.info('onchain.findOne', {
      app: 'onchain.sv',
      type: 'set_index_html',
      author: app_id
    })

    const record = await onchain.findOne({
      app: 'onchain.sv',
      type: 'set_index_html',
      author: app_id
    })

    log.info('onchain.findOne.result', { record })

    if (!record) {
      return notFound()
    }

    if (!record.content.b_file) {
      return notFound()
    }

    let { data } = await axios({
      url: `https://bitcoinfileserver.com/${record.content.b_file}`,
      method: 'GET',
      responseType: 'stream'
    })

    return h.response(data).type('text/html')

  } catch(error) {

    log.error('server.handlers.apps.show.error', error)

    return badRequest(error)

  }

}

