define({ 

  onClickSync: async function() {
  	try {
  	  kony.print('Start sync');
      const options = {
        syncType: 'downloadOnly'
      };
      const result = await cmo.service.syncObjectService('CMOObjSvcRefData', options);
	  kony.print('end sync');
	  kony.print(result);
	} catch(error) {
  	  kony.print('Error Sync');
      kony.print(error);
	}
  }

});