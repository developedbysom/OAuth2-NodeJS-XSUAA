const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000
const xsenv = require("@sap/xsenv")
const axios = require("axios")

const xsuaaService = xsenv.getServices({
    myXsuaa: {
        tag: "xsuaa"
    }
})

const xsuaaCredentials = xsuaaService.myXsuaa

app.get("/callApi", (req, res) => {

    callApiprovider()
        .then((data) => {
            res.send(`Called API End point & data received ==> ${data}`)
        })
        .catch(err => {
            res.status(500).end(`Error ocured ===> ${err}`)
        })
})

function callApiprovider() {
    return new Promise((resolve, reject) => {
        return fetchJWTToken()
            .then(jwt => {
                axios.request({
                        url: "/getData",
                        baseURL: "https://providerapp.cfapps.us10.hana.ondemand.com",
                        method: "GET"
                    })
                    .then(res => {
                        resolve(res.data)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
            .catch(err => {
                reject(err)
            })
    })
}

function fetchJWTToken() {
    return new Promise((resolve, reject) => {
        axios.request({
                url: "/oauth/token",
                baseURL: xsuaaCredentials.url,
                method: "POST",
                auth: {
                    username: xsuaaCredentials.clientid,
                    password: xsuaaCredentials.clientsecret
                },
                params: {
                    "grant_type": "client_credentials"
                }
            })
            .then(res => {
                axios.defaults.headers.common['Authorization'] = "Bearer " + res.data.access_token
                resolve(res.data.access_token)
            })
            .catch(err => {
                reject(err)
            })
    })
}
app.listen(PORT)