export function getObjectEmptyKey(obj) {
    for (let key in obj) {
        if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
            return key;
        }
    }

    return null;
}


export const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return `${[year, month, day].map(formatNumber).join('/')}`
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}