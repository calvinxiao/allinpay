/**
 * Created by aurum on 2018/3/12.
 */
const assert = require('assert');
const AllinPay = require('../index');

const allinPay = new AllinPay('100020091218001', '1234567890');
describe('AllinPay', function () {
    it('ok', async () => {
        const result = await allinPay.getPayOrderFormParameters({
            inputCharset: 1,
            pickupUrl: 'https://requestb.in/18nnvra1',
            reveiveUrl: 'https://requestb.in/18nnvra1',
            language: 1,
            version: 'v1.0',
            signType: 1,
            merchantId: '100020091218001',
            payerName: '苗翠花',
            payerEmail: 'miaoch@allinpay.com',
            payerTelephone: 13700000000,
            orderNo: 'NO20180312160120',
            orderAmount: 200,
            orderCurrency: 0,
            orderDatetime: 20180312160120,
            productName: '笔记本电脑',
            productPrice: 100,
            productNum: 1,
            productId: 'P1005001',
            productDesc: '商品描述',
            ext1: '附加参数',
            ext2: '附加参数2',
            payType: 0,
            tradeNature: 'GOODS'
        });
        console.log(result);
    });
});