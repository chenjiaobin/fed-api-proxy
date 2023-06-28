const ipLists = ['wl-proxy-client-ip', 'x-forwarded-for', 'x-real-ip', 'proxy-client-ip', 'wl-proxy-client-ip']

function isInvalidIp(ip) {
  return !ip || ip.length === 0 || ip === 'unknown'
}

function getHeadersIp(req) {
  for (const key of ipLists) {
    const ip = req.header[key]
    if (isInvalidIp(ip) === false) {
      return ip
    }
  }

  return req && req.connection && req.connection.remoteAddress
}

module.exports = function getClientIp(req) {
  const ip = getHeadersIp(req)
  if (ip) {
    const pureIp = ip.replace(/\s+/g, '')
    if (pureIp.length > 15 && pureIp.indexOf(',') > 0) {
      return pureIp.split(',')[1]
    }
    return pureIp
  }
  return ip
}
