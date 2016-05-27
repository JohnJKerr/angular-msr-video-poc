describe('user media service', () => {
  beforeEach(angular.mock.module('angularMsrVideoPoc'));

  it('should be registered', inject(userMedia => {
    expect(userMedia).not.toEqual(null);
  }));

  describe('config property', () => {
    it('should exist', inject(userMedia => {
      // assert
      expect(userMedia.config).toBeTruthy();
    }));

    it('should have video set to true', inject(userMedia => {
      // assert
      expect(userMedia.config.video).toBe(true);
    }));

    it('should have audio set to true', inject(userMedia => {
      // assert
      expect(userMedia.config.audio).toBe(true);
    }));
  });

  describe('mediaProvider property', () => {
    it('should be defined', inject(userMedia => {
      // assert
      expect(userMedia.mediaProvider).toBeTruthy();
    }));
  });

  describe('init method', () => {
    let deferred;

    beforeEach(inject((userMedia, $q) => {
      deferred = $q.defer();
      spyOn(userMedia.mediaProvider, 'getUserMedia').and.returnValue(deferred.promise);
    }));

    it('should exist', inject(userMedia => {
      // assert
      expect(userMedia.init).toBeTruthy();
    }));

    it("should reject with error when can't get media", inject((userMedia, $rootScope) => {
      // arrange
      deferred.reject(new Error());

      // act/assert
      userMedia.init()
        .catch((error) => {

          expect(error).toBe(jasmine.any(Error));
        });
    }));

    it("should set stream when it succeeds", inject(userMedia => {
      // arrange
      let getStream;
      let streamValue = 'stream';
      deferred.resolve(streamValue);

      // act/assert
      userMedia.init()
        .then((mediaStream) => {
          getStream = mediaStream;
          expect(getStream).toEqual(streamValue);
        });
    }));
  });
});
