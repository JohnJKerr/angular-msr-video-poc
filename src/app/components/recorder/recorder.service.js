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
			let recorder = new MediaStreamRecorder(stream);
			recorder.mimeType = "video/webm";
			recorder.ondataavailable = (blob) => {
				var blobUrl = URL.createObjectURL(blob);
				this.recordingsList.push(blobUrl);
			};
			return recorder;
		};

		this.recorder = getRecorder(stream);
  };

  record(stream) {
		if(!this.recorder)
			throw new Error("Recorder must be initialised using init");

    this.recorder.start();
  }
}
