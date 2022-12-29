
require('dotenv').config()

import config from './config'

import { Server } from '@hapi/hapi'

import { log } from './log'

import { join } from 'path'

const Joi = require('joi')

const Pack = require('../package');

import { load } from './server/handlers'

const handlers = load(join(__dirname, './server/handlers'))

export const server = new Server({
  host: config.get('host'),
  port: config.get('port'),
  routes: {
    cors: true,
    validate: {
      options: {
        stripUnknown: true
      }
    }
  }
});

if (config.get('prometheus_enabled')) {

  log.info('server.metrics.prometheus', { path: '/metrics' })

  const { register: prometheus } = require('./metrics')

  server.route({
    method: 'GET',
    path: '/metrics',
    handler: async (req, h) => {
      return h.response(await prometheus.metrics())
    },
    options: {
      description: 'Prometheus Metrics about Node.js Process & Business-Level Metrics',
      tags: ['system']
    }
  })

}

server.route({
  method: 'GET',
  path: '/api/v1/status',
  handler: handlers.Status.index,
  options: {
    description: 'Simply check to see that the server is online and responding',
    tags: ['api', 'system'],
    response: {
      failAction: 'log',
      schema: Joi.object({
        status: Joi.string().valid('OK', 'ERROR').required(),
        error: Joi.string().optional()
      }).label('ServerStatus')
    }
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/events/{txid}',
  handler: handlers.Events.show,
  options: {
    description: 'Show Events Given A Blockchain Transaction ID',
    tags: ['api', 'events'],
    validate: {
      params: Joi.object({ txid: Joi.string().required() }).required(),
    },
    response: {
      failAction: 'log',
      schema: Joi.object({
        events: Joi.array().items(Joi.object({
          id: Joi.number().required(),
          txid: Joi.string().required(),
          tx_index: Joi.number().required(),
          app: Joi.string().required(),
          type: Joi.string().required(),
          content: Joi.any().required(),
          author: Joi.string().optional(),
          createdAt: Joi.date().required()
        }).label('Event'))
      }).label('ShowEvent')
    }
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/events',
  handler: handlers.Events.index,
  options: {
    description: 'List Onchain Events Given A Query',
    tags: ['api', 'events'],
    validate: {
      query: Joi.object({
        limit: Joi.number().optional(),
        offset: Joi.number().optional(),
        sort_by: Joi.string().optional(),
        sort_order: Joi.string().optional(),
        app: Joi.string().optional(),
        type: Joi.string().optional(),
        content: Joi.object().optional(),
        author: Joi.string().optional()
      }).unknown(true).optional()
    },
    response: {
      failAction: 'log',
      schema: Joi.object({
        events: Joi.array().items(Joi.object({
          id: Joi.number().required(),
          txid: Joi.string().required(),
          tx_index: Joi.number().required(),
          app: Joi.string().required(),
          type: Joi.string().required(),
          content: Joi.any().required(),
          author: Joi.string().optional(),
          createdAt: Joi.date().required()
        }).label('Event'))
      }).label('ShowEvent')
    }
  }
})

server.route({
  method: 'POST',
  path: '/api/v1/search/events',
  handler: handlers.Events.search,
  options: {
    description: 'List Onchain Events Given A Query',
    tags: ['api', 'events'],
    validate: {
      payload: Joi.object({
        limit: Joi.number().optional(),
        offset: Joi.number().optional(),
        sort_by: Joi.string().optional(),
        sort_order: Joi.string().optional(),
        app: Joi.string().optional(),
        type: Joi.string().optional(),
        content: Joi.object().optional(),
        author: Joi.string().optional()
      }).unknown(true).optional()
    },
    response: {
      failAction: 'log',
      schema: Joi.object({
        events: Joi.array().items(Joi.object({
          id: Joi.number().required(),
          txid: Joi.string().required(),
          tx_index: Joi.number().required(),
          app: Joi.string().required(),
          type: Joi.string().required(),
          content: Joi.any().required(),
          author: Joi.string().optional(),
          createdAt: Joi.date().required()
        }).label('Event'))
      }).label('ShowEvent')
    }
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/boostpow/rankings',
  handler: handlers.Rankings.index,
  options: {
    description: 'Rank Onchain Events Based on Boost Proof of Work',
    tags: ['api', 'events'],
    validate: {
      query: Joi.object({
        limit: Joi.number().optional(),
        offset: Joi.number().optional(),
        app: Joi.string().optional(),
        type: Joi.string().optional(),
        author: Joi.string().optional(),
        start_date: Joi.number().optional(),
        end_date: Joi.number().optional(),
        include_not_boosted: Joi.boolean().optional()
      }).unknown(true).optional()
    },
    response: {
      failAction: 'log',
      schema: Joi.object({
        events: Joi.array().items(Joi.object({
          id: Joi.number().required(),
          txid: Joi.string().required(),
          tx_index: Joi.number().required(),
          app: Joi.string().required(),
          type: Joi.string().required(),
          content: Joi.any().required(),
          author: Joi.string().optional(),
          difficulty: Joi.number().required(),
          createdAt: Joi.date().required()
        }).label('Event'))
      }).label('ShowEvent')
    }
  }
})

server.route({
  method: 'GET',
  path: '/{app_id}',
  handler: handlers.Apps.show,
  options: {
    description: 'Render On Chain App To Browser',
    tags: ['app']
  }
})

server.route({
  method: 'POST',
  path: '/api/v1/transactions',
  handler: handlers.Transactions.create,
  options: {
    description: 'Import blockchain transaction by transaction hex',
    tags: ['app']
  }
})

server.route({
  method: 'GET',
  path: '/{app_id}/{link_name*}',
  handler: handlers.FileSystemLinks.show,
  options: {
    description: 'Render b:// file given its `ln` protocol link_name',
    tags: ['app', 'fs', 'links']
  }
})

var started = false

export async function start() {

  if (started) return;

  started = true

  if (config.get('swagger_enabled')) {

    const swaggerOptions = {
      info: {
        title: 'Onchain.SV API',
        version: Pack.version,
        description: 'Application data indexing API for modern blockchain applications'
      },
      schemes: ['https'],
      host: 'onchain.sv',
      documentationPath: '/api',
      grouping: 'tags'
    }

    const Inert = require('@hapi/inert');

    const Vision = require('@hapi/vision');

    const HapiSwagger = require('hapi-swagger');

    await server.register([
        Inert,
        Vision,
        {
          plugin: HapiSwagger,
          options: swaggerOptions
        }
    ]);

    log.info('server.api.documentation.swagger', swaggerOptions)
  }

  await server.start();

  log.info(server.info)

  return server;

}

if (require.main === module) {

  console.log('start')

  start()

}
