describe('videoCreation controller', () => {
  let vm;
  let scope;
  let recording = 'recording successful';

  beforeEach(angular.mock.module('angularMsrVideoPoc'));

  beforeEach(inject(($controller, userMedia, recorder, $q, $rootScope) => {
    scope = $rootScope.$new();
    spyOn(userMedia, 'init').and.callFake(() => {
      return $q((resolve) => {
        resolve({
          stream: 'stream'
        });
      });
    });
    spyOn(recorder, 'init').and.callFake(() => {});
    spyOn(recorder, 'record').and.callFake(() => {
      return recording;
    });
    vm = $controller('VideoCreationController');
  }));

  it('should exist', () => {
    // assert
    expect(vm).toBeDefined();
  });

  describe('userMedia property', () => {
    it('should be defined', () => {
      // assert
      expect(vm.userMedia).toBeTruthy();
    });

    it('should set stream on activation', () => {
      // arrange
      scope.$digest();

      // assert
      expect(vm.stream).toBeTruthy();
    });
  });

  describe('recorder property', () => {
    it('should be defined', () => {
      // assert
      expect(vm.recorder).toBeTruthy();
    });
  });

  describe('record function', () => {
    it('should be defined', () => {
      // assert
      expect(vm.record).toBeTruthy();
    });

    it('should record the current stream', () => {
      // act
      let getRecording = vm.record();

      // assert
      expect(getRecording).toEqual(recording);
    });
  });
});
