/**
 * Created by aurum on 2018/3/21.
 */
const crypto = require('crypto');
const _ = require('lodash');
const request = require('request-promise');
const config = require('../config');

class Shouyinbao {

    /**
     *
     * @param cusId 商户号
     * @param appId 应用id
     * @param key 应用key
     */
    constructor(cusId, appId, key) {
        this.cusId = cusId;
        this.appId = appId;
        this.key = key;
    }

    async createPayment(options) {
        if (!options.trxamt || !options.reqsn || !options.paytype) {
            throw new Error('缺少参数');
        }
        if (['W02', 'A02'].includes(options.paytype) && !options.acct) {
            throw new Error('缺少acct参数');
        }

        _.defaults(options, {
            cusid: this.cusId,
            appid: this.appId,
            version: '11',
            randomstr: crypto.randomBytes(8).toString('base64'),
        });
        options.sign = this._getSignature(options);

        console.log(options);
        const response = await request.post({
            uri: config.PRODUCT_URL.syb_pay,
            form: options,
            json: true,
        });

        if (response.retcode === 'FAIL') {
            throw new Error(response.retmsg);
        }
        return response;
    }

    /**
     * 交易撤销（仅限当天交易）
     * @param options
     * @returns {Promise.<*>}
     */
    async cancel(options) {
        if (!options.trxamt || !options.reqsn) {
            throw new Error('缺少参数');
        }
        if (!options.oldreqsn && !options.oldtrxid) {
            throw new Error('oldreqsn和oldtrxid不能同时为空');
        }

        _.defaults(options, {
            cusid: this.cusId,
            appid: this.appId,
            version: '11',
            randomstr: crypto.randomBytes(8).toString('base64'),
        });
        options.sign = this._getSignature(options);

        const response = await request.post({
            uri: config.PRODUCT_URL.syb_cancel,
            form: options,
            json: true,
        });

        if (response.retcode === 'FAIL') {
            throw new Error(response.retmsg);
        }
        return response;
    }

    /**
     * 交易退款（可部分退款）
     * @param options
     * @returns {Promise.<*>}
     */
    async refund(options) {
        if (!options.trxamt || !options.reqsn) {
            throw new Error('缺少参数');
        }
        if (!options.oldreqsn && !options.oldtrxid) {
            throw new Error('oldreqsn和oldtrxid不能同时为空');
        }

        _.defaults(options, {
            cusid: this.cusId,
            appid: this.appId,
            version: '11',
            randomstr: crypto.randomBytes(8).toString('base64'),
        });
        options.sign = this._getSignature(options);

        const response = await request.post({
            uri: config.PRODUCT_URL.syb_refund,
            form: options,
            json: true,
        });

        if (response.retcode === 'FAIL') {
            throw new Error(response.retmsg);
        }
        return response;
    }

    async query(options) {
        if (!options.reqsn) {
            throw new Error('缺少参数');
        }

        _.defaults(options, {
            cusid: this.cusId,
            appid: this.appId,
            version: '11',
            randomstr: crypto.randomBytes(8).toString('base64'),
        });
        options.sign = this._getSignature(options);

        const response = await request.post({
            uri: config.PRODUCT_URL.syb_query,
            form: options,
            json: true,
        });

        if (response.retcode === 'FAIL') {
            throw new Error(response.retmsg);
        }
        return response;
    }

    /**
     * 获得签名
     * @param jsonObject 要传输的json对象
     * @private
     */
    _getSignature(jsonObject) {
        jsonObject.cusid = this.cusId;
        jsonObject.appid = this.appId;
        jsonObject.key = this.key;

        const keys = Object.keys(jsonObject);
        const paramArr = keys.map((key) => {
            return `${key}=${jsonObject[key]}`;
        });

        const originStr = paramArr.sort().join('&');
        const signature = crypto.createHash('md5').update(originStr).digest('hex');

        return signature;
    }
}

module.exports = Shouyinbao;