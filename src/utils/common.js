export function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'shallowClone')
    }
    const targetObj = source.constructor === Array ? [] : {}
    Object.keys(source).forEach(keys => {
        let sourceElement = source[keys];
        if (sourceElement && typeof sourceElement === 'object') {
            if (sourceElement instanceof Date) {
                targetObj[keys] = new Date(sourceElement.getTime());
            } else {
                targetObj[keys] = deepClone(sourceElement)
            }
        } else {
            targetObj[keys] = sourceElement
        }
    })
    return targetObj
}
/* 合法uri*/
export function validateURL(textVal) {
    const urlReg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return urlReg.test(textVal)
}
