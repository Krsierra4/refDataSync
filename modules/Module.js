var cmo = cmo || {};
cmo.service = cmo.service || {};

cmo.service.getDataObject = function (objectName, query) {
  return new Promise(function (resolve, reject) {
    const object = new kony.sdk.KNYObj(objectName);
    let options = query ? query : {};
    options.whereCondition = (options.whereCondition === null)?{}:options.whereCondition;
    if (objectName !== cmo.constants.LOG_OBJECTNAME){
      options.whereCondition.DeleteFlag = false;
    }
    object.get(options, response => resolve(response), error => reject(error));
  });
};

cmo.service.createDataObject = function (objectName, record, options) {
  return new Promise(function (resolve, reject) {
    const object = new kony.sdk.KNYObj(objectName);
    object.create(record, options, response => resolve(response), error => reject(error));
  });
};

cmo.service.clearDataService = function (serviceName) {
  return new Promise(function (resolve, reject) {
    const objectService = new kony.sdk.KNYObjSvc(serviceName);
    objectService.clearOfflineData({}, response => resolve(response), error => reject(error));
  });
};

cmo.service.deleteDataObject = function (objectName, options) {
  return new Promise(function (resolve, reject) {
    const object = new kony.sdk.KNYObj(objectName);
    object.delete(options, response => resolve(response), error => reject(error));
  });
};

cmo.service.syncObjectService = function(serviceName, options) {
  return new Promise(function(resolve,reject) {
    const objectService = new kony.sdk.KNYObjSvc(serviceName);
    objectService.startSync(options, response => resolve(response), error => reject(error));
  });
};
