const _ = require('lodash');

const config = require('./config');
const utils = require('./utils');

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

        // config默认值

    }

    /**
     * 创建支付单
     */
    async getPayOrderFormParameters(data) {

        let fields = [
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
        let values = fields.map(field => {
            return data[field] ? data[field] : '';
        });

        let toSign = '';
        for (let i = 0; i < fields.length; i++) {
            // 为防止非法篡改要求商户对请求内容进行签名，按第 3 小节中接口报文参数说明，
            // 签名源串 是由除 signMsg 字段以外的所有非空字段内容按照报文字段的先后顺序
            // 依次按照“字段名=字段 值”的方式用“&”符号连接。
            // TODO 测试汉字
            if (values[i]) {
                toSign = fields[i]+'='+values[i] + '&';
            }
        }
        toSign = toSign.substr(0, toSign.length - 1);
        let signMsg = this.sign(originStr);
        fields.push('signMsg');
        values.push(signMsg);
        return {
            fields: fields,
            values: values,
            postUrl: config.MAIN_REQUEST_URL,
        }
    }

    /**
     * 获取一个支付单的信息
     */
    async getOnePayOrder() { }

    /**
     * 获取支付单列表
     */
    async getPayOrderList() { }

    /**
     * 验证签名
     */
    async verifySignature() { }

    /**
     * 退款， TODO 决定能不能自定义退款金额
     */
    async refund() { }

    /**
     * 获取退款单状态
     */
    async getRefundStatus() {

    }

    sign(originStr) {
        let signStr = originStr + `&key=${this.md5Key}`;
        return crypto.createHash('md5').update(signStr).digest('hex').toUpperCase();
    }



}

module.exports = AllInPay;