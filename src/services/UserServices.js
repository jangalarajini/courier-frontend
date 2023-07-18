import apiClient from "./services";

export default {
  getUser() {
    return apiClient.get("users");
  },
  getClerks(){
    return apiClient.get("clerks");
  },
  getCouriers(){
    return apiClient.get("couriers");
  },
  addUser(user) {
    return apiClient.post("users", user);
  },
  updateUser(user){
    return apiClient.put("users/" + user.id, user);
  },
  deleteUser(user){
    return apiClient.delete("users/"+ user.id,user);
  },
  loginUser(user) {
    console.log(user);
    return apiClient.post("login", user.value, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        crossDomain: true,
        Authorization:
          "Basic " + btoa(user.value.email + ":" + user.value.password),
      },
    });
  },
  logoutUser() {
    return apiClient.post("logout");
  },
};
