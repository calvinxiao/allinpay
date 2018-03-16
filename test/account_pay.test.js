/**
 * Created by aurum on 2018/3/15.
 */
const assert = require('assert');
const AccountPay = require('../index').AccountPay;
const fs = require('fs');

const accountPay = new AccountPay('200604000003628', fs.readFileSync(__dirname + '/private.pem'), '111111', '20060400000362804', '111111', {isTest: true});

describe('账户支付', function () {
    it('代付，ok', async () => {
        const result = await accountPay.pay({
            REQ_SN: '2006040000036281',
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