
import { Op } from 'sequelize'
import { log } from './log';

import * as models from './models'

const { sequelize } = models

interface RankContent {
    start_date?: Date;
    end_date?: Date;
    tag?: string;
    images?: boolean;
    app?: string;
    type?: string;
    content?: any;
    author?: string;
}

interface Rankings {
    query: RankContent;
    result: RankedContent;
}

interface RankedContent {
  txid: string;
  content: string;
  difficulty: number;
  rank: number;
  tag: number;
  app: string;
  type: string;
  author?: string;
}

export async function rankContent (params: RankContent = {}): Promise<RankedContent[]> {

    const where = {}

    if (params.start_date) {
  
      where['timestamp'] = {
        [Op.gte]: params.start_date
      }
    
    }
  
    if (params.end_date) {
  
      where['timestamp'] = {
        [Op.lte]: params.end_date
      }
  
    }

    if (params.tag) {
        
        where['tag'] = params.tag

    }

    log.info('rankings.rankContent', {params, where})

    const result = await models.BoostPowProof.findAll({

    })

    const query = params.app ? (

      params.type ? (

        params.author ? `
          select "BoostPowProof".content, sum(difficulty) as difficulty
          FROM "BoostPowProofs" AS "BoostPowProof"
          LEFT OUTER JOIN "Events" AS "event"
          ON "BoostPowProof"."content" = "event"."txid"
          where "BoostPowProof".content in
          (select txid from "Events" where app = :app and type = :type and author = :author)
          GROUP BY "BoostPowProof".content
          ORDER BY "difficulty" DESC;`
        : `
          select "BoostPowProof".content, sum(difficulty) as difficulty
          FROM "BoostPowProofs" AS "BoostPowProof"
          LEFT OUTER JOIN "Events" AS "event"
          ON "BoostPowProof"."content" = "event"."txid"
          where "BoostPowProof".content in
          (select txid from "Events" where app = :app and type = :type)
          GROUP BY "BoostPowProof".content
          ORDER BY "difficulty" DESC;`
        ) 
      : `
        select "BoostPowProof".content, sum(difficulty) as difficulty
        FROM "BoostPowProofs" AS "BoostPowProof"
        LEFT OUTER JOIN "Events" AS "event"
        ON "BoostPowProof"."content" = "event"."txid"
        where "BoostPowProof".content in
        (select txid from "Events" where app = :app)
        GROUP BY "BoostPowProof".content
        ORDER BY "difficulty" DESC;`
      )
    :
      `select "BoostPowProof".content, sum(difficulty) as difficulty
      FROM "BoostPowProofs" AS "BoostPowProof"
      LEFT OUTER JOIN "Events" AS "event"
      ON "BoostPowProof"."content" = "event"."txid"
      where "BoostPowProof".content in
      (select txid from "Events")
      GROUP BY "BoostPowProof".content
      ORDER BY "difficulty" DESC;`;

    const [rankedContent] = await sequelize.query(query, {
      replacements: {
        app: params.app,
        type: params.type,
        author: params.author
      }
    })

    var events = await models.Event.findAll({

      where: {

        txid: {
          [Op.in]: rankedContent.map(({content}) => content)
        }

      }

    })

    const rankMap = rankedContent.reduce((result, item) => {
      result[item.content] = item
      return result
    }, {})

    return events.map(event => {

      const difficulty = rankMap[event.txid] ? parseFloat(rankMap[event.txid].difficulty) : 0

      const json = event.toJSON()

      delete json['txo']

      return Object.assign(json, {
        difficulty
      })
    })
    .sort((a, b) => a.difficulty < b.difficulty ? 1 : -1)

}

interface RankedTags {
    query: RankContent;
}

export async function rankTags(params: RankContent = {}): Promise<RankedTags[]> {

    const where = {}

    if (params.start_date) {
  
      where['timestamp'] = {
        [Op.gte]: params.start_date
      }
    
    }
  
    if (params.end_date) {
  
      where['timestamp'] = {
        [Op.lte]: params.end_date
      }
  
    }

    const proofs = await models.BoostPowProof.findAll({

        where,
  
        attributes: [
          'content',
          [models.sequelize.fn('sum', models.sequelize.col("difficulty")), "difficulty"],
          [models.sequelize.fn('count', models.sequelize.col("BoostPowProof.id")), "count"],
          [models.sequelize.fn('count', models.sequelize.col("event.id")), "count1"],
        ],
  
        group: 'BoostPowProof.content',

        include: [{
          model: models.Event,
          as: 'event',
          attributes: ['txid', 'txid']
        }],
  
        order: [['difficulty', 'desc']],

    })

    return proofs

}
