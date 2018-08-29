/**
 * Created by aurum on 2018/3/30.
 */
const requestPromise = require('request-promise');
const crypto = require('crypto');
const config = require('../config');
const NodeRSA = require('node-rsa');

class Wanjiantong {
    /**
     *
     * @param key 机构号生成的key
     * @param merchantId 商户号
     */
    constructor(key, merchantId, privateKey) {
        if (!key || !merchantId || !privateKey) {
            throw new Error(`缺少参数`);
        }

        this.key = key;
        this.merchantId = merchantId;
        this.privateKey = privateKey;
    }

    /**
     * 验证银行卡（三要素、四要素）
     * @param name {string} 户名，必填
     * @param bankCard {string} 银行卡号，必填
     * @param idNumber {string} 身份证号，必填
     * @param phone {string} 手机号，选填，如果不填则只验证三要素，如果填了，验证四要素
     * @param certType {number|string} 选填，证件类型，默认身份证，具体见通联文档
     * @returns {Promise.<void>}
     */
    async verifyBankCard({name, bankCard, idNumber, phone, certType = 0}) {
        const verifyPhone = !!phone;

        const paramJson = {
            certType,
            idCard: idNumber,
            name,
            bankNo: bankCard,
            merId: this.merchantId,
        };
        if (verifyPhone) {
            paramJson.phoneNo = phone;
        }

        const signature = this.getSignature(paramJson);
        const encryptedParam = this.encryptParams(paramJson);
        // request 会自动encode URI Component 所以签名和加密时不要encode
        return requestPromise.get({
            uri: verifyPhone ? config.PRODUCT_URL.verifyBankCard4 : config.PRODUCT_URL.verifyBankCard3,
            qs: {
                key: this.key,
                sign: signature,
                params: encryptedParam
            },
            json: true
        });
    }

    getSignature(paramJson) {
        const sign = crypto.createSign('RSA-MD5');
        sign.write(JSON.stringify(paramJson));
        sign.end();
        const signature = sign.sign(this.privateKey, 'base64');
        return signature;
    }

    encryptParams(paramJson) {
        const key = new NodeRSA(this.privateKey, 'pkcs8');
        const paramStr = JSON.stringify(paramJson);
        const cipherText = key.encryptPrivate(paramStr, 'base64');
        return cipherText;
    }
}

module.exports = Wanjiantong;
