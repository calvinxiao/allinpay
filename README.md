# Allinpay Node.js SDK 通联支付 Node.js SDK

## API功能

```
const allInPay = new AllInPay(merchantId, md5Key, {});
```

### 创建支付订单 getPayOrderFormParameters

```
let paymentFormData = allInPay.getPayOrderFormParameters(parameters);
// paymentFormData.fields = [] // form 的字段，按顺序放到表单
// paymentFormData.values = [] // form 的值
// paymentFormData.postUrl = '' // form post 到的url
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

