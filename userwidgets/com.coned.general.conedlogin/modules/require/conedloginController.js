/*
#
#  Created by Team Kony.
#  Copyright (c) 2017 Kony Inc. All rights reserved.
#
*/
define(function () {
  var JWTToken = require('com/coned/general/conedlogin/JWTToken');
  constants.DEFAULT_SUCCESS_MESSAGE = "Login Success";
  constants.DEFAULT_FAILURE_MESSAGE = "Login Failed";
  constants.MF_ALERT_MESSAGE = "Please connect to MobileFabric";
  return {
    onLoginSuccess: null,
    onLoginFailure: null,
    loadingComponent: null,
    constructor: function (baseConfig, layoutConfig, pspConfig) {

    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function () {
      defineSetter(this, "identityServiceID", function (val) {
        this._identityServiceID = val;
      });

      defineGetter(this, "identityServiceID ", function () {
        return this._identityServiceID;
      });

    },

    setCallbacks: function (successCallback, errorCallback) {
      this.onLoginSuccess = successCallback;
      this.onLoginFailure = errorCallback;
    },

    invokeIdentityService: function (loadingComponentParam) {
      this.loadingComponent = loadingComponentParam;
      if (!kony.net.isNetworkAvailable(constants.NETWORK_TYPE_ANY)) {
        this.executeFailureCallback("No network available");
        return;
      }
      try {
        var component = this;
        var argument = {};
        var authorizationClient = null;
        var sdkClient = new kony.sdk.getCurrentInstance();
        if (Object.keys(sdkClient).length !== 0) {
          authorizationClient = sdkClient.getIdentityService(this._identityServiceID);
        }
        if (authorizationClient === null || authorizationClient === undefined) {
          kony.application.dismissLoadingScreen();
          return;
        }
        this.view.forceLayout();
        argument.browserWidget = this.view.brwsrIdentity;
        var loginOptions = {};
        loginOptions.persistLoginResponse = true;
        argument.loginOptions = loginOptions;
        argument.include_profile = true;
        authorizationClient_global = authorizationClient;
        arguments_global = argument;
        authorizationClient.login(argument, function (response) {
          if (component.loadingComponent) {
            component.loadingComponent.showLoading();
            component.loadingComponent.hideLoading();
          }
          authorizationClient.getSecurityAttributes(function (responseDetails) {
            component.successWrapper(responseDetails);
          }, component.failureWrapper.bind(this));
        }, this.failureWrapper.bind(this));
      } catch (exception) {
        kony.application.dismissLoadingScreen();
        this.executeFailureCallback(exception);
      }
    },

    /**
         * @function successWrapper
         * @description Success callback for invokeIdentityService
         * @private
         * @param {Object} response
         * @callback invokeIdentityServiceCallback
         * @event loginSuccessEvent
         */
    successWrapper: function (response) {
      try {
        kony.application.dismissLoadingScreen();
        if (this.onLoginSuccess !== null && this.onLoginSuccess !== undefined) {
          var accessToken = response.access_token;
          var userDetails = JWTToken.decodeToken(accessToken);
          var customResponse = {
            "userDetails": JSON.parse(userDetails),
            "tokenExpirationDate": response.expires_on
          };
          this.onLoginSuccess(customResponse);
        }
      } catch (exception) {
        this.executeFailureCallback(exception);
      }
    },

    /**
         * @function failureWrapper
         * @description Failure callback for invokeIdentityService
         * @private
         * @param {Object} response
         * @callback invokeIdentityServiceCallback
         * @event loginFailureEvent
         */
    failureWrapper: function (response) {
      try {
        if (this.loadingComponent) {
          this.loadingComponent.hideLoading();
        }
        if (this.onLoginFailure !== null && this.onLoginFailure !== undefined) {
          this.onLoginFailure(response);
        }
      } catch (exception) {
        this.executeFailureCallback(exception);
      }
    },

    executeFailureCallback: function (error) {
      if (this.onLoginFailure && typeof (this.onLoginFailure) === 'function') {
        this.onLoginFailure(error);
      }
    }

  };

});