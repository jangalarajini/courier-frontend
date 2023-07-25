import apiClient from "./services";

export default {
  getOrders() {
    return apiClient.get("orders");
  },
  getOrdersByClerkId(clerkId) {
    return apiClient.get("orders/clerk/" + clerkId);
  },
  getOrdersByAdminId(adminId) {
    return apiClient.get("orders/admin/" + adminId);
  },
  getOrdersByCourierIdCompleted(courierId){
    return apiClient.get(`orders/courier/${courierId}/completed`);
  },
  getOrdersByCourierIdInProgress(courierId){
    return apiClient.get(`orders/courier/${courierId}/in-progress`);
  },
  getOrdersByCustomerId(customerId){
    return apiClient.get("orders/customer/" + customerId);
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
