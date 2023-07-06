import apiClient from "./services";

export default {
  getEdges() {
    return apiClient.get("edge");
  },
  getEdge(id) {
    return apiClient.get("edge/" + id);
  },
  addEdge(edge) {
    return apiClient.post("edge", edge);
  },
  updateEdge(edge) {
    return apiClient.put("edge/" + edge.id, edge);
  },
  deleteEdge(edgeId) {
    return apiClient.delete("edge/" + edgeId);
  },
};
