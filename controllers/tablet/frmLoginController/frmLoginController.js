define({ 

  onNavigate: function() {
    this.view.preShow = this.onPreshow;
    this.view.postShow = this.onPostshow;
  },
  
  onPreshow: function() {
    this.view.conedlogin.setCallbacks(this.successLogin.bind(this), this.failureLogin.bind(this));
  },
  
  onPostshow: function() {
    this.view.conedlogin.invokeIdentityService();
  },

  successLogin: function(response) {
    kony.print('****** success login ******');
    const syncForm = new kony.mvc.Navigation('frmSync');
    syncForm.navigate();
  },

  failureLogin: function(error) {
    kony.print('****** failure login ******');
    kony.print(error);
  },

});
