<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import OrderServices from "../services/OrderServices.js";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import OrderCard from "../components/OrderCourierCardComponent.vue";



const router = useRouter();

const orders = ref([]);

const drawer = ref(false);
const companyId = 1;
const title = ref("Courier Services");
const user = ref(null);

const showingAllOrders = ref(false);
const showingOrders = ref(false);

async function showOrders() {
  showingOrders.value = true;
  showingAllOrders.value = false;
  await getOrders();
  drawer.value = false;
}

async function showAllOrders() {
  showingOrders.value = false;
  showingAllOrders.value = true;
  await getAllOrders();
  drawer.value = false;
}

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const newOrder = ref({
  pickUpCustomerId: "",
  dropOffCustomerId: "",
  clerkId: "",
  courierId: "",
  status: "",
  requestedPickUpTime: "",
  estimatedPickUpTime: "",
  bill: "",
  estimatedDropOffTime: "",
  officeToPickUpCustomerPathId: "",
  pickUpCustomerToDropOffCustomerPathId: "",
  dropOffCustomerToOfficePathId: "",
  companyId: companyId,
});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  if (user.value === null) {
    router.push({ name: "login" });
  } else {
    await getOrders();
    showOrders();
  }
});

async function getOrders() {
  user.value = JSON.parse(localStorage.getItem("user"));
  try {
    if (user.value !== null && user.value.id !== null) {
      const response = await OrderServices.getOrdersByCourierIdInProgress(user.value.id);
      orders.value = response.data;
    } else {
      const response = await OrderServices.getOrders();
      orders.value = response.data;
    }
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
}

function logout() {
  UserServices.logoutUser()
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
  localStorage.removeItem("user");
  user.value = null;
  router.push({ name: "login" });
}

const allOrders = ref([]);

async function showProfile() {
  router.push({ name: "profile" });
}

function closeSnackBar() {
  snackbar.value.value = false;
}

async function getAllOrders() {
    user.value = JSON.parse(localStorage.getItem("user"));
  try {
    if (user.value !== null && user.value.id !== null) {
      const response = await OrderServices.getOrdersByCourierIdCompleted(user.value.id);
      allOrders.value = response.data;
    } else {
      const response = await OrderServices.getOrdersByCourierIdCompleted(user.value.id);
      allOrders.value = response.data;
    }
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
}
</script>

<template>
  <v-container>
    <v-app-bar color="teal" prominent>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>{{ title }}</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-avatar class="mr-5" @click="showProfile" v-if="user != null" color="white">{{ user.firstName[0].toUpperCase() +
        user.lastName[0].toUpperCase() }}
      </v-avatar>
      <v-btn color="white" @click="logout()" text>Logout</v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" location="left" temporary>
      <v-list>
        <v-list-item prepend-icon="mdi-account" v-if="user" :title="user.firstName + ' ' + user.lastName"></v-list-item>
        <v-list-item prepend-icon="mdi-account-details" @click="showOrders()" title="Orders"></v-list-item>
        <v-list-item prepend-icon="mdi-account-group" @click="showAllOrders()" title="All Orders"></v-list-item>
        <v-list-item style="color: red;" @click="logout()" prepend-icon="mdi-logout-variant" title="Logout"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <div id="body">

      <template v-if="showingOrders">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-card-title class="mx-10 my-3 py-3">
                <v-row>
                  <h2>OnGoing Order</h2>
                  <v-spacer></v-spacer>
                </v-row>
              </v-card-title>
              <v-card-text v-if="orders.length > 0">
                <OrderCard v-for="order in orders" :key="order.id" :order="order" />
              </v-card-text>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <template v-if="showingAllOrders">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-card-title class="mx-10 my-3 py-3">
                <v-row>
                  <h2>All Orders</h2>
                </v-row>
              </v-card-title>
              <v-card-text v-if="allOrders.length > 0">
                <OrderCard v-for="order in allOrders" :key="order.id" :order="order" />
              </v-card-text>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <v-snackbar v-model="snackbar.value" :color="snackbar.color" :timeout="3000">
        {{ snackbar.text }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="closeSnackBar">Close</v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>

