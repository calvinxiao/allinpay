/**
 * Created by aurum on 2018/3/14.
 */
const xml = require('./libs/XML');
const config = require('./config');
const _ = require('lodash');
const request = require('request');
const crypto = require('crypto');
const iconv = require('iconv-lite');

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
        _.defaults(obj.AIPG.INFO, info, {LEVEL: 0,});
        _.defaults(obj.AIPG.TRANS, trans);
        let originStr = xml.builder.buildObject(obj);
        originStr = iconv.encode(originStr, 'gbk');

        // sign
        const sign = crypto.createSign('RSA-SHA1');
        sign.update(originStr);
        const signature = sign.sign({key: this.privateCert, passphrase: this.certPassphrase}, 'hex');
        obj.AIPG.INFO.SIGNED_MSG = signature;

        let signedXml = xml.builder.buildObject(obj);
        signedXml = iconv.encode(signedXml, 'gbk');

        const resStr = await (new Promise((resolve, reject) => {
            const resStream = request.post({
                uri: (this.isTest ? config.TEST_URL : config.PRODUCT_URL).accountPay,
                headers: {
                    'Content-Type': 'application/xml'
                },
                body: signedXml,
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

        let str = resStr;
        let head = str.slice(0, str.indexOf('<SIGNED_MSG>'));
        let tail = str.slice(str.indexOf('</SIGNED_MSG>') + 16);
        str = head + tail;
        console.log(str);
        const clist = [
            'RSA-SHA',
            'RSA-SHA1',
            'RSA-SHA1-2',
            'RSA-SHA224',
            'RSA-SHA256',
            'RSA-SHA384',
            'RSA-SHA512',
            'sha1WithRSAEncryption',
            'sha256',
            'sha256WithRSAEncryption'];
        for (let suit of clist) {
            let s = crypto.createSign(suit);
            s.update(iconv.encode(str, 'gbk'));
            console.log(suit, '\t', s.sign(this.privateCert, 'hex'));
        }
        // console.log('rawreturn: ', resStr);
        const resJSON = await xml.parser.parseStringAsync(resStr);
        return resJSON;
    }

}

module.exports = AccountPay;