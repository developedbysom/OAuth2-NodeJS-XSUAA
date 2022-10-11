const express = require("express")
const passport = require("passport")
const JWTStrategy = require("@sap/xssec").JWTStrategy
const xsenv = require("@sap/xsenv")
const PORT = process.env.PORT || 3000;

const xsuaaService = xsenv.getServices({
    myXsuaa: {
        tag: "xsuaa"
    }
})
const xsuaaCredentials = xsuaaService.myXsuaa
const jwtStrategy = new JWTStrategy(xsuaaCredentials)

passport.use(jwtStrategy)

// apply passport as middlewire

const app = express()
app.use(passport.initialize())
app.use(passport.authenticate('JWT', {
    session: false
}))

app.get('/', (req, res) => {
    res.send('Welcome to API Home Page')
})

app.get('/getData', checkScope, (req, res) => {
    res.send('Successfuly reached API End Point')

})

function checkScope(req, res, next) {
    if (req.authInfo.checkLocalScope('providerScope')) {
        next()
    } else {
        res.status(403).end('forbidden')
    }
}

app.listen(PORT)