/* global describe, beforeEach, it, expect, inject, module */
module codeEditor {
  'use strict';

  describe('EditMarker', function () {
    var service:EditMarker;
    var testText = 'Please replace ??? with the correct answer!';

    beforeEach(angular.mock.module('codeEditor'));

    beforeEach(inject(function (EditMarker) {
      service = EditMarker;
    }));

    it('empty text should not contain a mark', () => {
      expect(service.containsMark('')).toBe(false);
    });

    it('text with mark should contain a mark', () => {
      expect(service.containsMark(service.mark)).toBe(true);
    });

    it('null text should not contain a mark', () => {
      expect(service.containsMark(null)).toBe(false);
    });

    describe('Has only mark changed:', () => {

      it('should be valid, if no mark is available', () => {
        expect(service.hasOnlyMarkChanged("", "")).toBe(true);
      });

      it('should return true, if nothing has changed', () => {
        expect(service.hasOnlyMarkChanged("???", "???")).toBe(true);
      });

      it('should return true when mark changed', () => {
       expect(service.hasOnlyMarkChanged("???", "")).toBe(true);
       expect(service.hasOnlyMarkChanged("???", "??")).toBe(true);
       expect(service.hasOnlyMarkChanged("code ???", "code ??")).toBe(true);
       expect(service.hasOnlyMarkChanged("code ??? aaa", "code ?? aaa")).toBe(true);
       expect(service.hasOnlyMarkChanged("code ??? aa\na", "code ?\n? aa\na")).toBe(true);
      });

      it('should return false when original text changed', () => {
        expect(service.hasOnlyMarkChanged("code ???", "codxe ??")).toBe(false);
        expect(service.hasOnlyMarkChanged("code ??? code", "codxe ??? code")).toBe(false);
        expect(service.hasOnlyMarkChanged("code ??? code", "code ??? codxe")).toBe(false);
        expect(service.hasOnlyMarkChanged("code ??? code", "code ??")).toBe(false);
        expect(service.hasOnlyMarkChanged("code ??? code", "code ?? code xxx")).toBe(false);
      });


      it('should return true for multiple marks when only marks have changed', () => {
        expect(service.hasOnlyMarkChanged("??? a ???", ". a xx")).toBe(true);
      });


      it('should return false when original text changed for multiple marks', () => {
        expect(service.hasOnlyMarkChanged("a ??? a ???", "a b")).toBe(false);
      });

      it('should be valid for special characters as well', () => {
        expect(service.hasOnlyMarkChanged("(1 * 1).should.equal(???);", "(1 * 1).should.equal(1);")).toBe(true);
      });

    });

    describe('Annotation arrays', () => {

      it('should not be equal, for different lengths', () => {
        var a1 = [new NoMarkAnnotation(0,0,testText)];
        var a2 = [];
        expect(service.equals(a1,a2)).toBe(false);
      });

      it('should be equal, for the same annotations ', () => {
        var a1 = [new NoMarkAnnotation(0,0,testText)];
        var a2 = [new NoMarkAnnotation(0,0,testText)];
        expect(service.equals(a1,a2)).toBe(true);
      });

      it('should not be equal, for one different annotation ', () => {
        var a1 = [new NoMarkAnnotation(0,0,testText)];
        var a2 = [new NoMarkAnnotation(0,1,testText)];
        expect(service.equals(a1,a2)).toBe(false);
      });

      it('should not be equal, for one different annotation (multiple values)', () => {
        var a1 = [new NoMarkAnnotation(0,0,testText), new NoMarkAnnotation(0,0,testText)];
        var a2 = [new NoMarkAnnotation(0,0,testText), new NoMarkAnnotation(1,0,testText)];
        expect(service.equals(a1,a2)).toBe(false);
      });


    });

    describe('getEditMarks',()=>{

      it('should return an empty array for an empty, null or undefined text', () => {
        expect(service.getEditMarks(undefined)).toEqual([]);
        expect(service.getEditMarks(null)).toEqual([]);
        expect(service.getEditMarks('')).toEqual([]);
      });

      it('should find a mark on a single line', () => {
        expect(service.getEditMarks('???')).toEqual([{row: 0, column: 0}]);
        expect(service.getEditMarks('aa???')).toEqual([{row: 0, column: 2}]);
        expect(service.getEditMarks('aa???aa')).toEqual([{row: 0, column: 2}]);
        expect(service.getEditMarks('aa???aa???')).toEqual([{row: 0, column: 2}]);
      });

      it('should not return a result, if no edit mark is found', () => {
        expect(service.getEditMarks('a')).toEqual([]);
      });

      it('should return one occurrence per line for multiple lines', () => {
        expect(service.getEditMarks('\n???')).toEqual([{row: 1, column: 0}]);
      });

    });

  });

}