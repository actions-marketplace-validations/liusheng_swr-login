const axios = require('axios').default
const qs = require('querystring')
const signer = require('./signer')
const sig = new signer.Signer()

module.exports = {
  init_sign,
  http_request
}

/**
 *  Set the AK/SK to sign and authenticate the request.
 * @param {*} config { AccessKey, SecretKey }
 */
function init_sign(config) {
  sig.Key = config.AccessKey
  sig.Secret = config.SecretKey
}

async function http_request(method, url, query, body) {
  if (process.env.HW_HTTP_DEBUG === 'true') {
    if (query || body) {
      console.debug(`${JSON.stringify({ query, body })}`)
    }
    console.debug(`======================`)
  }
  try {
    let resp = await __hw_request(method, url, query, body)

    if (process.env.HW_HTTP_DEBUG === 'true') {
      console.debug(`===hw_request end===`)
      console.debug(`${method} - ${url}`)
      if (resp) {
        console.debug(`${JSON.stringify(resp)}`)
      }
      console.debug(`====================`)
    }

    return resp
  } catch (err) {
    if (process.env.HW_HTTP_DEBUG === 'true') {
      console.error(`===hw_request error===`)
      console.error(`${method} - ${url}`)
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(err.response.data)
        console.error(err.response.status)
        console.error(err.response.headers)
      } else if (err.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(err.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error(err.message)
      }
      console.error(`======================`)
    }
    throw err
  }
}

async function __hw_request(method, url, query, body) {
  const r = new signer.HttpRequest(method, url)
  r.headers = { 'Content-Type': 'application/json' }
  if (query) {
    r.query = query
  }
  if (body) {
    r.body = JSON.stringify(body)
  }
  sig.Sign(r)
  const reqOpts = {
    method,
    url,
    headers: r.headers
  }
  if (query) {
    reqOpts.params = query
    reqOpts.paramsSerializer = function(params) {
      return qs.stringify(params)
    }
  }
  if (body) {
    reqOpts.data = body
  }
  let resp = await axios(reqOpts)
  return resp.data
}
