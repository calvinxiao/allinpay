module.exports = {
    /**
     * 通联生产环境url
     */
    PRODUCT_URL: {
        // 网关支付
        mainRequest: 'https://service.allinpay.com/gateway/index.do',
        batchQuery: 'https://service.allinpay.com/mchtoq/index.do',
        refundQuery: 'https://service.allinpay.com/mchtoq/refundQuery',
        // 账户支付
        accountPay: 'https://tlt.allinpay.com/aipg/ProcessServlet',
        // 万鉴通
        verifyBankCard3: 'https://openapi.allinpaycard.com/allinpay.bankcard.validate3keys/verify',
        verifyBankCard4: 'https://openapi.allinpaycard.com/allinpay.bankcard.validate4keys/verify',
        // 收银宝
        syb_pay: 'https://vsp.allinpay.com/apiweb/unitorder/pay',
        syb_cancel: 'https://vsp.allinpay.com/apiweb/unitorder/cancel',
        syb_refund: 'https://vsp.allinpay.com/apiweb/unitorder/refund',
        syb_query: 'https://vsp.allinpay.com/apiweb/unitorder/query',
    },
    /**
     * 通联测试环境url
     */
    TEST_URL: {
        mainRequest: 'http://ceshi.allinpay.com/gateway/index.do',
        batchQuery: 'http://ceshi.allinpay.com/mchtoq/index.do',
        refundQuery: 'http://ceshi.allinpay.com/mchtoq/refundQuery',

        accountPay: 'https://113.108.182.3/aipg/ProcessServlet',
    },
    INPUT_CHARSET: {
        UTF8: 1,
        GBK: 2,
        GB2312: 3
    },
    VERSION: 'v1.0',
    LANGUAGE: {
        SIMPLIFIED_CHINESE: 1,
        TRADITIONAL_CHINESE: 2,
        ENGLISH: 3
    },
    SIGN_TYPE: {
        MD5: 0, //表示订单上送和交易结果通知都使用 MD5 进行签 名
        MD5_AND_CERT: 1, // 表示商户用使用 MD5 算法验签上送订单，通联交 易结果通知使用证书签名
    },
    ORDER_CURRENCY: {
        RMB: 0, // 0 和 156 代表人民币、840 代表美元、344 代表港币， 跨境支付商户不建议使用 0
    },
    PAY_TYPE: {
        ALL: 0,
        PERSONAL_DEBIT_CARD: 1,
        ENTERPRISE_BANK: 4,
        PERSONAL_CREDIT_CARD: 11,
        FOREIGN_CARD: 23,
        CERTIFIED_PAY: 28, // 认证支付，TODO搞懂这个是什么鬼？
    }

};