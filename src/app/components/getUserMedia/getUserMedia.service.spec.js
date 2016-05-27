describe('getUserMedia service', () => {
	beforeEach(angular.mock.module('angularMsrVideoPoc'));

	it('should be registered', inject(getUserMedia => {
		// assert
		expect(getUserMedia).not.toEqual(null);
	}));

	describe('$q property', () => {
		it('should exist', inject(getUserMedia => {
			// assert
			expect(getUserMedia.$q).toBeTruthy();
		}));

		it('should equal $q', inject((getUserMedia, $q) => {
			// assert
			expect(getUserMedia.$q).toEqual($q);
		}));
	});

	describe('navigator property', () => {
		it('should exist', inject(getUserMedia => {
			// assert
			expect(getUserMedia.navigator).toBeTruthy();
		}));

		it('should equal navigator', inject((getUserMedia) => {
			// assert
			expect(getUserMedia.navigator).toEqual(navigator);
		}));
	});

	describe('getUserMedia function', () => {
		let mediaDevicesNav;
		let nav;
		let promise;

		beforeEach(inject(getUserMedia => {
			let deferred = getUserMedia.$q.defer();
			promise = deferred.promise;

			mediaDevicesNav = {
				mediaDevices: {
					getUserMedia(constraints) {
						return promise;
					}
				}
			};

			nav = {
				getUserMedia(constraints, onSuccess, onError) {
					return promise;
				}
			}
		}));

		it('should exist', inject(getUserMedia => {
			// assert
			expect(getUserMedia.getUserMedia).toBeTruthy();
		}));

		it('should return promise when mediaDevices is defined', inject(getUserMedia => {
			// arrange
			getUserMedia.navigator = mediaDevicesNav;

			// act
			let mediaPromise = getUserMedia.getUserMedia({});

			// assert
			expect(mediaPromise).toEqual(promise);
		}));

		it('should return promise when mediaDevices is undefined', inject(getUserMedia => {
			// arrange
			getUserMedia.navigator = nav;

			// act
			let mediaPromise = getUserMedia.getUserMedia({});

			// assert
			expect(mediaPromise).toEqual(promise);
		}));
	});
});
