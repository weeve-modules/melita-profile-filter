const { EGRESS_URLS, INGRESS_HOST, INGRESS_PORT, MODULE_NAME, ACTION_TYPE, PROFILE_IDS } = require('./config/config.js')
const fetch = require('node-fetch')
const express = require('express')
const app = express()
const winston = require('winston')
const expressWinston = require('express-winston')

// initialization
app.use(express.urlencoded({ extended: true }))
app.use(
  express.json({
    verify: (req, res, buf, encoding) => {
      try {
        JSON.parse(buf)
      } catch (e) {
        res.status(400).json({ status: false, message: 'Invalid payload provided.' })
      }
    },
  })
)

// logger
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console(),
      /*
    new winston.transports.File({
        filename: 'logs/filter.log'
    })
    */
    ],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) {
      return false
    }, // optional: allows to skip some log messages based on request and/or response
  })
)

const send = async json => {
  if (EGRESS_URLS) {
    const urls = []
    const eUrls = EGRESS_URLS.replace(/ /g, '')
    if (eUrls.indexOf(',') !== -1) {
      urls.push(...eUrls.split(','))
    } else {
      urls.push(eUrls)
    }
    urls.forEach(async url => {
      if (url) {
        const callRes = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(json),
        })
        if (!callRes.ok) {
          console.error(`Error passing response data to ${url}`)
        }
      }
    })
  }
}
// main post listener
app.post('/', async (req, res) => {
  const json = req.body
  // for some reason melita is sending JSON structure from payload, and not payload property
  // so to be sure, we will support both
  if (!json) {
    return res.status(400).json({ status: false, message: 'Payload not provided.' })
  }
  if (PROFILE_IDS !== '' && json.tags) {
    if (json.tags.deviceProfileId) {
      const ids = PROFILE_IDS.indexOf(',') !== -1 ? PROFILE_IDS.replace(/ /g, '').split(',') : PROFILE_IDS
      if (ids.indexOf(json.tags.deviceProfileId) !== -1) {
        if (ACTION_TYPE === 'forward') {
          await send(json)
        }
      }
    }
  } else {
    await send(json)
  }
  return res.end()
})

// handle exceptions
app.use(async (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  const errCode = err.status || 401
  res.status(errCode).send({
    status: false,
    message: err.message,
  })
})

if (require.main === module) {
  app.listen(INGRESS_PORT, INGRESS_HOST, () => {
    console.log(`${MODULE_NAME} listening on ${INGRESS_PORT}`)
  })
}
