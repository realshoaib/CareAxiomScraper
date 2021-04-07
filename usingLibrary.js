const express = require("express")
const app = express()
const axios = require('axios')
const port = 3000

// USE the following query to get the expected output 
// & DON'T FORGET TO SEE THE SERVER(NODE) CONSOLE

// http://localhost:3000/i/want/title?address=https://www.google.com&address=https://www.dawn.com

const parseTitle = (body) => {
    let match = body.match(/<title>([^<]*)<\/title>/)
    if (!match || typeof match[1] !== 'string')
        throw new Error('Unable to parse the title tag')
    return match[1]
}

app.get('/i/want/title', (req, res) => {

    var address = req.query.address;

    if (!address) {
        return res.send('Missing URL query parameter!');
    }
    async function getTitle() {
        res.write(`<h1> Following are the titles of given websites:</h1>`)
        for (const url of address) {
            const response = await axios(url)
            const data = await response.data
            // console.log(`Here's the Data for ${url} ${data}`)
            var title = parseTitle(data)
            console.log(`Title for ${url} is: ${title}`)
            res.write(`
                        <ul>
                            <li> Title for ${url} is: ${title} </li>
                        </ul>
                    `)
        }
        res.write("<h4>Fetched titles using Axios Library.</h4>")
    }
    getTitle()
})

app.listen(port)