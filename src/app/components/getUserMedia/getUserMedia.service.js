export default class GetUserMediaService {
  constructor($q) {
    'ngInject';

    this.$q = $q;
		this.navigator = navigator;
  }

  getUserMedia(constraints) {
    let promise;

    if (this.navigator.mediaDevices && this.navigator.mediaDevices.getUserMedia) {
      promise = this.navigator.mediaDevices.getUserMedia(constraints)
    } else {
      promise = this.$q((resolve, reject) => {
        let onSuccess = (mediaStream) => {
          resolve(mediaStream);
        };

        let onError = (error) => {
          reject(error);
        };

        this.navigator.getUserMedia(constraints, onSuccess, onError);
      });
    }

    return promise;
  }
}
