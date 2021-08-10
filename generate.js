const fs = require('fs')
const path = require('path')
const Web3 = require("web3")

const TOMOCHAIN_RPC_ENDPOINT = `https://rpc.tomochain/com`

const TOKEN_LIST_FILE = `tomochain.tokenlist.json`

const timeout = 1000
let web3
try {
    web3 = new Web3(new Web3.providers.HttpProvider(TOMOCHAIN_RPC_ENDPOINT, {
        timeout: timeout
    }))

} catch (err) {
    console.log(err)
    process.exit(1)
}

const main = async () => {
    let tokens = {}

    fs.readdirSync(path.join(__dirname, 'tokens'))
        .filter(function (file) {
            return (file.indexOf('.json') >= 0)
        })
        .forEach(function (file) {
            try {
                let fileName = `./tokens/${file}`
                let token = require(fileName)
                let s = fileName.split('/')
                let tokenAddress = web3.utils.toChecksumAddress(s[s.length - 1].split('.json')[0])
                token.logo = `https://raw.githubusercontent.com/thanhnguyennguyen/tokens/master/tokens/${tokenAddress}.png`
                tokens[tokenAddress] = token
            } catch (error) {
                console.log(`Error at ${file} ${error}`)
            }
        })

    await fs.writeFile(TOKEN_LIST_FILE, JSON.stringify(tokens), function () { })
}
main()

