
import config from './config'

import { start as server } from './server'

import { start as actors } from './rabbi/actors'

//import { sync } from './powco'

import { start as sync } from '../import_powco_work'

export async function start() {


  if (config.get('http_api_enabled')) {

    console.log('api server enabled')

    server();

  }

  if (config.get('amqp_enabled')) {

    actors();

  }

  sync()

}

if (require.main === module) {

  start()

}
