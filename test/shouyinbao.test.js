/**
 * Created by aurum on 2018/3/21.
 */
const assert = require('assert');
const Shouyinbao = require('../index').Shouyinbao;
const fs = require('fs');

const shouyinbao = new Shouyinbao('1', '1', '1');

describe('收银宝', function () {
    it('创建签名，ok', async () => {
        const result = shouyinbao._getSignature({
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
    const reqsn = '20060400000362820';
    it('创建支付，ok', async () => {
        const result = await shouyinbao.createPayment({
            trxamt: 1,
            reqsn,
            paytype: 'W02',
            acct: 'ofTT5wE2X8kEn1FvtRDARwegdXRE'
        });
        console.log(result);
    });
    it('交易撤销（全额退款），ok', async () => {
        const result = await shouyinbao.cancel({
            oldreqsn: reqsn,
            trxamt: 1,
            reqsn: 'TK' + reqsn,
        });
        console.log(result);
    });
    it('交易退款，ok', async () => {
        const result = await shouyinbao.refund({
            oldreqsn: reqsn,
            trxamt: 1,
            reqsn: 'TK' + reqsn,
        });
        console.log(result);
    });
    it('交易查询，ok', async () => {
        const result = await shouyinbao.query({
            reqsn,
        });
        console.log(result);
    });
});
