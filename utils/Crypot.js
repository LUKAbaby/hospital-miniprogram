const CryptoJS = require('./crypto-js');
const aecConfig = {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
}
//加密方法
function AES_EN(text, key, iv) {
    key = CryptoJS.enc.Utf8.parse(key)
    iv = CryptoJS.enc.Utf8.parse(iv)
    const encrypted = CryptoJS.AES.encrypt(text, key, { iv, ...aecConfig })
    return encrypted.ciphertext.toString()
}

//解密方法
function AES_DE(text, key, iv) {
    key = CryptoJS.enc.Utf8.parse(key)
    iv = CryptoJS.enc.Utf8.parse(iv)
    text = CryptoJS.enc.Hex.parse(text)
    const decrypt = CryptoJS.AES.decrypt({ ciphertext: text }, key, { iv, ...aecConfig })
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    return decryptedStr.toString()
}
export {
    AES_EN, AES_DE
}
