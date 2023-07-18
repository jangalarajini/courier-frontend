<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import CustomerServices from "../services/CustomerServices.js";
import NodeServices from "../services/NodeServices.js";
import EdgeServices from "../services/EdgeServices.js";

const router = useRouter();
const user = ref(null);
const title = ref("Courier Services");
const drawer = ref(false);
const companyId = 1;


const showingUsers = ref(false);
const showingCustomers = ref(false);
const showingClerks = ref(false);
const showingCouriers = ref(false);
const showingMap = ref(false);

async function showUsers() {
    showingUsers.value = true;
    showingCustomers.value = false;
    showingClerks.value = false;
    showingCouriers.value = false;
    showingMap.value = false;
    await getUsers();
    drawer.value = false;
}

async function showCustomers() {
    showingUsers.value = false;
    showingCustomers.value = true;
    showingClerks.value = false;
    showingCouriers.value = false;
    showingMap.value = false;
    await getCustomers();
    drawer.value = false;
}

async function showClerks() {
    showingUsers.value = false;
    showingCustomers.value = false;
    showingClerks.value = true;
    showingCouriers.value = false;
    showingMap.value = false;
    await getClerks();
    drawer.value = false;

}

async function showCouriers() {
    showingUsers.value = false;
    showingCustomers.value = false;
    showingClerks.value = false;
    showingCouriers.value = true;
    showingMap.value = false;
    await getCouriers();
    drawer.value = false;
}

async function showMap(){
    showingUsers.value = false;
    showingCustomers.value = false;
    showingClerks.value = false;
    showingCouriers.value = false;
    showingMap.value = true;
    await getNodes();
    await getEdges();
    drawer.value = false;
}

const snackbar = ref({
    value: false,
    color: "",
    text: "",
});

const userList = ref([]);
const clerks = ref([]);
const couriers = ref([]);
const nodes = ref([]);
const edges = ref([]);

async function getNodes() {
    NodeServices.getNodes()
        .then((data) => {
            nodes.value = data.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

async function getEdges() {
    EdgeServices.getEdges()
        .then((data) => {
            edges.value = data.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

async function getUsers() {
    UserServices.getUser()
        .then((data) => {
            userList.value = data.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

async function getClerks() {
    UserServices.getClerks()
        .then((data) => {
            clerks.value = data.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

async function getCouriers() {
    UserServices.getCouriers()
        .then((data) => {
            couriers.value = data.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

const customers = ref([]);

async function getCustomers() {
    CustomerServices.getCustomers()
        .then((data) => {
            customers.value = data.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

onMounted(async () => {
    user.value = JSON.parse(localStorage.getItem("user"));

    if (user.value === null) {
        router.push({ name: "login" });
    }
    else {
        await getUsers();
        showUsers();
    }
});

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

const isAddClerk = ref(false);
const isEditClerk = ref(false);
const isAddCourier = ref(false);
const isEditCourier = ref(false);
const isEditUser = ref(false);

const newClerk = ref({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    companyId: companyId,

});

const newUser = ref({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    companyId: companyId,
});

const newCourier = ref({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    companyId: companyId,
});

async function addClerk() {
    isAddClerk.value = false;
    delete newClerk.id;
    try {
        newClerk.value.role = "clerk";
        newClerk.value.password = "password";
        await UserServices.addUser(newClerk.value);
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = `${newClerk.value.lastName} added successfully!`;
    } catch (error) {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
    }
    await getClerks();
}

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

function openAddClerk() {
    isAddClerk.value = true;
}

function closeAddClerk() {
    isAddClerk.value = false;
}

function openAddCourier() {
    isAddCourier.value = true;
}

function closeAddCourier() {
    isAddCourier.value = false;
}

async function updateClerk() {
    isEditClerk.value = false;
    try {
        newClerk.value.role = "clerk";
        await UserServices.updateUser(newClerk.value);
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = `${newClerk.value.lastName} updated successfully!`;
    } catch (error) {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
    }
    await getClerks();
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

function openEditClerk(user) {
    newClerk.value.id = user.id;
    newClerk.value.firstName = user.firstName;
    newClerk.value.lastName = user.lastName;
    newClerk.value.email = user.email;
    isEditClerk.value = true;
}

function openEditUserRole(user) {
    newUser.value.id = user.id;
    newUser.value.firstName = user.firstName;
    newUser.value.email = user.email;
    newUser.value.role = user.role;
    newUser.value.lastName = user.lastName;
    newUser.value.password = user.password;
    isEditUser.value = true;
}

function openEditCourier(user) {
    newCourier.value.id = user.id;
    newCourier.value.firstName = user.firstName;
    newCourier.value.lastName = user.lastName;
    newCourier.value.email = user.email;
    isEditCourier.value = true;
}

async function deleteClerk(user) {
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
    await getClerks();
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

function closeEditClerk() {
    isEditClerk.value = false;
}

function closeEditUserRole() {
    isEditUser.value = false;
}

function closeEditCourier() {
    isEditCourier.value = false;
}

const isAddCustomer = ref(false);
const isEditCustomer = ref(false);

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

function openAddCustomer() {
    isAddCustomer.value = true;
}

function closeAddCustomer() {
    isAddCustomer.value = false;
}

function openEditCustomer(customer) {
    newCustomer.value.id = customer.id;
    newCustomer.value.name = customer.name;
    newCustomer.value.number = customer.number;
    newCustomer.value.deliveryInstructions = customer.deliveryInstructions;
    newCustomer.value.location = customer.location;
    isEditCustomer.value = true;
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

function closeEditCustomer() {
    isEditCustomer.value = false;
}

async function showProfile() {
    router.push({ name: "profile" });
}

async function updateUserEditRole() {
    isEditUser.value = false;
    try {
        newUser.value.password = "password";
        await UserServices.updateUser(newUser.value);
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = `${newUser.value.lastName} updated successfully!`;
    } catch (error) {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
    }
    await getUsers();
}

function closeSnackBar() {
    snackbar.value.value = false;
}
</script>
<template>
    <v-app-bar color="teal" prominent>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-app-bar-title>{{ title }}</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-avatar class="mr-5" @click="showProfile" v-if="user != null" color="white">{{ user.firstName[0].toUpperCase() +
            user.lastName[0].toUpperCase() }}</v-avatar>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" location="left" temporary>
        <v-list>
            <v-list-item prepend-icon="mdi-account" v-if="user" :title="user.firstName + ' ' + user.lastName"></v-list-item>
            <v-list-item prepend-icon="mdi-account-details" @click="showUsers()" title="Users"></v-list-item>
            <v-list-item prepend-icon="mdi-account-group" @click="showCustomers()" title="Customers"></v-list-item>
            <v-list-item prepend-icon="mdi-face-agent" @click="showClerks()" title="Clerks"></v-list-item>
            <v-list-item prepend-icon="mdi-bike" @click="showCouriers()" title="Couriers"></v-list-item>
            <v-list-item prepend-icon="mdi-map" @click="showMap()" title="MapDetails"></v-list-item>
            <v-list-item style="color: red;" @click="logout()" prepend-icon="mdi-logout-variant"
                title="Logout"></v-list-item>
        </v-list>
    </v-navigation-drawer>

    <template v-if="showingUsers">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card-title class="mx-10 my-3 py-3">
                        <v-row>
                            <h2>Users</h2>
                            <v-spacer></v-spacer>
                        </v-row>
                    </v-card-title>
                    <v-card v-if="userList.length > 0" class="rounded-lg elevation-5">

                        <v-table class="rounded-lg elevation-5">
                            <thead>
                                <tr>
                                    <th class="text-left">Name</th>
                                    <th class="text-left">Eamil</th>
                                    <th class="text-left">Role</th>
                                    <th class="text-left">Edit Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in userList" :key="item.id">
                                    <td>{{ item.lastName }} {{ item.firstName }}</td>
                                    <td>{{ item.email }}</td>
                                    <td>{{ item.role }}</td>
                                    <td>
                                        <v-icon size="small" icon="mdi-pencil" @click="openEditUserRole(item)"></v-icon>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </template>

    <template v-if="showingClerks">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card-title class="mx-10 my-3 py-3">
                        <v-row>
                            <h2>Clerks</h2>
                            <v-spacer></v-spacer>
                            <v-btn variant="flat" color="teal" prepend-icon="mdi-plus" text @click="openAddClerk()">Add
                                Clerks</v-btn>
                        </v-row>
                    </v-card-title>
                    <v-card v-if="clerks.length > 0" class="rounded-lg elevation-5">

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
                                <tr v-for="item in clerks" :key="item.id">
                                    <td>{{ item.lastName }} {{ item.firstName }}</td>
                                    <td>{{ item.email }}</td>
                                    <td>
                                        <v-icon size="small" icon="mdi-pencil" @click="openEditClerk(item)"></v-icon>
                                    </td>
                                    <td>
                                        <v-icon size="small" icon="mdi-delete" @click="deleteClerk(item)"></v-icon>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card>
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

    <v-dialog persistent :model-value="isAddClerk || isEditClerk" width="500">
        <v-card class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">
                {{ isAddClerk ? "Add Clerk" : isEditClerk ? "Edit Clerk" : "" }}
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="newClerk.lastName" label="Last Name" required></v-text-field>
                <v-text-field v-model="newClerk.firstName" label="First Name" required></v-text-field>
                <v-text-field v-model="newClerk.email" label="Email" required></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="isAddClerk ? closeAddClerk() : isEditClerk ? closeEditClerk() : false">Close</v-btn>
                <v-btn variant="flat" color="teal" @click="isAddClerk ? addClerk() : isEditClerk ? updateClerk() : false">
                    {{ isAddClerk ? "Add Clerk" : isEditClerk ? "Update Clerk" : "" }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog persistent :model-value="isEditUser" width="500">
        <v-card class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">
                {{ isEditUser ? "Edit User" : "" }}
            </v-card-title>
            <v-card-text>
                <v-select v-model="newUser.role" label="Role" :items="['admin', 'courier', 'clerk']" required></v-select>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="isEditUser ? closeEditUserRole() : false">Close</v-btn>
                <v-btn variant="flat" color="teal" @click="isEditUser ? updateUserEditRole() : false">
                    {{ isEditUser ? "Update User Role" : "" }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog persistent :model-value="isAddCustomer || isEditCustomer" width="500">
        <v-card class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">
                {{ isAddCustomer ? "Add Customer" : isEditCustomer ? "Edit Customer" : "" }}
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="newCustomer.name" label="Name" required></v-text-field>
                <v-text-field v-model="newCustomer.number" label="Number" required></v-text-field>
                <v-text-field v-model="newCustomer.location" label="Location" required></v-text-field>
                <v-text-field v-model="newCustomer.deliveryInstructions" label="DeliveryInstructions"
                    required></v-text-field>
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


    <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}
        <template v-slot:actions>
            <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>
