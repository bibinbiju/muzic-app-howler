import APP_ENV from "../configs/appEnv";
import Request from "../utils/request";

const MusicTrackRequest = new Request({
  baseURL: `${APP_ENV.API_TRACK_BASE_URL}/api/v1`,
});
const TrackService = {
  getTracks: ({ limit = 10, offset = 0 } = {}) =>
    MusicTrackRequest.get("/tracks", { params: { limit, cursor: offset } }),
};
export default TrackService;
