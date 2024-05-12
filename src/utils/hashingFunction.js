import CryptoJS from 'crypto-js';

export function customDecrypt(encryptedData) {
  const key = CryptoJS.enc.Base64.parse('s6p3T3r/lszlgg3H+HRxg3+yOSYWS1xE/TnbYssRBE0=');
  
  const iv = CryptoJS.enc.Base64.parse(encryptedData.substring(0, 24));
  const encryptedString = encryptedData.substring(24);
  
  const decryptedData = CryptoJS.AES.decrypt(encryptedString, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8);

  return decryptedData;
}