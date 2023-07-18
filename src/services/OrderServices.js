import apiClient from "./services";

export default {
  getOrders() {
    return apiClient.get("orders");
  },
  getOrdersByUserId(userId) {
    return apiClient.get("orders/user/" + userId);
  },
  getOrder(id) {
    return apiClient.get("orders/" + id);
  },
  addOrder(order) {
    return apiClient.post("orders", order);
  },
  updateOrder(order) {
    return apiClient.put("orders/" + order.id, order);
  },
  deleteOrder(orderId) {
    return apiClient.delete("orders/" + orderId);
  },
};
