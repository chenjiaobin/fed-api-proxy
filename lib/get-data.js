function getJsonData(data) {
  return data
}

// 文件流
function getBufferData(buffer) {
  try {
    return JSON.parse(buffer.toString())
  } catch (error) {
    return Object.create(null)
  }
}

const getFunctionMap = new Map()
  .set('json', getJsonData)
  .set('arraybuffer', getBufferData)

module.exports = function getResponse(data, responseType = 'json') {
  const getFunction = getFunctionMap.get(responseType)
  if (!getFunction) {
    throw new Error('unsupported responseType：' + responseType)
  }
  return getFunction(data)
}
