export default class VideoCreationController {
  constructor(userMedia, recorder) {
    'ngInject';

    this.userMedia = userMedia;
    this.recorder = recorder;
    this.streamUri = null;
  }

  record() {
    this.userMedia.init()
      .then((mediaStream) => {
				this.setStreamUri(mediaStream);
        this.recorder.init(mediaStream);
        this.recorder.record();
      })
      .catch((error) => {
        throw error;
      });
  }

	stop() {
		this.recorder.stop();
	}

  setStreamUri(mediaStream) {
		//todo: remove leaky URI abstraction
    if (!(this.streamUri))
      this.streamUri = URI.createObjectURL(mediaStream);
  }
}
