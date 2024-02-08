import axios from "axios";

export default class Request {
  constructor(
    config = {
      baseURL: "/",
      timeout: 10000,
      headers: {},
    }
  ) {
    this._client = axios.create(config);
  }
  get client() {
    return this._client;
  }
  get(url, config) {
    return this._client.get(url, config);
  }

  post(url, data, config) {
    return this._client.post(url, data, config);
  }

  patch(url, data, config) {
    return this._client.patch(url, data, config);
  }

  put(url, data, config) {
    return this._client.put(url, data, config);
  }

  delete(url, data, config) {
    return this._client.delete(url, config);
  }
}
