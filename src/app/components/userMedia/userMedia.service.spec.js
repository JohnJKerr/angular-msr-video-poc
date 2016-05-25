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

	describe('$q property', () => {
		it('should be defined', inject(userMedia => {
			// assert
			expect(userMedia.$q).toBeTruthy();
		}));
	});

	describe('init method', () => {
		let mediaProvider = new class {
			constructor() {
				this.isError = false;
				this.isSuccess = false;
			}

			getUserMedia(constraints, onSuccess, onError) {
				if(this.isError)
					onError(new Error("error"));
				else if(this.isSuccess) {
					onSuccess({ stream: "stream" });
				}
			}
		};

		beforeEach(() => {
			mediaProvider.isError = false;
			mediaProvider.isSuccess = false;
		});

		it('should exist', inject(userMedia => {
			// assert
			expect(userMedia.init).toBeTruthy();
		}));

		it("should reject with error when can't get media", inject((userMedia, $rootScope) => {
			// arrange
			mediaProvider.isError = true;
			userMedia.mediaProvider = mediaProvider;

			// act/assert
			expect(() => {
				userMedia.init()
					.catch((e) => {
						throw e;
					});
					$rootScope.$digest();
				}).toThrow(jasmine.any(Error));
		}));

		it("should resolve with stream when it succeeds", inject((userMedia, $rootScope) => {
			// arrange
			mediaProvider.isSuccess = true;
			userMedia.mediaProvider = mediaProvider;
			let getStream;

			// act
			userMedia.init()
				.then((stream) => {
					getStream = stream;
				});

			// assert
			$rootScope.$digest();
			expect(getStream.stream).toEqual('stream');
		}));
	});
});
