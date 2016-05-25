export default class UserMediaService {
  constructor($q) {
    'ngInject';

    this.config = {
      audio: true,
      video: true
    };
    //todo: remove leaky abstraction
    this.mediaProvider = navigator;
		this.$q = $q;
  }

  init() {
    return this.$q((resolve, reject) => {
      let onSuccess = (mediaStream) => {
        resolve(mediaStream);
      }

      let onError = (e) => {
        reject(e);
      }

      this.mediaProvider.getUserMedia(this.config, onSuccess, onError);
    });
  }
}
