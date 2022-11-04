
import { rankContent } from "../../rankings"

import { badRequest } from 'boom'

import { log } from '../../log'

export async function index(req, h) {

    const { app, type, author } = req.query

    try {

        const rankings = await rankContent({
            app, type, author
        })

        log.error('api.rankings.index.result', rankings)

        return { rankings }


    } catch(error) {

        log.error('api.rankings.index.errr', error)

        return badRequest(error)

    }

}