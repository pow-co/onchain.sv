
import { badRequest } from 'boom'

import * as models from '../../models'

import { Transaction } from 'bsv'

import { publish } from 'rabbi'

import { fetch, broadcast } from 'powco'

export async function create(request, h) {

    try {

        const transaction = new Transaction(request.payload.transaction)

        const isOnChain = await fetch(transaction.hash)

        if (!isOnChain) {
                
                const broadcastResult = await broadcast(request.payload.transaction)
    
                if (!broadcastResult) {
    
                    throw new Error('Transaction not broadcasted')
    
                }
        }

        const [record, isNew] = await models.Transaction.findOrCreate({
            where: {
                txid: transaction.hash
            },
            defaults: {
                txid: transaction.hash,
                txhex: request.payload.transaction
            }
        })   
        
        if (isNew) {
            console.log("transaction.imported", record.toJSON())
            publish('onchain.sv', 'transaction.imported', { txid: record.txid})
        }

        return {
            record: record.toJSON(),
            isNew
        }


    } catch(error) {

            console.error('Error creating transaction', error)
            
            return badRequest(error.message)
    }


}
