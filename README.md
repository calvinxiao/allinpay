# Allinpay Node.js SDK 通联支付 Node.js SDK

## API功能

```
const allInPay = new AllInPay(merchantId, md5Key, {
    isTest: // 是否开启测试模式，默认false，测试模式下所有请求发至通联测试环境url
    signType: // 目前只支持0
});

以后的调用中都不需要传merchantId、signType、version参数
```

### 获取创建支付单所需form参数 getOnePayOrderParameters
```
let paymentFormData = allInPay.getOnePayOrderParameters(parameters);
// paymentFormData.fields = [] // form 的字段，按顺序放到表单
// paymentFormData.values = [] // form 的值
// paymentFormData.postUrl = '' // form post 到的url
```
### 创建支付订单 createOnePayOrder
```
await allInPay.createOnePayOrder(formData)
```


### 获取一个订单信息 getOnePayOrder

```
let payOrder = await allInPay.getOnePayOrder(data);
```

### 单笔订单退款 refundOnePayOrder

```
let refundResult = await allInPay.refundOnePayOrder(refundOrder);
```

### 获取退款单的状态 getRefundStatus

```
let result = await allInPay.getRefundStatus(data);
console.log(result);
/**
{ results: 
   [ { version: 'v2.4',
       signType: '0',
       merchantId: '100020091218001',
       orderNo: '20180313200132',
       refundAmount: '200000',
       refundDatetime: '20180313083359',
       mchtRefundOrderNo: '20180313200130' } ],
  sign: '6831641D502EAA1139EAC7E185483174' }
**/
```


### 提现（帐号支付）transfer

```
账号支付内容，TODO
```

### 验证支付回调参数

