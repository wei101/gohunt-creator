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

export function parseSeconds(seconds) {
    const d = new Date(seconds * 1000)
    return [
        d.getFullYear(),
        d.getMonth() + 1,
        d.getDate(),
        d.getHours(),
        d.getMinutes(),
    ]
}


export function arrToSeconds(arr) {
    const d = new Date(`${arr[0]}-${arr[1]}-${arr[2]}:${arr[3]}:${arr[4]}:00`)
    return parseInt(d.getTime() / 1000)
}
