// todo: leaky abstractions on msr and url apis
import MediaStreamRecorder from 'msr';

export default class RecorderService {
  constructor($http) {
    'ngInject';
		this.$http = $http;
		this.recordings = [];
    this.recorder = null;
		this.videoStartTime = Date.now();
		this.videoSegmentIndex = 0;
  }

  init(stream) {
		let getRecorder = (stream) => {
			let self = this;

			let recorder = new MediaStreamRecorder(stream);
			recorder.mimeType = "video/webm";
			recorder.audioChannels = 1;
			recorder.clearOldRecordedFrames();
			recorder.onStartedDrawingNonBlankFrames = () => {
				recorder.clearOldRecordedFrames();
			}
			
			recorder.ondataavailable = (blob) => {
				self.videoSegmentIndex += 1;
				var formData = new FormData();
				let filename = self.videoStartTime + '-video' + self.videoSegmentIndex +'.webm';
				formData.append('filename', filename);
				formData.append('video', blob);

				self.$http({
					method: 'POST',
					url: 'http://localhost:59161/video',
					headers: {
						'Content-Type': undefined
					},
					data: formData
				}).then(() => {
					self.addRecording(filename);
				}, () => {
					console.log("error");
				});
				
			};
			
			return recorder;
		};

		this.recorder = getRecorder(stream);
  }

  record() {
		if(!this.recorder)
			throw new Error("Recorder must be initialised using init");

    this.recorder.start(2000);
  }

	stop() {
		if(!this.recorder)
			throw new Error("Recorder must be recording before it can be stopped");

    this.recorder.stop();
	}

	addRecording(blobUrl) {
		let pushRecording = (blobUrl) => {
			this.recordings.push(blobUrl);
		};

		pushRecording(blobUrl);
	}
}
