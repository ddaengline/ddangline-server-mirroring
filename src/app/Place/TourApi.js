const axios = require("axios");
const https = require("https");
const { Station } = require('../../models/Station')
const { SERVICE_KEY, BASE_URL } = require('../../../config/secret')
const MobileOS = "ETC"
const MobileApp = "ddaengLine"
const _type = "json"

// 지역 기반 관광 정보 조회
async function getTourAPIAreaBasedList(pageOffSet){
  const areaCode = 1;  // 서울 지역 코드
  const contentTypeId = 14  // 관광 타입 id (14 : 문화시설)
  const arrange = "P";
  const tourData = await axios.get(BASE_URL + "areaBasedList", {
    params: {
      MobileOS, MobileApp, _type,
      serviceKey: SERVICE_KEY,
      pageNo: pageOffSet,
      areaCode, contentTypeId, arrange
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  })
  return tourData.data.response.body.items.item;
}

// 위치 기반 검색
async function getTourAPILocationBasedList(station, time, pageOffSet){
  const contentTypeId = 14  // 관광 타입 id (14 : 문화시설)
  const arrange = "P";
  let radius; // m기
  const { address } = await getCoordinates(station);
  console.log({ address })
  const [mapX, mapY] = address[0].location.coordinates;
  if (time === 20) radius = 2000;
  else if (time === 15) radius = 1500;
  else if (time === 10) radius = 1000;
  else if (time === 5) radius = 500;
  const tourData = await axios.get(BASE_URL + "locationBasedList", {
    params: {
      MobileOS, MobileApp, _type,
      serviceKey: SERVICE_KEY,
      pageNo: pageOffSet,
      contentTypeId, arrange, mapX, mapY, radius
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  })
  return tourData.data.response.body.items.item;
}

// 공통 정보 조회
async function getTourAPIDetailCommon(contentId){
  const tourData = await axios.get(BASE_URL + "detailCommon", {
    params: {
      MobileOS, MobileApp, _type,
      serviceKey: SERVICE_KEY,
      contentId,
      defaultYN: "Y", firstImageYN: "Y", mapinfoYN: "Y"
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  })
  return tourData.data.response.body.items.item;
}

async function getCoordinates(station){
  return Station.findOne({ nameKR: station }, { address: 1 })
}

// TODO: 가장 가까운 지하철역

module.exports = {
  getTourAPIAreaBasedList, getTourAPILocationBasedList, getTourAPIDetailCommon
}