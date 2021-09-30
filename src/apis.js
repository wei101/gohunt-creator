import axios from "axios";
import qs from "qs";

const BASE_URL = 'https://xcx.101weiqi.com'
const userInfo = JSON.parse(window.UserData.userInfo)

// 新创建 axios 实例配置
const $axios = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    Authorization: 'JWT ' + userInfo.token,
  },
});

$axios.interceptors.request.use(
  config => {
    config.data = qs.stringify(config.data) // 转为formdata数据格式
    return config
  },
  error => Promise.error(error)
)

export async function loginOrCreateUser(code) {
  return await $axios({
    method: 'GET',
    url: '/wq/xcxlogin/?code=' + code
  });
}

export async function getUserData() {
  return await $axios({
    method: 'GET',
    url: '/jwt/gethomedata/',
  })
}

export async function getAllTreasure() {
  return await $axios({
    url: '/red/getredpackelist/',
  });
}

export async function getBabyById(id) {
  return await $axios({
    url: `/red/getonebaby/${id}/`,
  });
}

export async function startPayWx(bid) {
  return await $axios({
    url: `/red/startpaywx/${bid}/`,
    data: {
      babyid: bid
    }
  });
}

export async function startPayAli(bid) {
  return await $axios({
    url: `/red/startpayali/${bid}/`,
    data: {
      babyid: bid
    }
  });
}

export async function queryPay(trade_no) {
  return await $axios({
    method: 'post',
    url: `/red/querypay/`,
    data: {
      trade_no
    }
  });
}

export async function getStartCreateBaby() {
  return await $axios.get('/red/startcreatebaby/')
}

export async function genBabyCode(bid) {
  return await $axios.get(`/red/genbabycode/${bid}/`)
}

export async function saveOneBaby(data) {
  return await $axios({
    method: 'POST',
    url: '/red/saveonebaby/',
    data: data
  })
}

export async function deleteOneQuestion(data) {
  return await $axios({
    method: 'POST',
    url: '/red/deleteonequestion/',
    data,
  })
}

export async function deleteOneBaby(bid) {
  return await $axios({
    method: 'POST',
    url: '/red/deleteonebaby/',
    data: {
      bid
    },
  })
}

export async function addOneQuestion(data) {
  return await $axios({
    method: 'POST',
    url: '/red/addonequestion/',
    data
  })
}

export async function payOk(bid) {
  return await $axios({
    method: "POST",
    url: '/red/payok/',
    data: { bid }
  })
}

export async function getOneBaby(bid) {
  return await $axios({
    url: '/red/getonebaby/' + bid + '/'
  })
}

export async function startDoBaby(bid) {
  return await $axios({
    method: 'POST',
    url: '/red/startdobaby/',
    data: { bid }
  })
}

export async function getNextQuestion(brid) {
  return await $axios({
    url: `/red/getnextquestion/${brid}/`,
  })
}

export async function recordDoQuestion(brid, qid, pos, result) {
  return await $axios({
    method: 'POST',
    url: `/red/recorddoquestion/${brid}/${qid}/`,
    data: {
      content: JSON.stringify(pos),
      result
    }
  })
}

export async function pullRedPack(bid) {
  return await $axios({
    method: 'POST',
    url: `/red/pullredpack/`,
    data: {
      bid
    }
  })
}

export async function getMyBaby() {
  return await $axios({
    url: `/red/getmybaby/`
  })
}

export async function getMyBabys() {
  return await $axios({
    url: `/red/getmybabys/`
  })
}

export async function getJoinRecord() {
  return await $axios({
    url: `/red/getjoinrecord/`
  })
}

export async function getOneRecord(brid) {
  return await $axios({
    url: `/red/getonerecord/${brid}/`
  })
}

export async function getQuestion(brid, qindex) {
  return await $axios({
    url: `/red/getquestion/${brid}/${qindex}/`
  })
}

export async function starQuestion(qid, star) {
  return await $axios({
    method: 'POST',
    url: `/red/starquestion/`,
    data: {
      qid,
      star
    }
  })
}

export async function getDoListByBaby(bid) {
  return await $axios({
    url: `/red/getdolistbybaby/${bid}/`
  })
}
