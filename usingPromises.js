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

app.get('/i/want/title', async (req, res) => {

    var addresses = req.query.address;

    if (!addresses) {
        return res.send('Missing URL query parameter!');
    }

    async function getTitle(address) {

        return new Promise(async function (resolve, reject) {
            try {
                const response = await axios(address)
                const data = await response.data
                const title = parseTitle(data)
                console.log(`Title for ${address} is: ${title}`)
                resolve(title)
                
            }
            catch (error) {
                reject(error)
            }
        });
    };

    for (let address of addresses) {
        await getTitle(address).then(title => {
            res.write(`
                    <ul>
                        <li> Title for ${address} is: ${title} </li>
                    </ul>
            `)
        });
    }
});

app.listen(port);