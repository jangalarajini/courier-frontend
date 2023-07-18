<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import OrderServices from "../services/OrderServices.js";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import CustomerServices from "../services/CustomerServices";
import OrderCard from "../components/OrderCardComponent.vue";


const router = useRouter();

const orders = ref([]);

const drawer = ref(false);
const companyId = 1;
const title = ref("Courier Services");
const user = ref(null);

const showingAllOrders = ref(false);
const showingOrders = ref(false);
const showingCustomers = ref(false);

async function showOrders() {
  showingOrders.value = true;
  showingCustomers.value = false;
  showingAllOrders.value = false;
  await getOrders();
  drawer.value = false;
}

async function showAllOrders() {
  showingOrders.value = false;
  showingCustomers.value = false;
  showingAllOrders.value = true;
  await getAllOrders();
  await updateAllOrdersCustomerNames();
  drawer.value = false;
}

async function showCustomers() {
  showingOrders.value = false;
  showingCustomers.value = true;
  showingAllOrders.value = false;
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
  status: "",
  companyId: companyId,
});

onMounted(async () => {
  await getCustomers();
  user.value = JSON.parse(localStorage.getItem("user"));
  if (user.value === null) {
    router.push({ name: "login" });
  } else {
    await getOrders();
    showOrders();
  }
});

const customers = ref([]);
const selectedPickUpCustomer = ref("");
const selectedDropOffCustomer = ref("");

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

async function getOrders() {
  user.value = JSON.parse(localStorage.getItem("user"));
  try {
    if (user.value !== null && user.value.id !== null) {
      const response = await OrderServices.getOrdersByUserId(user.value.id);
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



const newCustomer = ref({
  name: "",
  number: "",
  location: "",
  deliveryInstructions: "",
  companyId: companyId,
});

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
  newOrder.value.clerkId = user.value.id;
  newOrder.value.status = "In Progress";
  delete newOrder.id;
  await OrderServices.addOrder(newOrder.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Order added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getOrders();
}


function openAddCustomer() {
  isAddCustomer.value = true;
}


function openAddOrder() {
  newOrder.value.id = undefined;
  newOrder.value.quantity = undefined;
  newOrder.value.recipeStepId = undefined;
  newOrder.value.ingredientId = undefined;
  selectedDropOffCustomer.value = undefined;
  selectedPickUpCustomer.value = undefined;
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
    await updateAllOrdersCustomerNames();
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
          <v-card-text>
            <v-select v-model="selectedPickUpCustomer" :items="customers" item-title="name" item-value="id"  label="Select PickUp Customer" 
              return-object required>
            </v-select>
            <v-select v-model="selectedDropOffCustomer" :items="customers" item-title="name" item-value="id" label="Select DropOff Customer"
              return-object required>
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

      <v-snackbar v-model="snackbar.value" :color="snackbar.color" :timeout="3000">
        {{ snackbar.text }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="closeSnackBar">Close</v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>
