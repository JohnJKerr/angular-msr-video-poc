describe('streamPlayer directive', () => {
  let vm;
  let element;
  let scope;
	let streamUri = 'blob:uri';
	let playSpy;

  beforeEach(angular.mock.module('angularMsrVideoPoc'));

  beforeEach(inject(($compile, $rootScope) => {
    scope = $rootScope.$new();
    scope.streamUri = streamUri;

    element = angular.element(`
      <video stream-player stream-uri="streamUri"></video>
    `);

		playSpy = jasmine.createSpy('play');
		element[0].play = playSpy;

    $compile(element)(scope);
    $rootScope.$digest();
    vm = element.isolateScope();
  }));

  it('should be compiled', () => {
		// assert
    expect(element.html()).not.toEqual(null);
  });

  it('should have isolate scope', () => {
		// assert
    expect(vm).toEqual(jasmine.any(Object));
  });

  describe('streamUri property', () => {
    it('should exist', () => {
			// assert
      expect(vm.streamUri).toBeTruthy();
    });

		it('should call play on underlying element', () => {
			// assert
			expect(playSpy).toHaveBeenCalled();
		});

		it('should sync with src attr on element', () => {
			// assert
			expect(element.attr('src')).toEqual(streamUri);
		});
  });
});
