///<reference path='../../typings/tsd.d.ts' />

/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('TopicCtrl', function () {
  var ctrl;

  beforeEach(module('topic'));

  beforeEach(inject(function ($rootScope, $controller) {
    ctrl = $controller('TopicCtrl');
  }));

  it('should have ctrlName as TopicCtrl', function () {
    expect(ctrl.ctrlName).toEqual('TopicCtrl');
  });

});