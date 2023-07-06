import apiClient from "./services";

export default {
  getNodes() {
    return apiClient.get("node");
  },
  getNode(id) {
    return apiClient.get("node/" + id);
  },
  addNode(node) {
    return apiClient.post("node", node);
  },
  updateNode(node) {
    return apiClient.put("node/" + node.id, node);
  },
  deleteNode(nodeId) {
    return apiClient.delete("node/" + nodeId);
  },
  async getIdFromName(name) {
    try {
      const response = await apiClient.get("node", { params: { name: name } });
      const nodes = response.data;

      for (const node of nodes) {
        if (node.name === name) {
          return node.id; 
        }
      }

      return null; 
    } catch (error) {
      console.error("Error retrieving node:", error);
      return null;
    }
  }
};
