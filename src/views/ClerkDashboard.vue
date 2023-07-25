<script setup>
import { computed, onMounted } from "vue";
import { ref } from "vue";
import OrderServices from "../services/OrderServices.js";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import CustomerServices from "../services/CustomerServices.js";
import CompanyServices from "../services/CompanyServices.js";
import OrderCard from "../components/OrderCardComponent.vue";
import NodeServices from "../services/NodeServices.js";
import PathServices from "../services/PathServices.js";



const router = useRouter();

const orders = ref([]);

const drawer = ref(false);
const companyId = 1;
const title = ref("Courier Services");
const user = ref(null);

const showingAllOrders = ref(false);
const showingOrders = ref(false);
const showingCustomers = ref(false);
const showingCouriers = ref(false);

async function showCouriers() {
  showingOrders.value = false;
  showingCustomers.value = false;
  showingAllOrders.value = false;
  showingCouriers.value = true;
  await getCouriers();
  drawer.value = false;
}

async function showOrders() {
  showingOrders.value = true;
  showingCustomers.value = false;
  showingAllOrders.value = false;
  showingCouriers.value = false;
  await getOrders();
  drawer.value = false;
}

async function showAllOrders() {
  showingOrders.value = false;
  showingCustomers.value = false;
  showingAllOrders.value = true;
  showingCouriers.value = false;
  await getAllOrders();
  drawer.value = false;
}

async function showCustomers() {
  showingOrders.value = false;
  showingCustomers.value = true;
  showingAllOrders.value = false;
  showingCouriers.value = false;
  await getCustomers();
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
  await getCustomers();
  await getCouriers();
  await getCompanyDetails(1);
  await getPaths();
  user.value = JSON.parse(localStorage.getItem("user"));
  if (user.value === null) {
    router.push({ name: "login" });
  } else {
    await getOrders();
    showOrders();
  }
});

const customers = ref([]);
const paths = ref([]);
const couriers = ref([]);
const selectedPickUpCustomer = ref("");
const selectedCourier = ref("");
const selectedDropOffCustomer = ref("");
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

async function getPathIdByNodeIds(sourceNodeId, targetNodeId) {
  try {
    const response = await PathServices.getPathBySourceAndTarget(sourceNodeId, targetNodeId);
    const pathDetails = response.data;
    const pathId = pathDetails?.id;
    return pathId;
  } catch (error) {
    console.error("Error retrieving pathId:", error);
    return null;
  }
}

async function getCustomers() {
  await CustomerServices.getCustomers()
    .then((response) => {
      customers.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function getPaths() {
  await PathServices.getPaths()
    .then((response) => {
      paths.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function getCouriers() {
  await UserServices.getCouriers()
    .then((response) => {
      couriers.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function getOrders() {
  user.value = JSON.parse(localStorage.getItem("user"));
  try {
    if (user.value !== null && user.value.id !== null) {
      const response = await OrderServices.getOrdersByClerkId(user.value.id);
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

const toggle = ref(0);

const allOrders = ref([]);

const isAddCustomer = ref(false);
const isEditCustomer = ref(false);

const isAddOrder = ref(false);
const isEditOrder = ref(false);
const isAddCourier = ref(false);
const isEditCourier = ref(false);

const newCourier = ref({
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  companyId: companyId,
});

async function addCourier() {
  isAddCourier.value = false;
  delete newCourier.id;
  try {
    newCourier.value.role = "courier";
    newCourier.value.password = "password";
    await UserServices.addUser(newCourier.value);
    snackbar.value.value = true;
    snackbar.value.color = "success";
    snackbar.value.text = `${newCourier.value.lastName} added successfully!`;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
  await getCouriers();
}


function openAddCourier() {
  isAddCourier.value = true;
}

function closeAddCourier() {
  isAddCourier.value = false;
}

async function updateCourier() {
  isEditCourier.value = false;
  try {
    newCourier.value.role = "courier";
    await UserServices.updateUser(newCourier.value);
    snackbar.value.value = true;
    snackbar.value.color = "success";
    snackbar.value.text = `${newCourier.value.lastName} updated successfully!`;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
  await getCouriers();
}

function openEditCourier(user) {
  newCourier.value.id = user.id;
  newCourier.value.firstName = user.firstName;
  newCourier.value.lastName = user.lastName;
  newCourier.value.email = user.email;
  isEditCourier.value = true;
}

async function deleteCouriers(user) {

  if (confirm("Are you sure you want to delete customer") === true) {
    try {
      await UserServices.deleteUser(user);
      snackbar.value.value = true;
      snackbar.value.color = "success";
      snackbar.value.text = `${user.lastName} deleted successfully!`;
    } catch (error) {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    }

  }
  await getCouriers();
}

const newCustomer = ref({
  name: "",
  number: "",
  location: "",
  deliveryInstructions: "",
  companyId: companyId,
});

function getPathDetails(pathId) {
  const path = paths.value.find((c) => c.id === pathId);
  if (path) {
    return path;
  } else {
    return "Path not found";
  }
}

async function addCustomer() {
  isAddCustomer.value = false;
  delete newCustomer.id;
  try {
    await CustomerServices.addCustomer(newCustomer.value);
    snackbar.value.value = true;
    snackbar.value.color = "success";
    snackbar.value.text = `${newCustomer.value.name} added successfully!`;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
  await getCustomers();
}

async function addOrder() {
  isAddOrder.value = false;
  newOrder.value.companyId = companyId;
  newOrder.value.pickUpCustomerId = selectedPickUpCustomer.value.id;
  newOrder.value.dropOffCustomerId = selectedDropOffCustomer.value.id;
  newOrder.value.courierId = selectedCourier.value.id;
  newOrder.value.clerkId = user.value.id;
  newOrder.value.status = "InProgress";
  const pickUpLocation = getCustomerLocation(newOrder.value.pickUpCustomerId);
  const dropOffLocation = getCustomerLocation(newOrder.value.dropOffCustomerId);
  const pickUpNodeId = await getNodeId(pickUpLocation);
  const dropOffNodeId = await getNodeId(dropOffLocation);
  const officeNodeId = await getNodeId(companyAddress);
  const officeToPickUpCustomerPathId = await getPathIdByNodeIds(officeNodeId, pickUpNodeId);
  const pickUpCustomerToDropOffCustomerPathId = await getPathIdByNodeIds(pickUpNodeId, dropOffNodeId);
  const dropOffCustomerToOfficePathId = await getPathIdByNodeIds(dropOffNodeId, officeNodeId);
  newOrder.value.officeToPickUpCustomerPathId = officeToPickUpCustomerPathId;
  newOrder.value.pickUpCustomerToDropOffCustomerPathId = pickUpCustomerToDropOffCustomerPathId;
  newOrder.value.dropOffCustomerToOfficePathId = dropOffCustomerToOfficePathId;
  const officeToPickUpCustomerPathDetails = getPathDetails(newOrder.value.officeToPickUpCustomerPathId);
  const pickUpCustomerToDropOffCustomerPathDetails = getPathDetails(newOrder.value.pickUpCustomerToDropOffCustomerPathId);
  const dropOffCustomerToOfficePathDetails = getPathDetails(newOrder.value.dropOffCustomerToOfficePathId);
  const billMultipler = officeToPickUpCustomerPathDetails.cost + pickUpCustomerToDropOffCustomerPathDetails.cost + dropOffCustomerToOfficePathDetails.cost;
  newOrder.value.bill = billMultipler * costPerBlock;
  const timeFromOfficeToPickUp = officeToPickUpCustomerPathDetails.cost * timePerBlock;
  const timeFromPickUpToDropOff = pickUpCustomerToDropOffCustomerPathDetails.cost * timePerBlock;
  if (!newOrder.value.requestedPickUpTime) {
    const currentTime = new Date();
    newOrder.value.estimatedStartTime = addMinutesToTime(currentTime, 5);
    newOrder.value.estimatedPickUpTime = addMinutesToTime(currentTime, timeFromOfficeToPickUp + 5);
    newOrder.value.estimatedDropOffTime = addMinutesToTime(currentTime, timeFromPickUpToDropOff + 5 + timeFromOfficeToPickUp);
  } else {
    const requestedTime = new Date(`2023-07-20T${newOrder.value.requestedPickUpTime}`);
    newOrder.value.estimatedStartTime = addMinutesToTime(requestedTime, -timeFromOfficeToPickUp - 5);
    newOrder.value.estimatedPickUpTime = addMinutesToTime(requestedTime, 0);
    newOrder.value.requestedPickUpTime = addMinutesToTime(requestedTime, 0);
    newOrder.value.estimatedDropOffTime = addMinutesToTime(requestedTime, timeFromPickUpToDropOff + 5);
  }

  delete newOrder.id;

  try {
    await OrderServices.addOrder(newOrder.value);
    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = `Order added successfully!`;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
  await getOrders();
}


async function getNodeId(location) {
  const nodeId = await NodeServices.getIdFromName(location);
  return nodeId;
}

function addMinutesToTime(time, minutesToAdd) {
  const newTime = new Date(time);
  newTime.setMinutes(newTime.getMinutes() + minutesToAdd);
  return newTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function openAddCustomer() {
  isAddCustomer.value = true;
}


function openAddOrder() {
  newOrder.value.id = undefined;
  selectedDropOffCustomer.value = undefined;
  selectedPickUpCustomer.value = undefined;
  selectedCourier.value = undefined;
  newOrder.value.requestedPickUpTime = undefined;
  newOrder.value.bill = undefined;
  newOrder.value.estimatedDropOffTime = undefined;
  newOrder.value.estimatedPickUpTime = undefined;
  newOrder.value.pickUpCustomerToDropOffCustomerPathId = undefined;
  newOrder.value.dropOffCustomerToOfficePathId = undefined;
  newOrder.value.officeToPickUpCustomerPathId = undefined;
  isAddOrder.value = true;
}

function closeAddCustomer() {
  isAddCustomer.value = false;
}

function closeAddOrder() {
  isAddOrder.value = false;
}

function openEditCustomer(customer) {
  newCustomer.value.id = customer.id;
  newCustomer.value.name = customer.name;
  newCustomer.value.number = customer.number;
  newCustomer.value.deliveryInstructions = customer.deliveryInstructions;
  newCustomer.value.location = customer.location;
  isEditCustomer.value = true;
}

function openEditOrder(order) {
  newOrder.value.id = order.id;
  newOrder.value.pickUpCustomerId = order.pickUpCustomerId;
  newOrder.value.dropOffCustomerId = order.dropOffCustomerId;
  newOrder.value.bill = order.bill;
  newOrder.value.estimatedTime = order.estimatedTime;
  newOrder.value.bonus = order.bonus;
  newOrder.value.status = order.status;
  newOrder.value.pathId = order.pathId;
  newOrder.value.courierId = order.courierId;
  isEditOrder.value = true;
}

async function deleteCustomer(customer) {

  if (confirm("Are you sure you want to delete customer") === true) {
    try {
      await CustomerServices.deleteCustomer(customer.id);
      snackbar.value.value = true;
      snackbar.value.color = "success";
      snackbar.value.text = `${customer.name} deleted successfully!`;
    } catch (error) {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    }
    await getCustomers();
  }
}

async function deleteOrder(order) {

  if (confirm("Are you sure you want to delete order") === true) {
    try {
      await OrderServices.deleteOrder(order.id);
      snackbar.value.value = true;
      snackbar.value.color = "success";
      snackbar.value.text = `${order.name} deleted successfully!`;
    } catch (error) {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    }
    await getOrders();
  }
}

async function updateCustomer() {
  isEditCustomer.value = false;
  try {
    await CustomerServices.updateCustomer(newCustomer.value);
    snackbar.value.value = true;
    snackbar.value.color = "success";
    snackbar.value.text = `${newCustomer.value.name} updated successfully!`;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
  await getCustomers();
}

async function updateOrder() {
  isEditOrder.value = false;
  try {
    await OrderServices.updateOrder(newOrder.value);
    snackbar.value.value = true;
    snackbar.value.color = "success";
    snackbar.value.text = `${newOrder.value.name} updated successfully!`;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
  await getOrders();
}

function closeEditCustomer() {
  isEditCustomer.value = false;
}

function closeEditOrder() {
  isEditOrder.value = false;
}


async function showProfile() {
  router.push({ name: "profile" });
}

function closeSnackBar() {
  snackbar.value.value = false;
}

async function getAllOrders() {
  try {
    const response = await OrderServices.getOrders();
    allOrders.value = response.data;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
}

function getCustomerLocation(customerId) {
  const customer = customers.value.find((c) => c.id === customerId);
  if (customer) {
    return customer.location;
  } else {
    return "Customer not found";
  }
}


function formatCourierName(courier) {
  return `${courier.firstName} ${courier.lastName}`;
}

const availableDropOffCustomers = computed(() => {
  // Filter out the selected pick-up customer from the drop-off customer list
  return customers.value.filter(
    (customer) => customer.id !== selectedPickUpCustomer.value?.id
  );
});

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
        <v-list-item prepend-icon="mdi-bike" @click="showCouriers()" title="Couriers"></v-list-item>
        <v-list-item prepend-icon="mdi-account-group" @click="showCustomers()" title="Customers"></v-list-item>
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
                  <h2>Orders</h2>
                  <v-spacer></v-spacer>
                  <v-btn variant="flat" color="teal" prepend-icon="mdi-plus" text @click="openAddOrder()">Add
                    Order</v-btn>
                </v-row>
              </v-card-title>
              <v-card-text v-if="orders.length > 0">
                <OrderCard v-for="order in orders" :key="order.id" :order="order" />
              </v-card-text>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <template v-if="showingCouriers">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-card-title class="mx-10 my-3 py-3">
                <v-row>
                  <h2>Couriers</h2>
                  <v-spacer></v-spacer>
                  <v-btn variant="flat" color="teal" prepend-icon="mdi-plus" text @click="openAddCourier()">Add
                    Courier </v-btn>
                </v-row>
              </v-card-title>
              <v-card v-if="couriers.length > 0" class="rounded-lg elevation-5">

                <v-table class="rounded-lg elevation-5">
                  <thead>
                    <tr>
                      <th class="text-left">Name</th>
                      <th class="text-left">Eamil</th>
                      <th class="text-left">Edit</th>
                      <th class="text-left">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in couriers" :key="item.id">
                      <td>{{ item.lastName }} {{ item.firstName }}</td>
                      <td>{{ item.email }}</td>
                      <td>
                        <v-icon size="small" icon="mdi-pencil" @click="openEditCourier(item)"></v-icon>
                      </td>
                      <td>
                        <v-icon size="small" icon="mdi-delete" @click="deleteCouriers(item)"></v-icon>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card>
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

      <template v-if="showingCustomers">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-card-title class="mx-10 my-3 py-3">
                <v-row>
                  <h2>Customers</h2>
                  <v-spacer></v-spacer>
                  <v-btn variant="flat" color="teal" prepend-icon="mdi-plus" text @click="openAddCustomer()">Add
                    Customer</v-btn>
                </v-row>
              </v-card-title>
              <v-card v-if="customers.length > 0" class="rounded-lg elevation-5">

                <v-table class="rounded-lg elevation-5">
                  <thead>
                    <tr>
                      <th class="text-left">Name</th>
                      <th class="text-left">Number</th>
                      <th class="text-left">Edit</th>
                      <th class="text-left">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in customers" :key="item.id">
                      <td>{{ item.name }}</td>
                      <td>{{ item.number }}</td>
                      <td>
                        <v-icon size="small" icon="mdi-pencil" @click="openEditCustomer(item)"></v-icon>
                      </td>
                      <td>
                        <v-icon size="small" icon="mdi-delete" @click="deleteCustomer(item)"></v-icon>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <v-dialog persistent :model-value="isAddCustomer || isEditCustomer" width="500">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">
            {{ isAddCustomer ? "Add Customer" : isEditCustomer ? "Edit Customer" : "" }}
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="newCustomer.name" label="Name" required></v-text-field>
            <v-text-field v-model="newCustomer.number" label="Number" required></v-text-field>
            <v-text-field v-model="newCustomer.location" label="Location" required></v-text-field>
            <v-text-field v-model="newCustomer.deliveryInstructions" label="DeliveryInstructions" required></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text
              @click="isAddCustomer ? closeAddCustomer() : isEditCustomer ? closeEditCustomer() : false">Close</v-btn>
            <v-btn variant="flat" color="teal"
              @click="isAddCustomer ? addCustomer() : isEditCustomer ? updateCustomer() : false">
              {{ isAddCustomer ? "Add Customer" : isEditCustomer ? "Update Customer" : "" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog persistent :model-value="isAddOrder || isEditOrder" width="500">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">
            {{ isAddOrder ? "Add Order" : isEditOrder ? "Edit Order" : "" }}
          </v-card-title>
          <v-card-title class="headline mb-2">
            <v-btn variant="flat" color="teal" prepend-icon="mdi-plus" text @click="openAddCustomer()">Add
              Customer</v-btn>
          </v-card-title>
          <v-card-text>
            <v-select v-model="selectedPickUpCustomer" :items="customers" item-title="name" item-value="id"
              label="Select PickUp Customer" return-object required>
            </v-select>
            <v-select v-model="selectedDropOffCustomer" :items="availableDropOffCustomers" item-title="name"
              item-value="id" label="Select DropOff Customer" return-object required>
            </v-select>
            <v-text-field v-model="newOrder.requestedPickUpTime" label="Requested PickUp Time" required></v-text-field>
            <v-select v-model="selectedCourier" :items="couriers" :item-title="formatCourierName" item-value="id"
              label="Select Courier" return-object required>
            </v-select>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="isAddOrder ? closeAddOrder() : isEditOrder ? closeEditOrder() : false">Close</v-btn>
            <v-btn variant="flat" color="teal" @click="isAddOrder ? addOrder() : isEditOrder ? updateOrder() : false">
              {{ isAddOrder ? "Add Order" : isEditOrder ? "Update Order" : "" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog persistent :model-value="isAddCourier || isEditCourier" width="500">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">
            {{ isAddCourier ? "Add Courier" : isEditCourier ? "Edit Courier" : "" }}
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="newCourier.lastName" label="LastName" required></v-text-field>
            <v-text-field v-model="newCourier.firstName" label="FirstName" required></v-text-field>
            <v-text-field v-model="newCourier.email" label="Eamil" required></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text
              @click="isAddCourier ? closeAddCourier() : isEditCourier ? closeEditCourier() : false">Close</v-btn>
            <v-btn variant="flat" color="teal"
              @click="isAddCourier ? addCourier() : isEditCourier ? updateCourier() : false">
              {{ isAddCourier ? "Add Courier" : isEditCourier ? "Update Courier" : "" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar.value" :color="snackbar.color" :timeout="3000">
        {{ snackbar.text }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="closeSnackBar">Close</v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>
