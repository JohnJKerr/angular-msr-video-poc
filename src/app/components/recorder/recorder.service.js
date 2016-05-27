// todo: leaky abstractions on msr and url apis
import MediaStreamRecorder from 'msr';

export default class RecorderService {
  constructor() {
    'ngInject';

		this.recordings = [];
    this.recorder = null;
  }

  init(stream) {
		let getRecorder = (stream) => {
			let self = this;

			let recorder = new MediaStreamRecorder(stream);
			recorder.mimeType = "video/webm";
			recorder.ondataavailable = (blob) => {
				var blobUrl = URL.createObjectURL(blob);
				self.addRecording(blobUrl);
			};
			return recorder;
		};

		this.recorder = getRecorder(stream);
  }

  record() {
		if(!this.recorder)
			throw new Error("Recorder must be initialised using init");

    this.recorder.start(3000);
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
