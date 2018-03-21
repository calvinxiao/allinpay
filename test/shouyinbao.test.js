/**
 * Created by aurum on 2018/3/21.
 */
const assert = require('assert');
const Shouyinbao = require('../index').Shouyinbao;
const fs = require('fs');

const shouyinbao = new Shouyinbao('1', '1', '1');

describe('收银宝', function () {
    it('创建签名，ok', async () => {
        const result = shouyinbao._getSignedBody({
            notify_url: 1,
            authcode: 1,
            body: 1,
            cusid: 1,
            key: 1,
            limit_pay: 1,
            openid: 1,
            paytype: 1,
            randomstr: 1,
            remark: 1,
            reqsn: 1,
            trxamt: 1,
            validtime: 1,
            version: 11
        });
        console.log(result);
    });
    it('创建支付，ok', async () => {
        const result = await shouyinbao.createPayment({
            REQ_SN: '20060400000362813',
        }, {
            BUSINESS_CODE: '09100',
            SUBMIT_TIME: '20180315132200',
            ACCOUNT_NO: '6214857551853486',
            ACCOUNT_NAME: '黄金',
            ACCOUNT_PROP: '0',
            AMOUNT: 20000,
        });
        console.log(result);
    });
});
