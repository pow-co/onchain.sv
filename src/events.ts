
import * as powco from 'powco'

import * as Txo from 'txo'

const isJSON = require('is-json');

import { Bsm } from 'bsv-2'

import * as bsv from 'bsv-2'

import * as models from './models'

interface Event {
  app: string;
  type: string;
  content: any;
  author: string;
  txid: string;
  tx_index: number;
  txo: any;
  media_type: string;
  encoding: string;
}

function parseEventOutputs(txo: Txo): Event[] {

  return txo.out.map((output, index) => {

    const s2 = output.s2.toLowerCase().trim()

    if (s2 === 'onchain.sv' || s2 === 'onchain') {

      console.log({ output })

      const app = output.s3

      if (!app) { return }

      const type = output.s4

      if (!type) { return }

      const s5 = output.s5 || output.ls5

      if (!isJSON(s5)) {

        return
      }

      const content = JSON.parse(s5)

      const result = {
        app,
        type,
        content,
        txo: output,
        media_type: 'application/json',
        encoding: 'utf8'
      }

      if (output.s6 === '|' &&
        (output.s7 === '15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva' || output.s7 === 'AIP') &&
        output.s8 === 'BITCOIN_ECDSA')
      {

        const message = Buffer.from(s5, 'utf8')

        const identity = output.s9
        const signature = output.s10

        if (identity && signature) {
            
            const address = new bsv.Address().fromString(identity)
  
            const verified = bsv.Bsm.verify(message, signature, address)
  
            if (verified) {
  
              result['author'] = identity
  
              result['signature'] = signature
  
            }
  
        }

      }

      result['tx_index'] = index
      result['txid'] = txo['tx']['h']

      return result

    }

  })
  .filter(output => !!output)

}

export async function fetch(txid): Promise<Event[]> {

  const txhex = await powco.fetch(txid)

  console.log('HEX FETCHED', txhex)

  const txo = await Txo.fromTx(txhex)

  console.log({ txo })

  const events: Event[] = parseEventOutputs(txo)

  return events

}

interface EventRecord extends Event {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function importEventsByTxid(txid: string): Promise<EventRecord[]> {

  const events = await fetch(txid)

  return Promise.all(events.map(async (event) => {

    const { txid, tx_index, app, type, content, author, txo, media_type, encoding } = event

    const [record] = await models.Event.findOrCreate({

      where: {

        txid,

        tx_index

      },

      defaults: event
      
    })

    const { id, createdAt, updatedAt } = record

    return Object.assign(event, {

      id,

      createdAt,

      updatedAt

    })

  }))

}
