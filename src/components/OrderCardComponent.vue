<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import CustomerServices from "../services/CustomerServices.js";


const router = useRouter();

const showDetails = ref(false);
const customers = ref([]);
const users = ref([]);
const user = ref(null);

const props = defineProps({
  order: {
    required: true,
  },
});

onMounted(async () => {
  await getCustomers();
  await getUsers();
  user.value = JSON.parse(localStorage.getItem("user"));
  if (user.value === null) {
    router.push({ name: "login" });
  }
});

async function getCustomers() {
  CustomerServices.getCustomers()
    .then((data) => {
      customers.value = data.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getUsers() {
  UserServices.getUser()
    .then((data) => {
      users.value = data.data;
    })
    .catch((error) => {
      console.log(error);
    });
}
</script>

<template>
  <v-card class="rounded-lg elevation-5 mb-8" @click="showDetails = !showDetails">
    <v-card-title class="headline">
      <v-row align="center">
        <v-col cols="10">
          <v-chip class="ma-2" color="green" label>
            <v-icon start icon="mdi-ray-start-arrow"></v-icon>
            {{ order.pickUpCustomer.name }}
          </v-chip>
          <v-chip append-icon="mdi-ray-end-arrow" class="ma-2" color="accent" label>
            {{ order.dropOffCustomer.name }}
          </v-chip>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-icon size="small" icon="mdi-pencil" @click="navigateToEdit()"></v-icon>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="body-1">
      Status : {{ order.status }}
    </v-card-text>
    <v-expand-transition>
      <v-card-text class="pt-0" v-show="showDetails">
        <h3>Order Details</h3>
        <v-card-text class="body-1"> Bill Amount: $ {{ order && order.bill && order.bill !== null ? order.bill :
          'null' }}</v-card-text>
        <v-card-text class="body-1"> Requested PickUp Time: {{ order && order.requestedPickUpTime !== null ?
          order.requestedPickUpTime :
          'Not Requested' }}</v-card-text>
<v-card-text class="body-1"> Total Distance: {{ order?.officeToPickUpCustomerPath?.cost + order?.pickUpCustomerToDropOffCustomerPath?.cost + order?.dropOffCustomerToOfficePath?.cost !== null ?
  order?.officeToPickUpCustomerPath?.cost + order?.pickUpCustomerToDropOffCustomerPath?.cost + order?.dropOffCustomerToOfficePath?.cost :
  '' }} miles</v-card-text>

        <v-card-text class="body-1"> Estimated Start Time: {{ order && order.estimatedStartTime !== null ?
          order.estimatedStartTime : 'null'
        }}</v-card-text>
        <v-card-text class="body-1"> Estimated PickUp Time: {{ order && order.estimatedPickUpTime !== null ?
          order.estimatedPickUpTime :
          'null' }}</v-card-text>
        <v-card-text class="body-1"> Estimated DropOff Time: {{ order && order.estimatedDropOffTime !== null ?
          order.estimatedDropOffTime :
          'null' }}</v-card-text>
        <v-card-text class="body-1"> Actual Start Time: {{ order && order.actualStartTime !== null ?
          order.actualStartTime : 'null'
        }}</v-card-text>
        <v-card-text class="body-1"> Actual PickUp Time: {{ order && order.actualPickUpTime !== null ?
          order.actualPickUpTime :
          'null' }}</v-card-text>
        <v-card-text class="body-1"> Actual DropOff Time: {{ order && order.actualStartTime !== null ?
          order.actualStartTime :
          'null' }}</v-card-text>
        <v-card-text class="body-1"> Courier: {{ order && order.courier && order.courier.firstName &&
          order.courier.lastName ? order.courier.firstName + ' ' + order.courier.lastName : 'null' }}</v-card-text>

      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>
