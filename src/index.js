// 导入所有模块
import * as cookieUtils from './modules/cookie';
import * as urlUtils from './modules/url';
import * as deviceUtils from './modules/device';
import * as shareUtils from './modules/share';
import * as requestUtils from './modules/request';
import * as uploadUtils from './modules/upload';
import * as promiseUtils from './modules/promise';
import * as dataUtils from './modules/data';
import * as stringUtils from './modules/string';
import * as dateUtils from './modules/date';
import * as numberUtils from './modules/number';
import * as storageUtils from './modules/storage';
import * as domUtils from './modules/dom';
import * as validateUtils from './modules/validate';
import * as imageUtils from './modules/image';
import * as performanceUtils from './modules/performance';
import * as utils from './modules/utils';

// 导出所有工具方法
export {
  cookieUtils,
  urlUtils,
  deviceUtils,
  shareUtils,
  requestUtils,
  uploadUtils,
  promiseUtils,
  dataUtils,
  stringUtils,
  dateUtils,
  numberUtils,
  storageUtils,
  domUtils,
  validateUtils,
  imageUtils,
  performanceUtils,
  utils
};

// 默认导出所有方法的集合
export default {
  ...cookieUtils,
  ...urlUtils,
  ...deviceUtils,
  ...shareUtils,
  ...requestUtils,
  ...uploadUtils,
  ...promiseUtils,
  ...dataUtils,
  ...stringUtils,
  ...dateUtils,
  ...numberUtils,
  ...storageUtils,
  ...domUtils,
  ...validateUtils,
  ...imageUtils,
  ...performanceUtils,
  ...utils
};