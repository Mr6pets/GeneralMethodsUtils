// 导入所有模块
import * as cookieUtils from './modules/cookie';
import * as urlUtils from './modules/url';
import * as deviceUtils from './modules/device';
import * as shareUtils from './modules/share';
import * as requestUtils from './modules/request';
import * as uploadUtils from './modules/upload';
import * as promiseUtils from './modules/promise';

// 导出所有工具方法
export {
  cookieUtils,
  urlUtils,
  deviceUtils,
  shareUtils,
  requestUtils,
  uploadUtils,
  promiseUtils
};

// 默认导出所有方法的集合
export default {
  ...cookieUtils,
  ...urlUtils,
  ...deviceUtils,
  ...shareUtils,
  ...requestUtils,
  ...uploadUtils,
  ...promiseUtils
};