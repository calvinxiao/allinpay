module.exports = {
    MAIN_REQUEST_URL: 'http://ceshi.allinpay.com/gateway/index.do',
// MAIN_REQUEST_URL: 'https://service.allinpay.com/gateway/index.do',
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