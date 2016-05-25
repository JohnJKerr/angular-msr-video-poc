export default class VideoCreationController {
  constructor(userMedia, recorder) {
    'ngInject';

    this.userMedia = userMedia;
    this.recorder = recorder;
    this.stream = null;

    this.activate();
  }

  activate() {
    this.userMedia.init()
      .then((stream) => {
        this.stream = stream;
      });
  }

  record() {
    this.recorder.init(this.stream);
    return this.recorder.record();
  }
}
