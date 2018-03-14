module.exports = {
    encryptMd5,
    convertSingleResult,
    convertArrayResult
};

function encryptMd5() {

}

function convertSingleResult(stringResult) {
    stringResult = decodeURI(stringResult);
    let list = stringResult.split('&');
    let dict = {};
    for (let pair of list) {
        let kv = pair.split('=');
        if (kv.length === 2) {
            dict[kv[0]] = kv[1];
        }
    }
    return dict;
}

function convertArrayResult(stringResult, fields) {
    if (stringResult.includes('ERRORCODE')) {
        return this.convertSingleResult(stringResult);
    }

    stringResult = decodeURI(stringResult);
    const rowStrs = stringResult.split('\r\n');

    const list = [];
    let sign;
    for (let rowStr of rowStrs) {
        const obj = {};
        const values = rowStr.split('|');

        if (values.length === 1 && values[0]) {
            sign = values[0];
            break; // 签名放在最后，读到后直接break，忽略后面数据
        } else {
            for (let i = 0; i < fields.length; i++) {
                obj[fields[i]] = values[i];
            }
            list.push(obj);
        }
    }

    return {
        results: list,
        sign
    };
}