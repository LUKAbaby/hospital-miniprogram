var crypto = require('./crypto-js')

function WXBizDataCrypt(appId, sessionKey) {
  this.appId = appId
  this.sessionKey = sessionKey
}

WXBizDataCrypt.prototype.decryptData = function (encryptedData, iv) {
  // base64 decode
  //Buffer已废弃，使用Buffer.from代替
  // var sessionKey =  Buffer.from(this.sessionKey, 'base64')
  // encryptedData = Buffer.from(encryptedData, 'base64')
  // iv =  Buffer.from(iv, 'base64')

  // var sessionKey = new ArrayBuffer(this.sessionKey, 'base64')
  // encryptedData = new ArrayBuffer(encryptedData, 'base64')
  // iv =  new ArrayBuffer(iv, 'base64')

  var sk = encodeURIComponent(this.sessionKey)
  var sessionKey = btoa(sk)
  var enDt = encodeURIComponent(encryptedData)
  encryptedData = btoa(enDt)
  var i = encodeURIComponent(iv)
  iv = btoa(i)

  try {
     // 解密
    var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true)
    var decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')
    
    decoded = JSON.parse(decoded)

  } catch (err) {
    throw new Error('Illegal Buffer'+err)
  }

  if (decoded.watermark.appid !== this.appId) {
    throw new Error('Illegal Buffer')
  }

  return decoded
}

module.exports = WXBizDataCrypt
