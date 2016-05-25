import MediaStreamRecorder from 'msr';

describe('recorder service', () => {
	beforeEach(angular.mock.module('angularMsrVideoPoc'));

  it('should be registered', inject(recorder => {
    expect(recorder).not.toEqual(null);
  }));

	describe('init function', () => {
		it('should exist', inject((recorder) => {
			expect(recorder.init).toBeDefined();
		}));

		it('should initialise the recorder property', inject((recorder) => {
			// arrange
			recorder.recorder = null;

			// act
			recorder.init({});

			// assert
			expect(recorder.recorder).toBeTruthy();
		}));

		it('should set the recorder property to a MediaStreamRecorder', inject((recorder) => {
			// act
			recorder.init({});

			// assert
			expect(recorder.recorder).toEqual(jasmine.any(MediaStreamRecorder));
		}));

		it('should set the mime type on the recorder to webm', inject((recorder) => {
			// arrange
			let webM = "video/webm";

			// act
			recorder.init({});

			// assert
			expect(recorder.recorder.mimeType).toEqual(webM);
		}));

		describe('ondataavailable handler', () => {
			it('should be defined by recorder.init', inject((recorder) => {
				// act
				recorder.init({});

				// assert
				expect(recorder.recorder.ondataavailable).toBeTruthy();
			}));

			//todo: leaky abstraction currently preventing this test
			// it('should push blob to the recordings collection', () => {
			// 	// arrange
			// 	recorder.recordings = [];
			// 	recorder.init({});
			// 	let blob = {
			// 		uri: 'localhost/blobs/blob.jpg'
			// 	};
			//
			// 	// act
			// 	recorder.recorder.ondataavailable();
			// });
		});
	});

	describe('record function', () => {
		it('should exist', inject((recorder) => {
			expect(recorder.record).toBeTruthy();
		}));

		it('should throw when not intialised', inject((recorder) => {
			// arrange
			recorder.recorder = null;

			// assert
			expect(() => recorder.record()).toThrow(jasmine.any(Error));
		}));

		it('should start recording', inject((recorder) => {
			// arrange
			let mediaStreamRecorder = {
				start: jasmine.createSpy('start')
			};
			recorder.recorder = mediaStreamRecorder;

			// act
			recorder.record();

			// assert
			expect(mediaStreamRecorder.start).toHaveBeenCalled();
		}));
	});
});
