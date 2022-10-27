
import { importEventsByTxid } from '../../events'

import { badRequest } from 'boom'

import { log } from '../../log'

import * as models from '../../models'

import { Op } from 'sequelize'

export async function show(req) {

  try {

    log.info('api.handlers.events.show', req)

    const events = await importEventsByTxid(req.params.txid)

    log.info('api.handlers.events.show.result', events)

    return {
      events: events.map(event => {

        delete event.content['onchain_app']
        delete event.content['onchain_event']
        delete event.content['onchain_nonce']
        delete event['txo']
        delete event['encoding']
        delete event['signature']

        return event

      })
    }

  } catch(error) {

    log.error('api.handlers.events.show.error', error)
    
    badRequest(error)

  }

}

export async function index(req) {

  var { limit, offset, sort_order, sort_by, app, type, author, content_key, content_value } = req.query

  console.log('QUERY', req.query)

  try {

    if (!limit) { limit = 100 }
    if (!offset) { offset = 0 }
    if (!sort_order) { sort_order = 'desc' }
    if (!sort_by) { sort_by = 'createdAt' }

    const where = {}

    if (app) {
      where['app'] = app
    }

    if (type) {
      where['type'] = type
    }

    if (author) {

      where['author'] = author
    }

    log.info('api.handlers.events.show', req)

    if (content_key && content_value) {

      const contains = {}

      const content = {}

      content[`${content_key}`] = { [Op.eq]: content_value }

      where['content'] = content

    }

    const events = await models.Event.findAll({

      where,

      limit, 

      offset,

      order: [[sort_by, sort_order]]

    })

    log.info('api.handlers.events.show.result', events)

    return {
      events: events.map(event => {

        delete event.content['onchain_app']
        delete event.content['onchain_event']
        delete event.content['onchain_nonce']
        delete event['txo']
        delete event['encoding']
        delete event['signature']

        return event

      })
    }

  } catch(error) {

    log.error('api.handlers.events.show.error', error)
    
    return badRequest(error)

  }

}


