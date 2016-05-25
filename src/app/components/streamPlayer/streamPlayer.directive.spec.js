describe('streamPlayer directive', () => {
  let vm;
  let element;
  let scope;
  let stream = {
    stream: 'stream'
  };

  beforeEach(angular.mock.module('angularMsrVideoPoc'));

  beforeEach(inject(($compile, $rootScope) => {
    scope = $rootScope.$new();
    scope.stream = stream;

    element = angular.element(`
      <video stream-player stream="stream"></video>
    `);

    $compile(element)(scope);
    $rootScope.$digest();
    vm = element.isolateScope();
  }));

  it('should be compiled', () => {
    expect(element.html()).not.toEqual(null);
  });

  it('should have isolate scope', () => {
    expect(vm).toEqual(jasmine.any(Object));
  });

  describe('stream property', () => {
    it('should exist', () => {
      expect(vm.stream).toEqual(stream);
    });
  });

  //todo: figure out how to test this
  // describe('element', () => {
  //   it('should have srcObject set to stream', () => {
  //     expect(element.srcObject).toEqual(vm.stream);
  //   });
  // });
});
