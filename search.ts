
const axios = require('axios')

async function main() {

  const url = 'https://boards.4chan.org/pol/'

  //const { data } = await axios.post('http://localhost:5200/api/v1/search/events', {
  const { data } = await axios.post('https://onchain.sv/api/v1/search/events', {

    limit: 1,
    content: {

      url

    }

  })

  console.log(data)

}

main()
