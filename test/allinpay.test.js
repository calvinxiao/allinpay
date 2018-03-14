/**
 * Created by aurum on 2018/3/12.
 */
const assert = require('assert');
const AllinPay = require('../index');

const allinPay = new AllinPay('100020091218001', '1234567890', {isTest: true, signType: 0});
describe('AllinPay', function () {
    const orderNo = 20180314200130;
    const orderDatetime = 20180314150122;
    it('获取创建新支付单所需参数，ok', async () => {
        const result = await allinPay.getOnePayOrderParameters({
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
            orderNo: orderNo,
            orderAmount: 200,
            orderCurrency: 0,
            orderDatetime: orderDatetime,
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
    it('查询一个支付单，ok', async () => {
        const result = await allinPay.getOnePayOrder({
            merchantId: '100020091218001',
            version: 'v1.5',
            signType: 0,
            orderNo,
            orderDatetime,
            queryDatetime: 20180313194722,
        });
        console.log(result);
    });
    it('查询支付单列表，ok', async () => {
        const result = await allinPay.batchGetPayOrders({
            beginDatetime: 20180301301,
            endDatetime: 2018031323,
            pageNo: 1
        });
        console.log(result);
    }).timeout(5000000);
    it('申请单个订单退款，ok', async () => {
        const result = await allinPay.refundOnePayOrder({
            merchantId: '100020091218001',
            orderNo,
            orderDatetime: orderDatetime,
            refundAmount: 200000,
            mchtRefundOrderNo: 20180313200132,
        });
        console.log(result);
    });
    it('获取退款单状态，ok', async () => {
        const result = await allinPay.getRefundStatus({
            merchantId: '100020091218001',
            orderNo,
            orderDatetime: orderDatetime,
            refundAmount: 200000,
            mchtRefundOrderNo: 20180313200130,
        });
        console.log(result);
    });
});