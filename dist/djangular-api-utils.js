// url-join function
// taken from https://github.com/jfromaniello/url-join
(function (name, context, definition) {
  if (typeof module !== 'undefined' && module.exports) module.exports = definition();
  else if (typeof define === 'function' && define.amd) define(definition);
  else context[name] = definition();
})('urljoin', this, function () {

  function normalize (str) {
    return str
            .replace(/[\/]+/g, '/')
            .replace(/\/\?/g, '?')
            .replace(/\/\#/g, '#')
            .replace(/\:\//g, '://');
  }

  return function () {
    var joined = [].slice.call(arguments, 0).join('/');
    return normalize(joined);
  };

});

(function(){
  'use strict';

  angular.module('djangularApiUtils', []);

  // Factory service
  // -----------------------------------------------------------------------------
  angular.module('djangularApiUtils')
    .factory('API', API);

  API.$inject = ['$window'];

  function API($window){
    var API = {
      'makeURL': makeURL,
      'getIdFromApiUrl': getIdFromApiUrl
    };

    return API;

    function getDomain(url){
      var protocol;
      if( url.indexOf('http://') > -1 ){ url = url.replace('http://', ''); protocol = 'http://'; }
      if( url.indexOf('https://') > -1 ){ url = url.replace('https://', ''); protocol = 'https://'; }
      url = url.split('/');
      return {
        protocol: protocol,
        domain: url[0]
      };
    }

    function makeURL(path, getParams){
      var currentPath = $window.location.href;

      var domain = getDomain(currentPath);
      var url = urljoin(domain.protocol, domain.domain, 'api', path);

      // append trailing slash if isn't present
      if( url.slice(-1) != '/' ) url += '/';

      // attach get params
      if( ! angular.isUndefined(getParams) ){
        var first = true;
        _.each(getParams, function(value, key){
          // append ? or & to join params
          url += (first === true) ? '?' : '&';
          first = false;

          url += key + '=' + value;
        });
      }

      return url;
    }

    function getIdFromApiUrl(url){
      // match the id part of the url /[id]/ and return without slash as a number
      return parseInt(url.match(/\/(\d+)\//g)[0].replace('/', ''));
    }
  }
})();