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
import * as i18nUtils from './modules/i18n';
import * as cryptoUtils from './modules/crypto';
import * as animationUtils from './modules/animation';
import * as geoUtils from './modules/geo';
import * as formUtils from './modules/form';
import webrtcUtils from './modules/webrtc';
import blockchainUtils from './modules/blockchain';
import microfrontendUtils from './modules/microfrontend';

// 新增模块导入
import * as pwaUtils from './modules/pwa';
import * as dataProcessorUtils from './modules/dataProcessor';
import * as advancedPerformanceUtils from './modules/advancedPerformance';

// 导出新模块
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
  utils,
  i18nUtils,
  cryptoUtils,
  animationUtils,
  geoUtils,
  formUtils,
  pwaUtils,
  dataProcessorUtils,
  advancedPerformanceUtils,
  webrtcUtils,
  blockchainUtils,
  microfrontendUtils
};

// 导出类型
export * from './types';

// 导出具体函数
export * from './modules/cookie';
export * from './modules/url';
export * from './modules/device';
export * from './modules/share';
export * from './modules/request';
export * from './modules/upload';
export * from './modules/promise';
export * from './modules/data';
export * from './modules/string';
export * from './modules/date';
export * from './modules/number';
export * from './modules/storage';
export * from './modules/dom';
export * from './modules/validate';
export * from './modules/image';
export * from './modules/performance';
export * from './modules/utils';

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
  ...utils,
  ...i18nUtils,
  ...cryptoUtils,
  ...animationUtils,
  ...geoUtils,
  ...formUtils,
  ...pwaUtils,
  ...dataProcessorUtils,
  ...advancedPerformanceUtils,
  webrtcUtils,
  blockchainUtils,
  microfrontendUtils
};