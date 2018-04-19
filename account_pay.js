/**
 * Created by aurum on 2018/3/14.
 */
const xml = require('./libs/XML');
const config = require('./config');
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

    async pay(info, trans) {
        const obj = {
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
        _.defaults(obj.AIPG.INFO, info);
        _.defaults(obj.AIPG.TRANS, trans);
        const originStr = xml.builder.buildObject(obj);
        const originStrBuffer = iconv.encode(originStr, 'gbk');

        // sign
        const signature = crypto.createSign(signAlgorithm)
          .update(originStrBuffer)
          .sign({key: this.privateCert, passphrase: this.certPassphrase}, 'hex');
        obj.AIPG.INFO.SIGNED_MSG = signature;

        const signedXml = xml.builder.buildObject(obj);
        const signedXmlBuffer = iconv.encode(signedXml, 'gbk');

        const resStr = await (new Promise((resolve, reject) => {
            const resStream = request.post({
                uri: (this.isTest ? config.TEST_URL : config.PRODUCT_URL).accountPay,
                headers: {
                    'Content-Type': 'application/xml'
                },
                body: signedXmlBuffer,
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
        }));

        const resJSON = await xml.parser.parseStringAsync(resStr);
        return resJSON;
    }

}

module.exports = AccountPay;