# Allinpay Node.js SDK 通联支付 Node.js SDK

## Install
```
npm install allinpay
```
## Usage
```javascript
const AllInPay = require('allinpay');
const GateWayPay = AllInPay.GatewayPay; // 网关支付
const AccountPay = AllInPay.AccountPay; // 账户支付
const Shouyinbao = AllInPay.Shouyinbao; // 收银宝（移动支付）
const Wanjiantong = AllInPay.Wanjiantong; // 万鉴通（银行卡要素验证）
```
## 网关支付

```javascript
const allInPay = new GatewayPay(merchantId, md5Key, {
    isTest: true, // 是否开启测试模式，默认false，测试模式下所有请求发至通联测试环境url
    signType: 0 // 目前只支持0，使用md5签名、验签
});

// 以后的调用中都不需要传merchantId、signType、version参数
```

#### 获取创建支付单所需form参数 getOnePayOrderParameters
```javascript
let paymentFormData = allInPay.getOnePayOrderParameters(parameters);
// paymentFormData.fields = [] // form 的字段，按顺序放到表单
// paymentFormData.values = [] // form 的值
// paymentFormData.postUrl = '' // form post 到的url
```

#### 获取一个订单信息 getOnePayOrder

```javascript
// Note: 此接口只返回已支付成功的订单
let payOrder = await allInPay.getOnePayOrder(data);
/**
返回：
{ credentialsType: '',
  payAmount: '1200000',
  extTL: '',
  payDatetime: '20180314155026',
  signType: '0',
  returnDatetime: '20180329171728',
  credentialsNo: '',
  paymentOrderId: '201803141550202205',
  pan: '',
  version: 'v1.0',
  issuerId: '',
  orderNo: '20180314200130',
  payResult: '1',
  ext1: '附加参数',
  ext2: '附加参数2',
  orderAmount: '1200000',
  signMsg: 'B362885C7A780944B28C5D830A0AA81F',
  txOrgId: '',
  errorCode: '',
  userName: '',
  payType: '0',
  merchantId: '100020091218001',
  language: '1',
  orderDatetime: '20180314150122' }
  **/
```

#### 单笔订单退款 refundOnePayOrder

```javascript
let refundResult = await allInPay.refundOnePayOrder(data);
/**
返回:
{ merchantId: '100020091218001',
  version: 'v2.3',
  signType: '0',
  orderNo: '20180314200130',
  orderAmount: '1200000',
  orderDatetime: '20180314150122',
  refundAmount: '20',
  refundDatetime: '20180329172803',
  refundResult: '20',
  mchtRefundOrderNo: '201803132001321',
  returnDatetime: '20180329171856',
  signMsg: '7812ABB2B34ADA7E8D3DA19BDC139BED' }
**/
```

#### 获取退款单的状态 getRefundStatus

```javascript
let result = await allInPay.getRefundStatus(data);
console.log(result);
/**
返回： 
[ { version: 'v2.4',
    signType: '0',
    merchantId: '100020091218001',
    orderNo: '20180314200130',
    refundAmount: '200000',
    refundDatetime: '20180314051417',
    mchtRefundOrderNo: '20180313200130' } ]
**/
```
#### 验签
```javascript
const pass = verifySignature(stringResult, functions);
/**
 functions取值：
 this.functions = {
             createOnePayOrder: 'createOnePayOrder', // 获取创建支付单参数
             getOnePayOrder: 'getOnePayOrder', // 查询一个支付单
             batchGetPayOrders: 'batchGetPayOrders', // 批量查询支付单
             refundOnePayOrder: 'refundOnePayOrder', // 退款单个支付单
             getRefundStatus: 'getRefundStatus', // 获得退款状态
             payCallback: 'payCallback', // 支付回调
             }
 **/
// example:
// 验证
```
## 账户支付
```javascript
const accountPay = new AccountPay(merchantId, cert, certPassphrase, username, password, {
    isTest: true // 是否开启测试，默认false)
});
// 以后的调用中不用传merchantId、USER_NAME、USER_PASS、VERSION、TRX_CODE、DATA_TYPE
```
#### 申请实时单笔代付

```javascript
const result = await accountPay.pay(info,trans);
console.log(result);
/**
{ AIPG: 
   { INFO: 
      { TRX_CODE: '100014',
        VERSION: '04',
        DATA_TYPE: '2',
        REQ_SN: '20060400000362813',
        RET_CODE: '0000',
        ERR_MSG: '处理成功',
        SIGNED_MSG: '3134b0fd928a4bda5bdeaa70f205cea2661cf13005a4ea577cec568478354c2ab4eb751717e5a3104e300abdbe0c8e1310f0822fe65735566a0029a10a45590f705b139843a3c3433ee522d70c33fcc37a64b661c407b03cd05915678c55eaf81500e3aad515d82ce69878ea1c0853489e6b5e501c17f05d37dda163cf417f9191dd46a8b6bc8a6825039d604effd6b7fbaefab1b6e65118c32646a633058176f7ae5f35694c401f6363039b3a2adfb6325e7c2de8ca19971ec3a38dd2a271ca7a61e637f83c568383a7376882def9676060fec64d4f1e6d0a464a3015445700263da418cf3095b52c977917718cce6b36a72bd89c9c734dc5ea877ae1cbe9e7' },
     TRANSRET: { RET_CODE: '0000', SETTLE_DAY: '20180329', ERR_MSG: '处理成功' } } } 
**/
```

#### 交易结果查询
```javascript
const result = await accountPay.queryResult({
            REQ_SN: '2006040000036281',
        }, {
            QUERY_SN: '20060400000362813',
        });
console.log(result);
/**
* 打印结果：
* { AIPG: 
     { INFO: 
        { TRX_CODE: '200004',
          VERSION: '04',
          DATA_TYPE: '2',
          REQ_SN: '2006040000036281',
          RET_CODE: '0000',
          ERR_MSG: '处理完成@CChS',
          SIGNED_MSG: '76b72925ae38ca040af9fe0ec7a931f361b6b6920be99eec6eea851ac3abf8fa80ba443c48646c054cf666386342595f6faa40783ce3278e557bae659b4d41c516b2502dfd6e8613b63fa8037aed7f78f82f15028fdbe1a01d455d3699d66fc27e7f7976ee753d76f2c104c9dc2451e73d32b457e45bad268d4f7164d3c407bed30e7c3b51e73f6ef4ee401be1001e7c506ea613b06912d201f4a74dbdd345a645503a5c436ddedffbee3df216a1932ed5a8e892ab17ece448f89d22ed570bfa23ca466a57acae54974c42da48be238381e2c00a5380740a1212fda374cd0c70e6c872a8e5a27ecc18906af255c9504a3fc1056bf1f3be518e9968fd49cf744c' },
       QTRANSRSP: 
            { QTDETAIL: 
                        [ { BATCHID: '20060400000362813',
                                     SN: '0',
                                     TRXDIR: '0',
                                     SETTDAY: '20180331',
                                     FINTIME: '20180331162359',
                                     SUBMITTIME: '20180331162358',
                                     ACCOUNT_NO: '6214857451853486',
                                     ACCOUNT_NAME: '黄金',
                                     AMOUNT: '20000',
                                     RET_CODE: '0000',
                                     ERR_MSG: '处理成功' },
                                   { BATCHID: '20060400000362813',
                                     SN: '0',
                                     TRXDIR: '0',
                                     SETTDAY: '20180321',
                                     FINTIME: '20180321143547',
                                     SUBMITTIME: '20180321143547',
                                     ACCOUNT_NO: '6214857451853485',
                                     ACCOUNT_NAME: '黄金',
                                     AMOUNT: '20000',
                                     RET_CODE: '0000',
                                     ERR_MSG: '处理成功' },
                                   { BATCHID: '20060400000362813',
                                     SN: '0',
                                     TRXDIR: '0',
                                     SETTDAY: '20180329',
                                     FINTIME: '20180329173214',
                                     SUBMITTIME: '20180329173214',
                                     ACCOUNT_NO: '6214857451853486',
                                     ACCOUNT_NAME: '黄金',
                                     AMOUNT: '20000',
                                     RET_CODE: '0000',
                                     ERR_MSG: '处理成功' } ] } } }
*/
```

## 收银宝
```javascript
const shouyinbao = new Shouyinbao('商户号', 'appId', '交易密钥');
```
#### 创建支付
```javascript
// 仅三项必填，其他的视情况选填
const result = await shouyinbao.createPayment({
            trxamt: 100,
            reqsn: '20060400000362813',
            paytype: 'A01'
        });
```
#### 撤销交易（仅限当天）
```javascript
const result = await shouyinbao.cancel({
            oldreqsn: '20060400000362815',
            trxamt: 1,
            reqsn: 'TK20060400000362815',
        });
```
#### 交易退款（仅限第二天后）
```javascript
const result = await shouyinbao.refund({
            oldreqsn: reqsn,
            trxamt: 1,
            reqsn: 'TK' + reqsn,
        });
```
#### 交易查询
```javascript
const result = await shouyinbao.query({
            reqsn,
        });
```

## 收银宝
```javascript
const shouyinbao = new Shouyinbao('商户号', 'app id','app key');

// 以后的调用中都不需要传以上参数
```
####
文档来不及写，方法使用请见单元测试文件

## 万鉴通

```javascript
const privateCert = `-----BEGIN PRIVATE KEY-----
MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBALTsL8OFMhtfK0aoYwV
wQXpqQoGQBHXQo4NTEVc+Wn9vgB8FMSolvrQGncBi/ty7c9jBqoVfhu+DqHRP7DB4Qf
1+gmzZU1SRvIJUewpovGTi/htJnLcm9R4pFC79VqhTquHBaSTz00P8nI5zGPpxXaIf5
DPI7MbRjLatDZ1TikFjAgMBAAECgYEAqHHSEo67VSKpLxLtho26WNf/7ZMBpBNJeaZo
lx1aLRllEBuJpTcapptaQJBAKds4f7dWsKLPdNfCNtX9bB2IC7dNkX65LcUV2BrgqIn
gnyvDPGm2V0ZAHcThm0J1QogwifzbeMjenokPYUVhf0=
-----END PRIVATE KEY-----`;

const wanjiantong = new Wanjiantong('机构号生成的key（见通联文档生成方式或者直接找通联要）', 'merchatId', privateCert);

```
#### 要素验证（包括三要素、四要素）
```javascript
const result = await wanjiantong.verifyBankCard({
            name: '黄金',
            bankCard: '621485755185',
            idNumber: '51010619940323',
            phone: '1868230', // 如果是四要素验证才传phone
            });
```
