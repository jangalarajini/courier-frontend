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

//xsconst costMultipler = CompanyServices.getCustomer("1").

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
        <v-card-text class="body-1"> Bill Amount: {{ order && order.path && order.path.cost !== null ? order.path.cost :
          'null' }}</v-card-text>
        <v-card-text class="body-1"> Bonus Percentage: {{ order && order.bonus !== null ? order.bonus : 'null'
        }}</v-card-text>
        <v-card-text class="body-1"> Estimated Time: {{ order && order.estimatedTime !== null ? order.estimatedTime :
          'null' }}</v-card-text>
        <v-card-text class="body-1"> Path: {{ order && order.path && order.path.path !== null ? order.path.path.replace(",","-->") : 'null'
        }}</v-card-text>
        <v-card-text class="body-1"> Courier: {{ order && order.courier && order.courier.firstName &&
          order.courier.lastName ? order.courier.firstName + ' ' + order.courier.lastName : 'null' }}</v-card-text>

    </v-card-text>
  </v-expand-transition>
</v-card></template>
