/**
 * Created by aurum on 2018/3/30.
 */
const assert = require('assert');
const Wanjiantong = require('../index').Wanjiantong;
const fs = require('fs');

const privateKey = `-----BEGIN PRIVATE KEY-----
MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBALTsL8OFMhtfK0aoYwV
wQXpqQoGQBHXQo4NTEVc+Wn9vgB8FMSolvrQGncBi/ty7c9jBqoVfhu+DqHRP7DB4Qf
1+gmzZU1SRvIJUewpovGTi/htJnLcm9R4pFC79VqhTquHBaSTz00P8nI5zGPpxXaIf5
DPI7MbRjLatDZ1TikFjAgMBAAECgYEAqHHSEo67VSKpLxLtho26WNf/7ZMBpBNJeaZo
WbrzFPzh43+5A4263O/gBdPlh+t68090jNKg1fTVbN1QgNwmSuRhFki6grietOz3Xpw
JfeTjBUtY6JoOhFejEC3RfGnZ7fo3nKNukgNQx2MnwcCiNjED70xhu9WkYpaVkjo9QF
kCQQDpdBHH0+F9oLYXrsq0uChVw4SncVI1+IYDVvIdGCk44NZ7vADoJ1mlSBaNlfOUn
vybuzHIuzZFPyZYCSPbwwfHAkEAxmVW3o99zlfYsPaKsm0O+UtHDg2W3UeZyYgoDLsg
6+X3VZRGPTlt866pT+B5h37VOzc99DCkBbEk7ieKrLURhQJAWJDnOfdBIab5zgxK7Lq
82qSdS+Tq+ny5YsT2f2EuKlzqIfEWKvzavqCVpctQqH6UeQRQg8W6dhTaGCYHi5T2+w
JARXBOuVMLu17vzvBblxuotARu+DI1bXmUD/+B1QLiAO7aZK+i7ebd3v5w8C4nGw9/X
lx1aLRllEBuJpTcapptaQJBAKds4f7dWsKLPdNfCNtX9bB2IC7dNkX65LcUV2BrgqIn
gnyvDPGm2V0ZAHcThm0J1QogwifzbeMjenokPYUVhf0=
-----END PRIVATE KEY-----`;


const wanjiantong = new Wanjiantong('55ddda16270bc88fb72d77f343c2e', '425628317401743', privateKey);

describe('收银宝', function () {

    it('验证银行卡3要素，ok', async () => {
        const result = await wanjiantong.verifyBankCard({
            name: '黄金',
            bankCard: '621485755185',
            idNumber: '51010619940323'
        });
        console.log(result);
    }).timeout(50000);

    it('验证银行卡4要素，ok', async () => {
        const result = await wanjiantong.verifyBankCard({
            name: '黄金',
            bankCard: '621485755185',
            phone: '1868230',
            idNumber: '51010619940323'
        });
        console.log(result);
    }).timeout(50000);
});
