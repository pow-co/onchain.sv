
import { rankContent } from "../../rankings"

import { badRequest } from 'boom'

import { log } from '../../log'

import * as moment from 'moment'

export async function index(req, h) {

    try {

        const { query } = req

        if (query.start_date) { query.start_date = moment(query.start_date).toDate() }
        
        if (query.end_date) { query.end_date = moment(query.end_date).toDate() }

        log.error('api.rankings.index', {query})

        const rankings = await rankContent(query)

        log.error('api.rankings.index.result', rankings)

        return { rankings }


    } catch(error) {

        log.error('api.rankings.index.errr', error)

        return badRequest(error)

    }

}