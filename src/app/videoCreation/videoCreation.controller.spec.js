describe('videoCreation controller', () => {
  let vm;
  let scope;
  let recording = 'recording successful';
  let deferred;

  beforeEach(angular.mock.module('angularMsrVideoPoc'));

  beforeEach(inject(($controller, userMedia, recorder, $q, $rootScope) => {
    deferred = $q.defer();
    scope = $rootScope.$new();

    spyOn(userMedia, 'init').and.returnValue(deferred.promise);
    deferred.resolve('stream');

    spyOn(recorder, 'init').and.callFake(() => {});
    spyOn(recorder, 'record').and.callFake(() => {
			recorder.recordings.push(recording);
      return recording;
    });
		spyOn(recorder, 'stop');

    vm = $controller('VideoCreationController');

		spyOn(vm, 'setStreamUri').and.callFake(() => {
			vm.streamUri = 'blob:uri';
		});
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

		it('should call init on userMedia', inject($rootScope => {
			// act
			vm.record();
			$rootScope.$apply();

      // assert
      expect(vm.userMedia.init).toHaveBeenCalled();
		}));

		it('should call setStreamUri', inject($rootScope => {
			// act
			vm.record();
			$rootScope.$apply();

      // assert
      expect(vm.setStreamUri).toHaveBeenCalled();
		}));

		it('should call init on recorder', inject($rootScope => {
			// act
			vm.record();
			$rootScope.$apply();

      // assert
      expect(vm.recorder.init).toHaveBeenCalled();
		}));

    it('should record the current stream', inject($rootScope => {
      // act
			vm.record();
			$rootScope.$apply();

      // assert
      expect(vm.recorder.record).toHaveBeenCalled();
    }));
  });

	describe('stop function', () => {
		it('should call stop when recording', inject($rootScope => {
			// arrange
			vm.record();
			$rootScope.$apply();

			// act
			vm.stop();

			// assert
			expect(vm.recorder.stop).toHaveBeenCalled();
		}));
	});
});
