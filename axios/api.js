import axios from "./axios";
 
export const getConfig = data => axios.post('diff/getConfig', data)
 
// 收银台信息加密
export const vipJsonEncrypt = data => axios.post('vipJsonEncrypt', data)
// 抽奖
export const lottery = data => axios.post('diff/lottery', data)
// 宝箱抽奖
export const boxLottery = data => axios.post('diff/boxLottery', data)
export const addSystemLog = data => axios.post('addSystemLog', data)

export const userInfoDecrypt = data => axios.post(`userInfoDecrypt`, data);

