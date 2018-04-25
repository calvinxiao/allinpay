/**
 * Created by aurum on 2018/3/21.
 */
const crypto = require('crypto');
const _ = require('lodash');

class Shouyinbao {

    constructor(cusId, appId, key) {
        this.cusId = cusId;
        this.appId = appId;
        this.key = key;
    }

    async createPayment(cusId, appId,) {

    }

    /**
     * 获得签名后的请求体
     * @param jsonObject 要传输的json对象
     * @private
     */
    _getSignedBody(jsonObject) {
        jsonObject.cusid = this.cusId;
        jsonObject.appid = this.appId;
        jsonObject.key = this.key;

        const keys = Object.keys(jsonObject);
        const paramArr = keys.map((key) => {
            return `${key}=${jsonObject[key]}`;
        });

        const originStr = paramArr.sort().join('&');
        const signature = crypto.createHash('md5').update(originStr).digest('hex');

        return `${originStr}&sign=${signature}`;
    }
}

module.exports = Shouyinbao;