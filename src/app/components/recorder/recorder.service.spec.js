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
		});
	});

	describe('record function', () => {
		it('should exist', inject((recorder) => {
			expect(recorder.record).toBeTruthy();
		}));

		it('should error when not intialised', inject((recorder) => {
			// arrange
			recorder.recorder = null;

			// assert
			expect(() => recorder.record()).toThrow(jasmine.any(Error));
		}));

		it('should start recording', inject((recorder) => {
			// arrange
			recorder.init({});
			spyOn(recorder.recorder, 'start');


			// act
			recorder.record();

			// assert
			expect(recorder.recorder.start).toHaveBeenCalled();
		}));
	});

	describe('stop function', () => {
		it('should exist', inject(recorder => {
			expect(recorder.stop).toBeTruthy();
		}));

		it('should call recorder stop', inject(recorder => {
			// arrange
			recorder.init({});
			spyOn(recorder.recorder, 'stop');

			// act
			recorder.stop();

			// assert
			expect(recorder.recorder.stop).toHaveBeenCalled();
		}));

		it('should error when not recording', inject(recorder => {
			// act/assert
			expect(() => { recorder.stop(); }).toThrow(jasmine.any(Error));
		}));
	});

	describe('addRecording function', () => {
		it('should exist', inject(recorder => {
			expect(recorder.addRecording).toBeTruthy();
		}));

		it('should push to recordings collection', inject(recorder => {
			// arrange
			let recordingsCount = recorder.recordings.length;

			// act
			recorder.addRecording('blobUrl');

			// arrange
			expect(recorder.recordings.length).toEqual(recordingsCount + 1);
		}));
	});
});
