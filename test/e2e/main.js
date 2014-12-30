'use strict';

describe('The main view', function () {

  beforeEach(function () {
    browser.get('http://localhost:3000');
  });

  it('list all player logos', function () {
    element.all(by.repeater('player in players')).count().then(function(count) {
      expect(count == 3).toBeTruthy();
    });
  });

});
