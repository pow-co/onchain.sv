
import { importEventsByTxid } from '../../events'

import { badRequest } from 'boom'

import { log } from '../../log'

import * as models from '../../models'

import { Op } from 'sequelize'

import isJSON from 'is-json'

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
    
    return badRequest(error)

  }

}

export async function index(req) {

  var { limit, offset, sort_order, sort_by, app, type, author, content } = req.query

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

    const query = req.query

    delete query['limit']
    delete query['sort_by']
    delete query['sort_order']
    delete query['app']
    delete query['type']
    delete query['content']
    delete query['author']


    if (Object.keys(query).length > 0) {

      where['content'] = {}

      Object.keys(query).map(key => {

        console.log("KEY", key)

        where['content'][key] = { [Op.eq]: query[key] }

      })

    }

    console.log('api.handlers.events.index', { where, limit, offset })

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

export async function search(req) {

  var { limit, offset, sort_order, sort_by, app, type, author } = req.payload

  console.log('payload', req.payload)

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

    const query = req.payload

    delete query['limit']
    delete query['sort_by']
    delete query['sort_order']
    delete query['_app']
    delete query['_type']
    delete query['_nonce']

    console.log('api.handlers.events.index', { where: query, limit, offset })

    const events = await models.Event.findAll({

      where: query,

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


