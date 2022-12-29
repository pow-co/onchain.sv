
import { channel, log } from 'rabbi'

import { loadFromFiles } from '../config'

export const exchange = 'onchain.sv'

export const queue = 'index_bmap_from_imported_transaction'

export const routingkey = 'transaction.imported'

import * as models from '../models'

import * as Txo from 'txo'

export default async function start(channel, msg, json) {

  const { txid } = json

  const record = await models.Transaction.findOne({
    where: {
      txid
    }
  })

  if (!txid || !record) { return channel.ack(msg) }

  const txo = await Txo.fromTx(record.txhex)

  console.log(txo, 'TXO')
  
  channel.ack(msg)
}

