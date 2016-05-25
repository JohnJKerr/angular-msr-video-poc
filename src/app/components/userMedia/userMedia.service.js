export default class UserMediaService {
	constructor() {
    'ngInject';

		this.config = {
			audio: true,
			video: true
		};
		//todo: remove leaky abstraction
		this.mediaProvider = navigator;
  }

	init() {
		let stream;
		let onSuccess = (mediaStream) => {
			stream = mediaStream;
		}

		let onError = (e) => {
			throw e;
		}

		this.mediaProvider.getUserMedia(this.config, onSuccess, onError);
		return stream;
	}
}
