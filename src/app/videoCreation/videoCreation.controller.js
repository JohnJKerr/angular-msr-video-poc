export default class VideoCreationController {
  constructor(userMedia, recorder, $sce) {
    'ngInject';

    this.$sce = $sce;
    this.userMedia = userMedia;
    this.recorder = recorder;
    this.streamUri = null;

    this.userMedia.init()
      .then((mediaStream) => {
        this.setStreamUri(mediaStream);
        this.recorder.init(mediaStream);
      }, (error) => {
        throw error;
      });
  }

  record() {
    this.recorder.record();
  }

  stop() {
    this.recorder.stop();
  }

  setStreamUri(mediaStream) {
    //todo: remove leaky URI abstraction
    if (!(this.streamUri))
      this.streamUri = URL.createObjectURL(mediaStream);
  }
}
