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
  <v-row align="center" class="d-flex align-center">
    <v-col cols="6">
      <v-chip class="ma-2" color="green" label>
        <v-icon start icon="mdi-ray-start-arrow"></v-icon>
        {{ order.pickUpCustomer.name }}
      </v-chip>
      <v-chip append-icon="mdi-ray-end-arrow" class="ma-2" color="accent" label>
        {{ order.dropOffCustomer.name }}
      </v-chip>
    </v-col>
    <v-col class="d-flex justify-end">
      <v-btn variant="flat" color="teal" text @click="updateStartTime()">Started</v-btn>
      <v-spacer></v-spacer>
      <v-btn variant="flat" color="teal" :disabled="true" text @click="updatePickUpTime()">PickedUp</v-btn>
      <v-spacer></v-spacer>
      <v-btn variant="flat" color="teal" :disabled="true" text @click="updateDropOffTime()">DropOff</v-btn>
    </v-col>
  </v-row>
</v-card-title>
    <v-card-text class="body-1">
      Status : {{ order.status }}
    </v-card-text>
    <v-expand-transition>
      <v-card-text class="pt-0" v-show="showDetails">
        <h3>Order Details</h3>
        <v-card-text class="body-1">
          <strong>Path From Office To PickUpLocation:</strong>
          <template v-if="order?.officeToPickUpCustomerPath?.path">
            <div v-for="(address, index) in order.officeToPickUpCustomerPath.path.split(',')" :key="index">
              {{ address.trim() }}
              <br v-if="index < order.officeToPickUpCustomerPath.path.split(',').length - 1">
              <v-icon v-if="index < order.officeToPickUpCustomerPath.path.split(',').length - 1">mdi-arrow-down</v-icon>
            </div>
          </template>
          <template v-else>
            Not Requested
          </template>
        </v-card-text>
        <v-card-text class="body-1">
          <strong>Path From PickUpLocation To DropOffLocation:</strong>
          <template v-if="order?.pickUpCustomerToDropOffCustomerPath?.path">
            <div v-for="(address, index) in order.pickUpCustomerToDropOffCustomerPath.path.split(',')" :key="index">
              {{ address.trim() }}
              <br v-if="index < order.pickUpCustomerToDropOffCustomerPath.path.split(',').length - 1">
              <v-icon
                v-if="index < order.pickUpCustomerToDropOffCustomerPath.path.split(',').length - 1">mdi-arrow-down</v-icon>
            </div>
          </template>
          <template v-else>
            Not Requested
          </template>
        </v-card-text>
        <v-card-text class="body-1">
          <strong>Path From DropOffLocation To Office:</strong>
          <template v-if="order?.dropOffCustomerToOfficePath?.path">
            <div v-for="(address, index) in order.dropOffCustomerToOfficePath.path.split(',')" :key="index">
              {{ address.trim() }}
              <br v-if="index < order.dropOffCustomerToOfficePath.path.split(',').length - 1">
              <v-icon v-if="index < order.dropOffCustomerToOfficePath.path.split(',').length - 1">mdi-arrow-down</v-icon>
            </div>
          </template>
          <template v-else>
            Not Requested
          </template>
        </v-card-text>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>
