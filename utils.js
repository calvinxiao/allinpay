module.exports = {
    encryptMd5,
    convertSingleResult
};

function encryptMd5() {

}

function convertSingleResult(stringResult) {
    stringResult = decodeURI(stringResult);
    let list = stringResult.split('&');
    let dict = {};
    for (let pair of list) {
        let kv = pair.split('=');
        dict[kv[0]] = kv[1];
    }
    return dict;
}