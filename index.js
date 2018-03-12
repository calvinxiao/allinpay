const _ = require('lodash');
const crypto = require('crypto');
const request = require('request-promise');

const config = require('./config');
const utils = require('./utils');

const payOrderFields = [
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
class AllInPay {
    /**
     * @merchantId，商户id，必传
     * @md5Key，计算签名的key，必传，
     * @options，可选参数
     */
    constructor(merchantId, md5Key, options = {}) {
        if (_.isEmpty(merchantId)) {
            throw new Error('merchantId 不能为空');
        }

        if (_.isEmpty(md5Key)) {
            throw new Error('md5Key 不能为空');
        }

        this.merchantId = merchantId;
        this.md5Key = md5Key;

        // TODO config默认值

    }

    /**
     * 创建支付单
     * @param data form表单传送的对象key-value
     * @returns {Promise.<{fields: Array, values: Array, postUrl: string}>}
     */
    async getPayOrderFormParameters(data) {
        const fields = _.slice(payOrderFields, 0, payOrderFields.length);
        let values = fields.map(field => {
            return data[field] !== undefined ? '' + data[field] : '';
        });
        let toSign = this.concatString(fields, values);
        let signMsg = this.getSignatuare(toSign);
        fields.push('signMsg');
        values.push(signMsg);
        return {
            fields: fields,
            values: values,
            postUrl: config.MAIN_REQUEST_URL,
        };
    }

    /**
     * 获取一个支付单的信息
     */
    async getOnePayOrder(data) {
        // 1. get result from rawRequest
        // 2. convert result
        let fields = [
            'merchantId',
            'version',
            'signType',
            'orderNo',
            'orderDatetime',
            'queryDatetime',
        ];

        let values = fields.map(field => {
            return data[field] !== undefined ? '' + data[field] : '';
        });
        let toSign = this.concatString(fields, values);
        let signMsg = this.getSignatuare(toSign);
        fields.push('signMsg');
        values.push(signMsg);
        // TODO post
        let result = await this.request(fields, values);

        let obj = utils.convertSingleResult(result);
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
     * 退款， TODO 决定能不能自定义退款金额
     */
    async refund() {
    }

    /**
     * 获取退款单状态
     */
    async getRefundStatus() {

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

    async request(fields, values) {
        const form = {};
        for (let i = 0; i < fields.length; i++) {
            form[fields[i]] = values[i];
        }
        return await request.post({
            uri: 'http://ceshi.allinpay.com/gateway/index.do',
            form,
        });
    }
}

module.exports = AllInPay;