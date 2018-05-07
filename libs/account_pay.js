/**
 * Created by aurum on 2018/3/14.
 */
const xml = require('./XML');
const config = require('../config');
const _ = require('lodash');
const request = require('request');
const crypto = require('crypto');
const iconv = require('iconv-lite');
const signAlgorithm = 'RSA-SHA1';

class AccountPay {

    constructor(merchantId, privateCert, certPassphrase, username, password, options = {}) {
        if (!merchantId || !privateCert || !certPassphrase) {
            throw new Error(`必须设置商户ID、私钥证书、证书密码`);
        }
        if (!username || !password) {
            throw new Error(`用户名、密码不能为空`);
        }

        this.merchantId = merchantId;
        this.privateCert = privateCert;
        this.certPassphrase = certPassphrase;
        this.username = username;
        this.password = password;

        _.defaults(this, options);
        this.isTest = !!options.isTest;
    }

    /**
     * 单笔实时代付
     * @param {Object} info 请求文档中的INFO部分
     * @param {Object} trans 请求文档中的TRANS部分
     */
    async pay(info, trans) {
        const jsonBody = {
            AIPG: {
                INFO: {
                    TRX_CODE: '100014',
                    VERSION: '04',
                    DATA_TYPE: 2,
                    LEVEL: 0,
                    USER_NAME: this.username,
                    USER_PASS: this.password,
                },
                TRANS: {
                    MERCHANT_ID: this.merchantId,
                }
            }
        };
        _.defaults(jsonBody.AIPG.INFO, info);
        _.defaults(jsonBody.AIPG.TRANS, trans);


        const signedXmlBodyBuffer = await this.getSignedGBKBody(jsonBody);
        return await this._request(signedXmlBodyBuffer);
    }

    /**
     * 交易结果查询
     * @param {Object} info 
     * @param {Object} qtransreq 
     */
    async queryResult(info, qtransreq) {
        if (!qtransreq.QUERY_SN && (!qtransreq.START_DAY && !qtransreq.END_DAY)) {
            throw new Error('QUERY_SN和时间段至少需要指定其中一个');
        }

        const jsonBody = {
            AIPG: {
                INFO: {
                    TRX_CODE: '200004',
                    VERSION: '04',
                    DATA_TYPE: 2,
                    USER_NAME: this.username,
                    USER_PASS: this.password,
                },
                QTRANSREQ: {
                    MERCHANT_ID: this.merchantId,
                    TYPE: 1,
                }
            }
        };
        _.defaults(jsonBody.AIPG.INFO, info);
        _.defaults(jsonBody.AIPG.QTRANSREQ, qtransreq);

        const signedXmlBodyBuffer = this.getSignedGBKBody(jsonBody);
        return await this._request(signedXmlBodyBuffer);
    }

    getSignature(jsonBody) {
        const originStr = xml.builder.buildObject(jsonBody);
        const originStrBuffer = iconv.encode(originStr, 'gbk');

        // sign
        return crypto.createSign(signAlgorithm)
          .update(originStrBuffer)
          .sign({key: this.privateCert, passphrase: this.certPassphrase}, 'hex');
    }

    getSignedGBKBody(jsonBody) {
        jsonBody.AIPG.INFO.SIGNED_MSG = this.getSignature(jsonBody);

        const signedXml = xml.builder.buildObject(jsonBody);
        return iconv.encode(signedXml, 'gbk');
    }

    async _request(body) {
        const resStr = await new Promise((resolve, reject) => {
            const resStream = request.post({
                uri: (this.isTest ? config.TEST_URL : config.PRODUCT_URL).accountPay,
                headers: {
                    'Content-Type': 'application/xml'
                },
                body,
                rejectUnauthorized: false
            });
            const decodeStream = iconv.decodeStream('gbk');
            resStream.pipe(decodeStream);

            let decodedStr = '';
            decodeStream.on('data', function (data) {
                decodedStr += data;
            });

            decodeStream.on('end', function () {
                resolve(decodedStr);
            });
        });
        const res = await xml.parser.parseStringAsync(resStr);

        return res;
    }
}

module.exports = AccountPay;