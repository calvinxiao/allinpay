const _ = require('lodash');
const crypto = require('crypto');
const request = require('request-promise');

const config = require('./config');
const utils = require('./utils');

/**
 * 功能列表
 * @type {{createOnePayOrder: number, getOnePayOrder: number, refundOnePayOrder: number}}
 */
const functions = {
    createOnePayOrder: 'createOnePayOrder',
    getOnePayOrder: 'getOnePayOrder',
    refundOnePayOrder: 'refundOnePayOrder',
    getRefundStatus: 'getRefundStatus',
};

/**
 * 请求携带参数
 * @type {{createPayOrder: [*], getOnePayOrder: [*], refundOnePayOrder: [*], refundQuery: Array}}
 */
const reqParams = {
    /**
     * 创建支付单
     */
    createPayOrder: [
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
    ],
    /**
     * 查询单个支付订单
     */
    getOnePayOrder: [
        'merchantId',
        'version',
        'signType',
        'orderNo',
        'orderDatetime',
        'queryDatetime',
    ],
    /**
     * 申请单个订单退款
     */
    refundOnePayOrder: [
        'version',
        'signType',
        'merchantId',
        'orderNo',
        'refundAmount',
        'mchtRefundOrderNo',
        'orderDatetime',
    ],
    /**
     * 退款查询
     */
    getRefundStatus: [
        'version',
        'signType',
        'merchantId',
        'orderNo',
        'refundAmount',
        'refundDatetime',
        'mchtRefundOrderNo',
    ]
};

/**
 * 响应字段
 * @type {{}}
 */
const resParams = {
    /**
     * 查询单笔支付单
     */
    getOnePayOrder: [
        'merchantId',
        'version',
        'language',
        'signType',
        'payType',
        'issuerId',
        'paymentOrderId',
        'orderNo',
        'orderDatetime',
        'orderAmount',
        'payDatetime',
        'payAmount',
        'ext1',
        'ext2',
        'payResult',
        'errorCode',
        'returnDatetime',
    ],
    /**
     * 单笔订单申请退款
     */
    refundOnePayOrder: [
        'merchantId',
        'version',
        'signType',
        'orderNo',
        'orderAmount',
        'orderDatetime',
        'refundAmount',
        'refundDatetime',
        'refundResult',
        'mchtRefundOrderNo',
        'returnDatetime'
    ],
    /**
     * 获取退款状态
     */
    getRefundStatus: [
        'version',
        'signType',
        'merchantId',
        'orderNo',
        'refundAmount',
        'refundDatetime',
        'mchtRefundOrderNo',
        'refundResult',
        'returnDatetime',
    ]
};
class AllInPay {
    /**
     * @merchantId，商户id，必传
     * @md5Key，计算签名的key，必传，
     * @options，可选参数
     *          isTest  是否测试模式，测试模式请求只会发到通联测试服务器而不是线上环境
     */
    constructor(merchantId, md5Key, options = {isTest: false, signType: 0}) {
        if (_.isEmpty(merchantId)) {
            throw new Error('merchantId 不能为空');
        }

        if (_.isEmpty(md5Key)) {
            throw new Error('md5Key 不能为空');
        }

        this.merchantId = merchantId;
        this.md5Key = md5Key;

        // config默认值
        options.isTest = !!options.isTest;

        options.signType += '';
        if (options.signType === '1') {
            throw new Error(`暂不支持此signType`);
        }
        options.signType = '0';

        this.options = options;
    }

    /**
     * 获取创建创建支付单所需参数
     * @param data form表单传送的对象key-value
     * @returns {Promise.<{fields: Array, values: Array, postUrl: string}>}
     */
    getOnePayOrderParameters(data) {
        const {fields, values} = this.sign(data, functions.createOnePayOrder);
        return {
            fields: fields,
            values: values,
            postUrl: (this.options.isTest ? config.TEST_URL : config.PRODUCT_URL).mainRequestUrl,
        };
    }

    /**
     * 获取一个支付单的信息,只返回支付成功的订单
     * @param data form object
     * @returns {Promise.<void>}
     */
    async getOnePayOrder(data) {
        // 1. get result from rawRequest
        // 2. convert result
        const {fields, values} = this.sign(data, functions.getOnePayOrder);

        const response = await this.request((this.options.isTest ? config.TEST_URL : config.PRODUCT_URL).mainRequestUrl, fields, values);

        const result = utils.convertSingleResult(response);
        // 订单不存在：10027
        if (result['ERRORCODE']) {
            throw new Error(`ERRORCODE: ${result.ERRORCODE}, ERRORMSG: ${result.ERRORMSG}`);
        }

        /**
         * 验签放在最后，因为报错的情况下，不用验签
         */
        this.verifySignature(response, functions.getOnePayOrder);

        return result;
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
    verifySignature(stringResult, func) {
        stringResult = decodeURI(stringResult);

        let signMsg, signStr = '';
        switch (func) {
            case functions.getOnePayOrder:
            case functions.refundOnePayOrder:
                const resultObj = utils.convertSingleResult(stringResult);

                signMsg = resultObj.signMsg;
                resParams[func].forEach((field) => {
                    const value = resultObj[field];
                    if (value) { // 空字段不参与验签
                        signStr += `${field}=${value}&`;
                    }
                });
                signStr += `key=${this.md5Key}`;

                break;

            case functions.getRefundStatus:
                const arr = stringResult.split('\r\n');

                signMsg = arr[arr.length - 1];
                signStr = arr.slice(0, arr.length - 1).join('\r\n') + '|' + this.md5Key;

                break;
        }

        const calcSign = crypto.createHash('md5').update(signStr).digest('hex').toUpperCase();
        if (signMsg !== calcSign) {
            throw new Error(`验签不通过`);
        }
    }

    /**
     * 申请单个订单退款
     */
    async refundOnePayOrder(data) {
        const {fields, values} = this.sign(data, functions.refundOnePayOrder);

        const response = await this.request((this.options.isTest ? config.TEST_URL : config.PRODUCT_URL).mainRequestUrl, fields, values);

        const result = utils.convertSingleResult(response);
        if (result['ERRORCODE']) {
            throw new Error(`ERRORCODE: ${result.ERRORCODE}, ERRORMSG: ${result.ERRORMSG}`);
        }

        this.verifySignature(response, functions.refundOnePayOrder);

        return result;
    }

    /**
     * 获取退款单状态
     */
    async getRefundStatus(data) {
        const {fields, values} = this.sign(data, functions.getRefundStatus);

        const response = await this.request((this.options.isTest ? config.TEST_URL : config.PRODUCT_URL).refundQueryUrl, fields, values);

        const result = utils.convertArrayResult(response, reqParams.getRefundStatus);
        if (result['ERRORCODE']) {
            throw new Error(`ERRORCODE: ${result.ERRORCODE}, ERRORMSG: ${result.ERRORMSG}`);
        }

        this.verifySignature(response, functions.getRefundStatus);

        return result.results;
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

    sign(data, func) {
        let fields;
        let version;
        switch (func) {
            case functions.createOnePayOrder:
                fields = _.slice(reqParams.createPayOrder, 0, reqParams.createPayOrder.length);
                version = 'v1.0';
                break;
            case functions.getOnePayOrder:
                fields = _.slice(reqParams.getOnePayOrder, 0, reqParams.getOnePayOrder.length);
                version = 'v1.5';
                break;
            case functions.refundOnePayOrder:
                fields = _.slice(reqParams.refundOnePayOrder, 0, reqParams.refundOnePayOrder.length);
                version = 'v2.3';
                break;
            case functions.getRefundStatus:
                fields = _.slice(reqParams.getRefundStatus, 0, reqParams.getRefundStatus.length);
                version = 'v2.4';
        }
        const values = fields.map(field => {
            switch (field) {
                case 'merchantId':
                    return this.merchantId;
                case 'signType':
                    return this.options.signType;
                case 'version':
                    return version;
                default:
                    return data[field] !== undefined ? ('' + data[field]).trim() : '';
            }
        });
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