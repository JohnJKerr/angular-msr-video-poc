export default class UserMediaService {
  constructor(getUserMedia) {
    'ngInject';

    this.config = {
      audio: true,
      video: true
    };
    this.mediaProvider = getUserMedia;
  }

	init() {
		return this.mediaProvider.getUserMedia(this.config);
	}
}
