# Allinpay Node.js SDK 通联支付 Node.js SDK

## API功能

```
const allInPay = new AllInPay(merchantId, md5Key, {
    isTest: // 是否开启测试模式，默认false，测试模式下所有请求发至通联测试环境url
});
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
let payOrder = await allInPay.getOnePayOrder(orderNo);
```

### 批量获取订单信息 getPayOrderList

```
let payOrder = await allInPay.getPayOrderList(options);

```

### 订单退款 refund

```
let refundResult = await allInPay.refund(refundOrder);
```

### 获取退款订单的状态 getRefundStatus

```
let refundStatus = await allInPay.getRefundStatus(refundOrderNo);
```

### 验证签名

```
let isVerified = allInPay.verifySignature(data);
```


### 提现（帐号支付）transfer

```
账号支付内容，TODO
```

### 验证支付回调参数

