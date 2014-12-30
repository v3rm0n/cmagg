'use strict';

describe('controllers', function(){
  var scope;

  beforeEach(module('cmagg'));

  beforeEach(inject(function($rootScope) {
  	scope = $rootScope.$new();
  }));

  it('should define all available players', inject(function($controller) {
    expect(scope.players).toBeUndefined();

    $controller('MainController', {
      $scope: scope
  	});

    expect(angular.isArray(scope.players)).toBeTruthy();
    expect(scope.players.length == 3).toBeTruthy();
  }));
});
