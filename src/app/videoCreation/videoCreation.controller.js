export default class VideoCreationController {
	constructor (userMedia, recorder) {
    'ngInject';

		this.userMedia = userMedia;
    this.recorder = recorder;

		this.activate();
  }

	activate() {
		this.stream = this.userMedia.init();
	}

	record() {
		this.recorder.init(this.stream);
		return this.recorder.record();
	}
}
