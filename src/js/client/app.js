define('app', ['angular'], function app(angular) {
  return angular.module('app', ['ngRoute', 'ngCookies', 'LocalStorageModule']);
});
