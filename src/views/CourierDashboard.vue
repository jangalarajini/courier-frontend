<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import OrderServices from "../services/OrderServices.js";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import OrderCard from "../components/OrderCourierCardComponent.vue";
import CompanyServices from "../services/CompanyServices.js";



const router = useRouter();

const orders = ref([]);

const drawer = ref(false);
const companyId = 1;
const title = ref("Courier Services");
const user = ref(null);
let companyName, companyAddress, costPerBlock, timePerBlock, bonusPercentage;


async function getCompanyDetails(companyId) {
  try {
    const response = await CompanyServices.getCompany(companyId);
    const companyDetails = response.data;
    companyName = companyDetails.name;
    companyAddress = companyDetails.address;
    costPerBlock = companyDetails.costPerBlock;
    timePerBlock = companyDetails.timePerBlock;
    bonusPercentage = companyDetails.bonusPercentage;
    return companyDetails;
  } catch (error) {
    console.error("Error retrieving company details:", error);
    return null;
  }
}

const showingAllOrders = ref(false);
const showingOrders = ref(false);

function isStartedButtonDisabled(order) {
  return order.status !== 'Created';
}

function isPickedUpButtonDisabled(order) {
  return order.status !== 'Pending';
}

function isDropOffButtonDisabled(order) {
  return order.status !== 'PickedUp';
}

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
  id: "",
  pickUpCustomerId: "",
  dropOffCustomerId: "",
  clerkId: "",
  courierId: "",
  status: "",
  requestedPickUpTime: "",
  estimatedPickUpTime: "",
  bill: "",
  adminId: "",
  estimatedDropOffTime: "",
  officeToPickUpCustomerPathId: "",
  pickUpCustomerToDropOffCustomerPathId: "",
  dropOffCustomerToOfficePathId: "",
  actualStartTime: " ",
  actualDropOffTime: " ",
  actualPickUpTime: " ",
  companyId: companyId,
});

onMounted(async () => {
  getCompanyDetails(companyId);
  user.value = JSON.parse(localStorage.getItem("user"));
  if (user.value === null) {
    router.push({ name: "login" });
  } else {
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

async function updateStartTime(order) {
  try {
    newOrder.value.id = order.id;
    newOrder.value.pickUpCustomerId = order.pickUpCustomerId;
    newOrder.value.dropOffCustomerId = order.dropOffCustomerId;
    newOrder.value.bill = order.bill;
    newOrder.value.estimatedStartTime = order.estimatedStartTime;
    newOrder.value.estimatedPickUpTime = order.estimatedPickUpTime;
    newOrder.value.requestedPickUpTime = order.requestedPickUpTime;
    newOrder.value.estimatedDropOffTime = order.estimatedDropOffTime;
    newOrder.value.bonus = order.bonus;
    newOrder.value.status = "Pending";
    newOrder.value.officeToPickUpCustomerPathId = order.officeToPickUpCustomerPathId;
    newOrder.value.pickUpCustomerToDropOffCustomerPathId = order.pickUpCustomerToDropOffCustomerPathId;
    newOrder.value.dropOffCustomerToOfficePathId = order.dropOffCustomerToOfficePathId;
    newOrder.value.courierId = order.courierId;
    newOrder.value.clerkId = order.clerkId;
    newOrder.value.adminId = order.adminId;
    const currentTime = new Date();
    newOrder.value.actualStartTime = addMinutesToTime(currentTime, 0);
    updateOrder();
  } catch (error) {
    console.log(error);
  }
}

async function updatePickUpTime(order) {
  try {
    newOrder.value.id = order.id;
    newOrder.value.pickUpCustomerId = order.pickUpCustomerId;
    newOrder.value.dropOffCustomerId = order.dropOffCustomerId;
    newOrder.value.bill = order.bill;
    newOrder.value.estimatedStartTime = order.estimatedStartTime;
    newOrder.value.estimatedPickUpTime = order.estimatedPickUpTime;
    newOrder.value.requestedPickUpTime = order.requestedPickUpTime;
    newOrder.value.estimatedDropOffTime = order.estimatedDropOffTime;
    newOrder.value.bonus = order.bonus;
    newOrder.value.status = "PickedUp";
    newOrder.value.officeToPickUpCustomerPathId = order.officeToPickUpCustomerPathId;
    newOrder.value.pickUpCustomerToDropOffCustomerPathId = order.pickUpCustomerToDropOffCustomerPathId;
    newOrder.value.dropOffCustomerToOfficePathId = order.dropOffCustomerToOfficePathId;
    newOrder.value.courierId = order.courierId;
    newOrder.value.clerkId = order.clerkId;
    newOrder.value.adminId = order.adminId;
    newOrder.value.actualStartTime = order.actualStartTime;
    const currentTime = new Date();
    newOrder.value.actualPickUpTime = addMinutesToTime(currentTime, 0);
    updateOrder();
  } catch (error) {
    console.log(error);
  }
}

async function updateDropOffTime(order) {
  try {
    newOrder.value.id = order.id;
    newOrder.value.pickUpCustomerId = order.pickUpCustomerId;
    newOrder.value.dropOffCustomerId = order.dropOffCustomerId;
    newOrder.value.bill = order.bill;
    newOrder.value.estimatedStartTime = order.estimatedStartTime;
    newOrder.value.estimatedPickUpTime = order.estimatedPickUpTime;
    newOrder.value.requestedPickUpTime = order.requestedPickUpTime;
    newOrder.value.estimatedDropOffTime = order.estimatedDropOffTime;
    newOrder.value.bonus = order.bonus;
    newOrder.value.status = "Delivered";
    newOrder.value.officeToPickUpCustomerPathId = order.officeToPickUpCustomerPathId;
    newOrder.value.pickUpCustomerToDropOffCustomerPathId = order.pickUpCustomerToDropOffCustomerPathId;
    newOrder.value.dropOffCustomerToOfficePathId = order.dropOffCustomerToOfficePathId;
    newOrder.value.courierId = order.courierId;
    newOrder.value.clerkId = order.clerkId;
    newOrder.value.adminId = order.adminId;
    newOrder.value.actualStartTime = order.actualStartTime;
    newOrder.value.actualPickUpTime = order.actualPickUpTime;
    const currentTime = new Date();
    newOrder.value.actualDropOffTime = addMinutesToTime(currentTime, 0);
    const dropOffTime = convertTo24HourFormat(newOrder.value.actualDropOffTime);
    const estimatedDropOffTime = convertTo24HourFormat(newOrder.value.estimatedDropOffTime);
    if (isTimeEarlier(dropOffTime, estimatedDropOffTime))
      newOrder.value.bonus = (bonusPercentage * newOrder.value.bill) / 100;
    else
      newOrder.value.bonus = 0;
    updateOrder();
  } catch (error) {
    console.log(error);
  }
}

function isTimeEarlier(time1, time2) {
  const date1 = new Date(`1970-01-01T${time1}`);
  const date2 = new Date(`1970-01-01T${time2}`);
  return date1 < date2;
}

function convertTo24HourFormat(time12Hour) {
  const [time, period] = time12Hour.split(" ");
  const [hours, minutes, seconds] = time.split(":").map(Number);

  let hours24Format = hours;
  if (period === "PM" && hours !== 12) {
    hours24Format += 12;
  } else if (period === "AM" && hours === 12) {
    hours24Format = 0;
  }

  return `${String(hours24Format).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

async function updateOrder() {
  try {
    await OrderServices.updateOrder(newOrder.value);
    snackbar.value.value = true;
    snackbar.value.color = "success";
    snackbar.value.text = `order updated successfully!`;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
  await getOrders();
}


function addMinutesToTime(time, minutesToAdd) {
  const newTime = new Date(time);
  newTime.setMinutes(newTime.getMinutes() + minutesToAdd);
  return newTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
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
                <template v-for="order in orders" :key="order.id">
                  <v-container>
                    <v-row>
                      <v-btn variant="flat" color="teal" :disabled="isStartedButtonDisabled(order)" text
                        @click="() => updateStartTime(order)">
                        Started
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn variant="flat" color="teal" :disabled="isPickedUpButtonDisabled(order)" text
                        @click="() => updatePickUpTime(order)">
                        PickedUp
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn variant="flat" color="teal" :disabled="isDropOffButtonDisabled(order)" text
                        @click="() => updateDropOffTime(order)">
                        DropOff
                      </v-btn>
                    </v-row>
                  </v-container>
                  <v-spacer></v-spacer>
                  <OrderCard :order="order" />
                </template>
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

