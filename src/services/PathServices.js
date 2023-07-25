import apiClient from "./services";

export default {
  getPaths() {
    return apiClient.get("path");
  },
  getPath(id) {
    return apiClient.get("path/" + id);
  },
  addPath(path) {
    return apiClient.post("path", path);
  },
  updatePath(path) {
    return apiClient.put("path/" + path.id, path);
  },
  deletePath(pathId) {
    return apiClient.delete("path/" + pathId);
  },
  getPathBySourceAndTarget(sourceId, targetId) {
    return apiClient.get(`path/source/${sourceId}/target/${targetId}`);
  },
};
