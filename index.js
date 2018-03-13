const _ = require('lodash');
const crypto = require('crypto');
const request = require('request-promise');

const config = require('./config');
const utils = require('./utils');

/**
 * 签名类型
 * @type {{createOnePayOrder: number, getOnePayOrder: number, refundOnePayOrder: number}}
 */
const signType = {
    createOnePayOrder: 0,
    getOnePayOrder: 1,
    refundOnePayOrder: 2,
};
/**
 * 创建支付单可携带的字段
 * @type {[*]}
 */
const createPayOrderFields = [
    'inputCharset',
    'pickupUrl',
    'receiveUrl',
    'version',
    'language',
    'signType',
    'merchantId',
    'payerName',
    'payerEmail',
    'payerTelephone',
    'payerIDCard',
    'pid',
    'orderNo',
    'orderAmount',
    'orderCurrency',
    'orderDatetime',
    'orderExpireDatetime',
    'productName',
    'productPrice',
    'productNum',
    'productId',
    'productDesc',
    'ext1',
    'ext2',
    'payType',
    'issuerId',
    'pan',
    'tradeNature'
];
/**
 * 查询单个支付订单字段
 * @type {[*]}
 */
const getOnePayOrderFields = [
    'merchantId',
    'version',
    'signType',
    'orderNo',
    'orderDatetime',
    'queryDatetime',
];
/**
 * 申请单个订单退款可携带的字段
 * @type {[*]}
 */
const refundOnePayOrderFields = [
    'version',
    'signType',
    'merchantId',
    'orderNo',
    'refundAmount',
    'mchtRefundOrderNo',
    'orderDatetime',
];

class AllInPay {
    /**
     * @merchantId，商户id，必传
     * @md5Key，计算签名的key，必传，
     * @options，可选参数
     *          isTest  是否测试模式，测试模式请求只会发到通联测试服务器而不是线上环境
     */
    constructor(merchantId, md5Key, options = {isTest: false}) {
        if (_.isEmpty(merchantId)) {
            throw new Error('merchantId 不能为空');
        }

        if (_.isEmpty(md5Key)) {
            throw new Error('md5Key 不能为空');
        }

        this.merchantId = merchantId;
        this.md5Key = md5Key;
        // config默认值
        this.isTest = options.isTest;
    }

    /**
     * 获取创建创建支付单所需参数
     * @param data form表单传送的对象key-value
     * @returns {Promise.<{fields: Array, values: Array, postUrl: string}>}
     */
    getOnePayOrderParameters(data) {
        const {fields, values} = this.sign(data, signType.createOnePayOrder);
        return {
            fields: fields,
            values: values,
            postUrl: (this.isTest ? config.TEST_URL : config.PRODUCT_URL).mainRequestUrl,
        };
    }

    /**
     * 创建支付单
     * @param data
     * @returns {Promise.<*>}
     */
    async createOnePayOrder(data) {
        const {fields, values} = this.getOnePayOrderParameters(data);
        return await this.request((this.isTest ? config.TEST_URL : config.PRODUCT_URL).mainRequestUrl, fields, values);
    }

    /**
     * 获取一个支付单的信息,只返回支付成功的订单
     * @param data form object
     * @returns {Promise.<void>}
     */
    async getOnePayOrder(data) {
        // 1. get result from rawRequest
        // 2. convert result
        const {fields, values} = this.sign(data, signType.getOnePayOrder);

        const result = await this.request((this.isTest ? config.TEST_URL : config.PRODUCT_URL).mainRequestUrl, fields, values);

        const obj = utils.convertSingleResult(result);
        // 订单不存在：10027
        if (obj['ERRORCODE']) {
            throw new Error(`ERRORCODE: ${obj.ERRORCODE}, ERRORMSG: ${obj.ERRORMSG}`);
        }
    }

    /**
     * 获取支付单列表
     */
    async getPayOrderList() {
        // 1. get result from rawRequest
        // 2. validate data

    }

    /**
     * 验证签名
     */
    async verifySignature() {
    }

    /**
     * 申请单个订单退款
     */
    async refundOnePayOrder(data) {
        const {fields, values} = this.sign(data, signType.refundOnePayOrder);

        const result = await this.request((this.isTest ? config.TEST_URL : config.PRODUCT_URL).mainRequestUrl, fields, values);

        const obj = utils.convertSingleResult(result);
        if (obj['ERRORCODE']) {
            throw new Error(`ERRORCODE: ${obj.ERRORCODE}, ERRORMSG: ${obj.ERRORMSG}`);
        }
    }

    /**
     * 获取退款单状态
     */
    async getRefundStatus() {

    }

    getValues(dataObj, fields) {
        return fields.map(field => {
            return dataObj[field] !== undefined ? ('' + dataObj[field]).trim() : '';
        });
    }

    concatString(fields, values) {
        let toSign = '';
        for (let i = 0; i < fields.length; i++) {
            // 为防止非法篡改要求商户对请求内容进行签名，按第 3 小节中接口报文参数说明，
            // 签名源串 是由除 signMsg 字段以外的所有非空字段内容按照报文字段的先后顺序
            // 依次按照“字段名=字段 值”的方式用“&”符号连接。
            // TODO 测试汉字
            if (values[i]) {
                toSign += fields[i] + '=' + values[i] + '&';
            }
        }
        return toSign.substr(0, toSign.length - 1);
    }

    getSignatuare(originStr) {
        let signStr = originStr + `&key=${this.md5Key}`;
        return crypto.createHash('md5').update(signStr).digest('hex').toUpperCase();
    }

    sign(data, type) {
        let fields;
        switch (type) {
            case signType.createOnePayOrder:
                fields = _.slice(createPayOrderFields, 0, createPayOrderFields.length);
                break;
            case signType.getOnePayOrder:
                fields = _.slice(getOnePayOrderFields, 0, getOnePayOrderFields.length);
                break;
            case signType.refundOnePayOrder:
                fields = _.slice(refundOnePayOrderFields, 0, refundOnePayOrderFields.length);
                break;
        }
        const values = this.getValues(data, fields);
        const toSign = this.concatString(fields, values);
        const signMsg = this.getSignatuare(toSign);
        fields.push('signMsg');
        values.push(signMsg);

        return {
            fields,
            values
        };
    }

    async request(url, fields, values) {
        const form = {};
        for (let i = 0; i < fields.length; i++) {
            form[fields[i]] = values[i];
        }
        return await request.post({
            uri: url,
            form,
        });
    }

}

module.exports = AllInPay;