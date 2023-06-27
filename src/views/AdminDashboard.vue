<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import CustomerServices from "../services/CustomerServices.js";

const router = useRouter();
const user = ref(null);
const title = ref("Courier Services");
const drawer = ref(false);


const showingUsers = ref(false);
const showingCustomers = ref(false);
const showingClerks = ref(false);
const showingCourierBoys = ref(false);

async function showUsers() {
    showingUsers.value = true;
    showingCustomers.value = false;
    showingClerks.value = false;
    showingCourierBoys.value = false;
    await getUsers();
    drawer.value = false;
}

async function showCustomers() {
    showingUsers.value = false;
    showingCustomers.value = true;
    showingClerks.value = false;
    showingCourierBoys.value = false;
    await getCustomers();
    drawer.value = false;
}

async function showClerks() {
    showingUsers.value = false;
    showingCustomers.value = false;
    showingClerks.value = true;
    showingCourierBoys.value = false;
    await getClerks();
    drawer.value = false;

}

async function showCourierBoys() {
    showingUsers.value = false;
    showingCustomers.value = false;
    showingClerks.value = false;
    showingCourierBoys.value = true;
    await getCourierBoys();
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

async function getCourierBoys() {
    UserServices.getCourierBoys()
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
const isAddCourierBoy = ref(false);
const isEditCourierBoy = ref(false);
const isEditUser = ref(false);

const newClerk = ref({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
});

const newUser = ref({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
});

const newCourierBoy = ref({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
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

async function addCourierBoy() {
    isAddCourierBoy.value = false;
    delete newCourierBoy.id;
    try {
        newCourierBoy.value.role = "courierboy";
        newCourierBoy.value.password = "password";
        await UserServices.addUser(newCourierBoy.value);
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = `${newCourierBoy.value.lastName} added successfully!`;
    } catch (error) {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
    }
    await getCourierBoys();
}

function openAddClerk() {
    isAddClerk.value = true;
}

function closeAddClerk() {
    isAddClerk.value = false;
}

function openAddCourierBoy() {
    isAddCourierBoy.value = true;
}

function closeAddCourierBoy() {
    isAddCourierBoy.value = false;
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

async function updateCourierBoy() {
    isEditCourierBoy.value = false;
    try {
        newCourierBoy.value.role = "courierboy";
        await UserServices.updateUser(newCourierBoy.value);
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = `${newCourierBoy.value.lastName} updated successfully!`;
    } catch (error) {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
    }
    await getCourierBoys();
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
    newUser.value.firstName = user.firstname;
    newUser.value.lastName = user.lastName;
    newUser.value.password = user.password;
    newUser.value.email = user.email;
    newUser.value.role = user.role;
    isEditUser.value = true;
}

function openEditCourierBoy(user) {
    newCourierBoy.value.id = user.id;
    newCourierBoy.value.firstName = user.firstName;
    newCourierBoy.value.lastName = user.lastName;
    newCourierBoy.value.email = user.email;
    isEditCourierBoy.value = true;
}

async function deleteUser(user) {

    if (confirm("Are you sure you want to delete customer") === true) {
        try {
            await UserServices.deleteUser(user.id);
            snackbar.value.value = true;
            snackbar.value.color = "success";
            snackbar.value.text = `${user.name} deleted successfully!`;
        } catch (error) {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        }
    }
}

async function deleteClerk(user) {
    deleteUser(user)
    await getClerks();
}

async function deleteCourierBoys(user) {
    deleteUser(user)
    await getCourierBoys();
}

function closeEditClerk() {
    isEditClerk.value = false;
}

function closeEditUserRole() {
    isEditUser.value = false;
}



function closeEditCourierBoy() {
    isEditCourierBoy.value = false;
}

const isAddCustomer = ref(false);
const isEditCustomer = ref(false);

const newCustomer = ref({
    customerName: "",
    customerNumber: "",
    location: "",
    deliveryInstructions: "",
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
    newCustomer.value.customerName = customer.customerName;
    newCustomer.value.customerNumber = customer.customerNumber;
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
            snackbar.value.text = `${customer.customerName} deleted successfully!`;
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
        snackbar.value.text = `${newCustomer.value.customerName} updated successfully!`;
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

async function updateUserEditRole()
{
    isEditUser.value = false;
    try {
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
            <v-list-item prepend-icon="mdi-bike" @click ="showCourierBoys() " title="CourierBoys"></v-list-item>
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
                                    <td>{{ item.lastName }} {{item.firstName }}</td>
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
                                    <td>{{ item.lastName }}  {{item.firstName }}</td>
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

    <template v-if="showingCourierBoys">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card-title class="mx-10 my-3 py-3">
                        <v-row>
                            <h2>Courier Boys</h2>
                            <v-spacer></v-spacer>
                            <v-btn variant="flat" color="teal" prepend-icon="mdi-plus" text @click="openAddCourierBoy()">Add
                                Courier Boy</v-btn>
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
                                    <td>{{ item.lastName }} {{item.firstName }}</td>
                                    <td>{{ item.email }}</td>
                                    <td>
                                        <v-icon size="small" icon="mdi-pencil" @click="openEditCourierBoy(item)"></v-icon>
                                    </td>
                                    <td>
                                        <v-icon size="small" icon="mdi-delete" @click="deleteCourierBoys(item)"></v-icon>
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
                                    <td>{{ item.customerName }}</td>
                                    <td>{{ item.customerNumber }}</td>
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

    <v-dialog persistent :model-value="isAddCourierBoy || isEditCourierBoy" width="500">
        <v-card class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">
                {{ isAddCourierBoy ? "Add CourierBoy" : isEditCourierBoy ? "Edit CourierBoy" : "" }}
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="newCourierBoy.lastName" label="LastName" required></v-text-field>
                <v-text-field v-model="newCourierBoy.firstName" label="FirstName" required></v-text-field>
                <v-text-field v-model="newCourierBoy.email" label="Eamil" required></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text
                    @click="isAddCourierBoy ? closeAddCourierBoy() : isEditCourierBoy ? closeEditCourierBoy() : false">Close</v-btn>
                <v-btn variant="flat" color="teal"
                    @click="isAddCourierBoy ? addCourierBoy() : isEditCourierBoy ? updateCourierBoy() : false">
                    {{ isAddCourierBoy ? "Add CourierBoy" : isEditCourierBoy ? "Update CourierBoy" : "" }}
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
                <v-btn text
                    @click="isAddClerk ? closeAddClerk() : isEditClerk ? closeEditClerk() : false">Close</v-btn>
                <v-btn variant="flat" color="teal"
                    @click="isAddClerk ? addClerk() : isEditClerk ? updateClerk() : false">
                    {{ isAddClerk ? "Add Clerk" : isEditClerk ? "Update Clerk" : "" }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog persistent :model-value="isEditUser" width="500">
        <v-card class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">
                {{ isEditUser ? "Edit Clerk" : "" }}
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="newUser.role" label="Role" required></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text
                    @click="isEditUser ? closeEditUserRole() : false">Close</v-btn>
                <v-btn variant="flat" color="teal"
                    @click="isEditUser? updateUserEditRole() : false">
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
                <v-text-field v-model="newCustomer.customerName" label="Name" required></v-text-field>
                <v-text-field v-model="newCustomer.customerNumber" label="Number" required></v-text-field>
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
