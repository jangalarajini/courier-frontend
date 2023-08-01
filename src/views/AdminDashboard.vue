<script setup>
import { computed, onMounted } from "vue";
import jsPDF from 'jspdf';
import "jspdf-autotable";
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import CustomerServices from "../services/CustomerServices.js";
import OrderCard from "../components/OrderCardComponent.vue";
import NodeServices from "../services/NodeServices.js";
import EdgeServices from "../services/EdgeServices.js";
import CompanyServices from "../services/CompanyServices.js";
import OrderServices from "../services/OrderServices";
import PathServices from "../services/PathServices.js";

const router = useRouter();
const user = ref(null);
const title = ref("Courier Services");
const drawer = ref(false);
const companyId = 1;
const showPlaces = ref(false);
const showPaths = ref(false);
const selectedPickUpCustomer = ref("");
const selectedFromNode = ref("");
const selectedToNode = ref("");
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

const showingCustomers = ref(false);
const showingMap = ref(false);
const showingCompanies = ref(false);
const showingOrders = ref(false);
const showingCouriersBonusPercentage = ref(false);

const companies = ref([]);
const allOrders = ref([]);

const paths = ref([]);

const orders = ref([]);

async function showOrders() {
    showingMap.value = false;
    showingUsers.value = false;
    showingCustomers.value = false;
    showingCompanies.value = false;
    showingOrders.value = true;
    showingCouriersBonusPercentage.value = false;
    await getAllOrders();
    drawer.value = false;
}

async function showCompanies() {
    showingMap.value = false;
    showingUsers.value = false;
    showingCustomers.value = false;
    showingCompanies.value = true;
    showingOrders.value = false;
    showingCouriersBonusPercentage.value = false;
    await getCompanies();
    drawer.value = false;
}

async function showCustomers() {
    showingMap.value = false;
    showingMap.value = false;
    showingUsers.value = false;
    showingCustomers.value = true;
    showingCompanies.value = false;
    showingOrders.value = false;
    showingCouriersBonusPercentage.value = false;
    await getCustomers();
    drawer.value = false;
}

async function showCouriersBonusPercentage() {
    showingMap.value = false;
    showingUsers.value = false;
    showingCustomers.value = false;
    showingCompanies.value = false;
    showingOrders.value = false;
    showingCouriersBonusPercentage.value = true;
    await getCouriers();
    drawer.value = false;
}

async function showMap() {
    showingMap.value = true;
    showingUsers.value = false;
    showingCustomers.value = false;
    showingCompanies.value = false;
    showingOrders.value = false;
    showingCouriersBonusPercentage.value = false;
    await getNodes();
    await getEdges();
    drawer.value = false;
}

async function getCompanies() {
    CompanyServices.getCompanies()
        .then((data) => {
            companies.value = data.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

const snackbar = ref({
    value: false,
    color: "",
    text: "",
});

const nodes = ref([]);
const edges = ref([]);

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

async function addNode() {
    isAddNode.value = false;
    delete newNode.id;
    try {
        await NodeServices.addNode(newNode.value);
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = `${newNode.value.name} added successfully!`;
    } catch (error) {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
    }
    await getNodes();
}

async function addEdge() {
    isAddEdge.value = false;
    delete newEdge.id;
    try {
        newEdge.value.sourceNodeId = selectedFromNode.value.id;
        newEdge.value.targetNodeId = selectedToNode.value.id;
        await EdgeServices.addEdge(newEdge.value);
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = `Edge added successfully!`;
    } catch (error) {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
    }
    await getEdges();
}

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

async function getCouriers() {
    try {
        const response = await UserServices.getCouriers();
        const data = response.data;
        data.sort((a, b) => a.order - b.order);
        couriers.value = data;
    } catch (error) {
        console.log(error);
    }
}

async function updateCouriers(selectedCourier) {
    try {
        const fetchedCouriers = await UserServices.getCouriers();
        const updatedCouriers = fetchedCouriers.data.slice();
        updatedCouriers.forEach((courier) => {
            if (courier.id !== selectedCourier.id) {
                const originalOrderValue = courier.order;
                courier.order = originalOrderValue - 1;
            }
            else if (courier.id === selectedCourier.id)
                courier.order = fetchedCouriers.data.length;
        });
        for (const courier of updatedCouriers) {
            await UserServices.updateUser(courier);
        }
        await getCouriers();
    } catch (error) {
        console.error("Error updating couriers:", error);
    }
}

function getPathDetails(pathId) {
    const path = paths.value.find((c) => c.id === pathId);
    if (path) {
        return path;
    } else {
        return "Path not found";
    }
}

const customers = ref([]);
const couriers = ref([]);

async function getCustomers() {
    CustomerServices.getCustomers()
        .then((data) => {
            customers.value = data.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

async function getNodeId(location) {
    const nodeId = await NodeServices.getIdFromName(location);
    return nodeId;
}

onMounted(async () => {
    await getCustomers();
    await getCouriers();
    // if (!isDataLoaded.value) {
    //     await updateCouriers();
    //     await getCouriers();
    //     isDataLoaded.value = true;
    // }
    await getCompanyDetails(1);
    await getPaths();
    user.value = JSON.parse(localStorage.getItem("user"));
    if (user.value === null) {
        router.push({ name: "login" });
    }
    else {
        await getCompanies();
        showCompanies();
    }
});

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
function addMinutesToTime(time, minutesToAdd) {
    const newTime = new Date(time);
    newTime.setMinutes(newTime.getMinutes() + minutesToAdd);
    return newTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

const isAddOrder = ref(false);
const isEditOrder = ref(false);
const isGenerateReport = ref(false);
const isGenerateBill = ref(false);

const newOrder = ref({
    pickUpCustomerId: "",
    dropOffCustomerId: "",
    adminId: "",
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

async function addOrder() {
    let courierToMove;
    isAddOrder.value = false;
    newOrder.value.companyId = companyId;
    newOrder.value.pickUpCustomerId = selectedPickUpCustomer.value.id;
    newOrder.value.dropOffCustomerId = selectedDropOffCustomer.value.id;
    newOrder.value.courierId = selectedCourier.value.id;
    courierToMove = selectedCourier.value;
    courierToMove.isOccupied = true;
    newOrder.value.adminId = user.value.id;
    newOrder.value.status = "Created";
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
        newOrder.value.estimatedStartTime = addMinutesToTime(requestedTime, -timeFromOfficeToPickUp);
        newOrder.value.estimatedPickUpTime = addMinutesToTime(requestedTime, 0);
        newOrder.value.requestedPickUpTime = addMinutesToTime(requestedTime, 0);
        newOrder.value.estimatedDropOffTime = addMinutesToTime(requestedTime, timeFromPickUpToDropOff);
    }

    delete newOrder.id;

    try {
        await OrderServices.addOrder(newOrder.value);
        await updateCouriers(courierToMove);
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = `Order added successfully!`;
    } catch (error) {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
    }
    await getAllOrders();
}

async function generateReport() {
    isGenerateReport.value = false;
    if (!selectedFromDate.value || !selectedToDate.value) {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Please select both From Date and To Date.";
    } else {
        let totalNoOfOrders = 0;
        const customerTotals = {};
        for (const customer of customers.value) {
            await getOrdersForCustomer(customer);
            if (customerOrders.value && customerOrders.value.length > 0) {
                const fromDate = new Date(selectedFromDate.value);
                const toDate = new Date(selectedToDate.value);

                const data = customerOrders.value.filter((order) => {
                    const orderDate = new Date(order.createdAt);
                    return orderDate >= fromDate && orderDate <= toDate;
                });

                const customerTotal = data.reduce((sum, order) => sum + order.bill, 0);
                totalNoOfOrders += data.length;
                customerTotals[customer.name] = customerTotal;
            }
        }

        const doc = new jsPDF();
        doc.text("Company Report", 10, 10);

        const columns = [
            { title: "Customer Name", dataKey: "name" },
            { title: "Total Bill", dataKey: "bill" },
        ];

        const data = Object.entries(customerTotals).map(([name, bill]) => ({ name, bill }));

        const total = data.reduce((sum, item) => sum + item.bill, 0);

        data.push({ name: "Total", bill: total });
        data.push({ name: "Total Number of Orders", bill: totalNoOfOrders });

        doc.autoTable({
            columns: columns,
            body: data,
            startY: 20,
        });

        const fileName = `${companyName}_${selectedFromDate.value}_${selectedToDate.value}.pdf`;
        doc.save(fileName);
    }
}


async function generateBill() {
    isGenerateBill.value = false;
    if (!selectedFromDate.value || !selectedToDate.value) {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Please select both From Date and To Date.";
    }
    else {
        await getOrdersForCustomer(selectedCustomer);
        if (customerOrders.value && customerOrders.value.length > 0) {
            const columns = [
                { title: "Title", dataKey: "dropOffCustomer.name" },
                { title: "Bill Amount", dataKey: "bill" },
            ];

            const doc = new jsPDF();
            doc.text("Monthly Bill", 10, 10);

            const fromDate = new Date(selectedFromDate.value);
            const toDate = new Date(selectedToDate.value);

            const data = customerOrders.value
                .filter((order) => {
                    const orderDate = new Date(order.createdAt);
                    return orderDate >= fromDate && orderDate <= toDate;
                })
                .map((order) => ({
                    "dropOffCustomer.name": order.dropOffCustomer.name,
                    "bill": order.bill,
                }));

            const total = data.reduce((sum, order) => sum + order.bill, 0);

            data.push({
                "dropOffCustomer.name": "Total",
                "bill": total,
            });

            doc.autoTable({
                columns: columns,
                body: data,
                startY: 20,
            });

            doc.save(selectedCustomer.name + "_" + selectedFromDate.value + "_" + selectedToDate.value + ".pdf");
        }
    }
}

const availableDropOffCustomers = computed(() => {
    return customers.value.filter(
        (customer) => customer.id !== selectedPickUpCustomer.value?.id
    );
});

const availableToNodes = computed(() => {
    return nodes.value.filter(
        (node) => node.id !== selectedFromNode.value?.id
    );
});

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

function closeEditOrder() {
    isEditOrder.value = false;
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
    await getAllOrders();
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
        await getAllOrders();
    }
}

function closeAddOrder() {
    isAddOrder.value = false;
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





function openGenerateReport() {
    isGenerateReport.value = true;
}

let selectedCustomer = ref(null);
function openGenerateBill(item) {
    selectedCustomer = item;
    isGenerateBill.value = true;
}


function closeGenerateReport() {
    isGenerateReport.value = false;
}


function closeGenerateBill() {
    isGenerateBill.value = false;
}

const showingUsers = ref(false);

async function showUsers() {
    showingMap.value = false;
    showingUsers.value = true;
    showingCustomers.value = false;
    showingCompanies.value = false;
    showingOrders.value = false;
    showingCouriersBonusPercentage.value = false;
    await getUsers();
    drawer.value = false;
}

const userList = ref([]);

async function getUsers() {
    UserServices.getUser()
        .then((data) => {
            userList.value = data.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

const newUser = ref({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    order: 0,
    password: "",
    companyId: companyId,
});

const isAddUser = ref(false);
const isEditUser = ref(false);


async function addUser() {
    isAddUser.value = false;
    delete newUser.id;
    try {
        if (newUser.value.firstName === "" || newUser.value.lastName === "" || newUser.value.email === "" || newUser.value.password === "") {
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = "Please fill all the fields!";
            return;
        }
        newUser.value.order = 0;
        await UserServices.addUser(newUser.value);
    } catch (error) {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
    }
    await getUsers();
}

function openAddUser() {
    isAddUser.value = true;
}

function closeAddUser() {
    isAddUser.value = false;
}

async function updateUser(selectedUser) {
    isEditUser.value = false;
    try {
        await UserServices.updateUser(selectedUser);
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = `${newUser.value.lastName} ${newUser.value.firstName} updated successfully!`;
    } catch (error) {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
    }
    await getUsers();
}

let selectedUser = ref(null);

function openEditUser(item) {
    selectedUser = item;
    isEditUser.value = true;
}

function closeEditUser() {
    isEditUser.value = false;
}



const isAddCustomer = ref(false);
const isEditCustomer = ref(false);
const isAddNode = ref(false);
const isAddEdge = ref(false);
const isEditNode = ref(false);
const isEditEdge = ref(false);
const isEditCompany = ref(false);

const newCustomer = ref({
    name: "",
    number: "",
    location: "",
    deliveryInstructions: "",
    companyId: companyId,
});

const newNode = ref({
    name: "",
    companyId: companyId,
});

const newEdge = ref({
    cost: "",
    sourcenodeid: "",
    targetnodeid: "",
    companyId: companyId,
});

const newCompany = ref({
    name: "",
    address: "",
    timePerBlock: "",
    costPerBlock: "",
    bonusPercentage: "",
});

function openAddCustomer() {
    isAddCustomer.value = true;
}

function openAddNode() {
    isAddNode.value = true;
}

function openAddEdge() {
    isAddEdge.value = true;
}

function closeAddCustomer() {
    isAddCustomer.value = false;
}

function closeAddNode() {
    isAddNode.value = false;
}

function closeAddEdge() {
    isAddEdge.value = false;
}



function openEditCustomer(customer) {
    newCustomer.value.id = customer.id;
    newCustomer.value.name = customer.name;
    newCustomer.value.number = customer.number;
    newCustomer.value.deliveryInstructions = customer.deliveryInstructions;
    newCustomer.value.location = customer.location;
    isEditCustomer.value = true;
}

function openEditNode(node) {
    newNode.value.id = node.id;
    newNode.value.name = node.name;
    isEditNode.value = true;
}


function openEditEdge(edge) {
    newEdge.value.id = edge.id;
    newEdge.value.cost = edge.cost;
    newEdge.value.sourceNodeId = edge.sourceNodeId;
    newEdge.value.targetNodeId = edge.targetNodeId;
    isEditEdge.value = true;
}


function openEditCompany(company) {
    newCompany.value.id = company.id;
    newCompany.value.name = company.name;
    newCompany.value.address = company.address;
    newCompany.value.timePerBlock = company.timePerBlock;
    newCompany.value.costPerBlock = company.costPerBlock;
    newCompany.value.bonusPercentage = company.bonusPercentage;
    isEditCompany.value = true;
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

async function deleteUser(user) {

    if (confirm("Are you sure you want to delete user") === true) {
        try {
            await UserServices.deleteUser(user);
            snackbar.value.value = true;
            snackbar.value.color = "success";
            snackbar.value.text = `${user.firstName} deleted successfully!`;
        } catch (error) {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        }
        await getUsers();
    }
}



async function deleteNode(node) {

    if (confirm("Are you sure you want to delete node") === true) {
        try {
            await NodeServices.deleteNode(node.id);
            snackbar.value.value = true;
            snackbar.value.color = "success";
            snackbar.value.text = `${node.name} deleted successfully!`;
        } catch (error) {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        }
        await getNodes();
    }
}

async function deleteEdge(edge) {

    if (confirm("Are you sure you want to delete edge") === true) {
        try {
            await EdgeServices.deleteEdge(edge.id);
            snackbar.value.value = true;
            snackbar.value.color = "success";
            snackbar.value.text = `Edge deleted successfully!`;
        } catch (error) {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        }
        await getEdges();
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

async function updateNode() {
    isEditNode.value = false;
    try {
        await NodeServices.updateNode(newNode.value);
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = `${newNode.value.name} updated successfully!`;
    } catch (error) {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
    }
    await getNodes();
}

async function updateEdge() {
    isEditEdge.value = false;
    try {
        await EdgeServices.updateEdge(newEdge.value);
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = `${newEdge.value.name} updated successfully!`;
    } catch (error) {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
    }
    await getEdges();
}

async function updateCompany() {
    isEditCompany.value = false;
    try {
        await CompanyServices.updateCompany(newCompany.value);
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = `${newCompany.value.name} updated successfully!`;
    } catch (error) {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
    }
    await getCompanies();
}

function closeEditCustomer() {
    isEditCustomer.value = false;
}

function closeEditNode() {
    isEditNode.value = false;
}

function closeEditEdge() {
    isEditEdge.value = false;
}

function closeEditCompany() {
    isEditCompany.value = false;
}

async function showProfile() {
    router.push({ name: "profile" });
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

function closeSnackBar() {
    snackbar.value.value = false;
}

const selectedFromDate = ref(null);
const selectedToDate = ref(null);
const customerOrders = ref([]);
const courierOrders = ref([]);

async function getOrdersForCustomer(customer) {
    try {
        if (customer !== null && customer.id !== null) {
            const response = await OrderServices.getOrdersByCustomerId(customer.id);
            customerOrders.value = response.data;
        }
    } catch (error) {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
    }
}

async function getOrdersForCouriers(courier) {
    try {
        if (courier !== null && courier.id !== null) {
            const response = await OrderServices.getOrdersByCourierIdCompleted(courier.id);
            courierOrders.value = response.data;
        }
    } catch (error) {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
    }
}

async function downloadBonus(courier) {

    if (!selectedFromDate.value || !selectedToDate.value) {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Please select both From Date and To Date.";
    }
    else {
        await getOrdersForCouriers(courier);

        if (courierOrders.value && courierOrders.value.length > 0) {
            const columns = [
                { title: "PickUpCustomer", dataKey: "pickUpCustomer.name" },
                { title: "DropOffCustomer", dataKey: "dropOffCustomer.name" },
                { title: "Bonus Amount", dataKey: "bonus" },
            ];

            const doc = new jsPDF();
            doc.text("Monthly Bonus", 10, 10);

            const fromDate = new Date(selectedFromDate.value);
            const toDate = new Date(selectedToDate.value);

            const data = courierOrders.value
                .filter((order) => {
                    const orderDate = new Date(order.createdAt);
                    return orderDate >= fromDate && orderDate <= toDate;
                })
                .map((order) => ({
                    "pickUpCustomer.name": order.pickUpCustomer.name,
                    "dropOffCustomer.name": order.dropOffCustomer.name,
                    "bonus": order.bonus,
                }));

            const total = data.reduce((sum, order) => sum + order.bonus, 0);

            data.push({
                "pickUpCustomer.nam": "",
                "dropOffCustomer.name": "Total",
                "bonus": total,
            });

            doc.autoTable({
                columns: columns,
                body: data,
                startY: 20,
            });

            doc.save(courier.firstName + courier.lastName + "_" + selectedFromDate.value + "_" + selectedToDate.value + ".pdf");
        }
        else {
            snackbar.value.value = true;
            snackbar.value.color = "success";
            snackbar.value.text = `No Orders For this Courier`;
        }
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generatePaths() {
    try {
        await PathServices.deleteAllPaths();

        const nodeList = ref([]);
        async function getNodes() {
            try {
                const data = await NodeServices.getNodes();
                nodeList.value = data.data;
            } catch (error) {
                console.log(error);
            }
        }

        const edgeList = ref([]);
        async function getEdges() {
            try {
                const data = await EdgeServices.getEdges();
                edgeList.value = data.data;
            } catch (error) {
                console.log(error);
            }
        }

        const graph = {};
        await getNodes();

        nodeList.value.forEach((node) => {
            graph[node.name] = {};
        });

        await getEdges();

        edgeList.value.forEach((edge) => {
            const sourceNode = nodeList.value.find((node) => node.id === edge.sourceNodeId);
            const targetNode = nodeList.value.find((node) => node.id === edge.targetNodeId);

            if (sourceNode && targetNode) {
                graph[sourceNode.name][targetNode.name] = edge.cost;
            }
        });

        await wait(1000);

        const result = dijkstra(graph);
        const allDistances = result.allDistances;
        const allParents = result.allParents;

        for (let sourceVertex in allDistances) {
            const distances = allDistances[sourceVertex];
            const parents = allParents[sourceVertex];
            for (let vertex in distances) {
                let sourceid = null;
                let targetid = null;
                const sourceIdPromise = NodeServices.getIdFromName(sourceVertex);
                const targetIdPromise = NodeServices.getIdFromName(vertex);
                const path = getPath(parents, vertex);
                const cost = distances[vertex];

                const sourceId = await sourceIdPromise;
                const targetId = await targetIdPromise;

                sourceid = sourceId;
                targetid = targetId;

                await PathServices.addPath({
                    path: path,
                    cost: cost,
                    sourceid: sourceid,
                    targetid: targetid,
                    companyId: 1,
                });
            }
        }
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = `All Paths Regenerated`;
    } catch (error) {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
    }


}

function getPath(parents, destination) {
    const path = [];
    let currentVertex = destination;
    while (currentVertex !== null) {
        path.unshift(currentVertex);
        currentVertex = parents[currentVertex];
    }
    return path.toString();
}

function dijkstra(graph) {
    const vertices = Object.keys(graph);
    const allDistances = {};
    const allParents = {};

    for (let i = 0; i < vertices.length; i++) {
        const sourceVertex = vertices[i];
        const distances = {};
        const parents = {};
        const visited = new Set();

        for (let j = 0; j < vertices.length; j++) {
            const vertex = vertices[j];
            if (vertex === sourceVertex) {
                distances[vertex] = 0;
            } else {
                distances[vertex] = Infinity;
            }
            parents[vertex] = null;
        }

        function vertexWithMinDistance(distances, visited) {
            let minDistance = Infinity;
            let minVertex = null;
            for (let vertex in distances) {
                if (!visited.has(vertex) && distances[vertex] < minDistance) {
                    minDistance = distances[vertex];
                    minVertex = vertex;
                }
            }
            return minVertex;
        }

        let currentVertex = vertexWithMinDistance(distances, visited);

        while (currentVertex !== null) {
            const distance = distances[currentVertex];
            const neighbors = graph[currentVertex];

            for (let neighbor in neighbors) {
                const edgeWeight = neighbors[neighbor];
                const newDistance = distance + edgeWeight;

                if (distances[neighbor] > newDistance) {
                    distances[neighbor] = newDistance;
                    parents[neighbor] = currentVertex;
                }
            }

            visited.add(currentVertex);
            currentVertex = vertexWithMinDistance(distances, visited);
        }

        allDistances[sourceVertex] = distances;
        allParents[sourceVertex] = parents;
    }
    return { allDistances, allParents };
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
            <v-list-item prepend-icon="mdi-account-details" @click="showCompanies()" title="Company Info"></v-list-item>
            <v-list-item prepend-icon="mdi-account-details" @click="showUsers()" title="Users"></v-list-item>
            <v-list-item prepend-icon="mdi-account-details" @click="showOrders()" title="Orders"></v-list-item>
            <v-list-item prepend-icon="mdi-account-group" @click="showCustomers()" title="Customers"></v-list-item>
            <v-list-item prepend-icon="mdi-map" @click="showMap()" title="Map Details"></v-list-item>
            <v-list-item prepend-icon="mdi-map" @click="showCouriersBonusPercentage()" title="Courier Bonus"></v-list-item>
            <v-list-item style="color: red;" @click="logout()" prepend-icon="mdi-logout-variant"
                title="Logout"></v-list-item>
        </v-list>
    </v-navigation-drawer>

    <template v-if="showingCompanies">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card-title class="mx-10 my-3 py-3">
                        <v-row>
                            <h2>Company Info</h2>
                            <v-spacer></v-spacer>
                            <v-btn variant="flat" color="teal" text @click="openGenerateReport()">Generate Report</v-btn>
                        </v-row>
                    </v-card-title>
                    <v-card class="rounded-lg elevation-5 mb-8" v-for="company in companies" :key="company.id">
                        <v-card-title class="headline">
                            <v-row align="center">
                                <v-col cols="10">
                                    <v-chip class="ma-2" color="green" label>
                                        {{ company.name }}
                                    </v-chip>
                                </v-col>
                                <v-col class="d-flex justify-end">
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-icon size="small" icon="mdi-pencil" @click="openEditCompany(company)"></v-icon>
                                    </v-card-actions>
                                </v-col>
                            </v-row>
                        </v-card-title>
                        <v-card-text class="body-1">
                            <strong>Location:</strong> {{ company.address }} <br>
                            <strong>Cost Per Block:</strong> $ {{ company.costPerBlock }}<br>
                            <strong>Time Per Block:</strong> {{ company.timePerBlock }} minutes<br>
                            <strong>Bonus Percentage:</strong> {{ company.bonusPercentage }} %
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </template>

    <template v-if="showingUsers">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card-title class="mx-10 my-3 py-3">
                        <v-row>
                            <h2>Users</h2>
                            <v-spacer></v-spacer>
                            <v-btn variant="flat" color="teal" prepend-icon="mdi-plus" text @click="openAddUser()">Add
                                User</v-btn>
                        </v-row>
                    </v-card-title>
                    <v-card v-if="userList.length > 0" class="rounded-lg elevation-5">
                        <v-table class="rounded-lg elevation-5">
                            <thead>
                                <tr>
                                    <th class="text-left">Name</th>
                                    <th class="text-left">Eamil</th>
                                    <th class="text-left">Role</th>
                                    <th class="text-left">Edit</th>
                                    <th class="text-left">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in userList" :key="item.id">
                                    <td>{{ item.lastName }} {{ item.firstName }}</td>
                                    <td>{{ item.email }}</td>
                                    <td>{{ item.role }}</td>
                                    <td>
                                        <v-icon size="small" icon="mdi-pencil" @click="openEditUser(item)"></v-icon>
                                    </td>
                                    <td>
                                        <v-icon size="small" icon="mdi-delete" @click="deleteUser(item)"></v-icon>
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
                                    <th class="text-left">Download Bill</th>
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
                                    <td>
                                        <v-btn icon size="large" @click="openGenerateBill(item)" variant="text">
                                            <v-icon>
                                                mdi-download
                                            </v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </template>

    <template v-if="showingMap">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card-text>
                        <v-row>
                            <h1>Map Details</h1>
                            <v-spacer></v-spacer>
                            <v-btn variant="flat" color="teal" text @click="generatePaths()">Generate Paths</v-btn>
                        </v-row>
                    </v-card-text>
                </v-col>
            </v-row>
        </v-container>

        <v-container>
            <div class="d-flex align-center flex-column">
                <v-card class="rounded-lg elevation-5 mb-8" width="1200" @click="showPlaces = !showPlaces">
                    <v-row align="center">
                        <v-col cols="10">
                            <v-card-title class="headline">
                                <h3>Places</h3>
                            </v-card-title>
                            <v-card-text class="body-1">
                                Click To See All Places
                            </v-card-text>
                        </v-col>
                        <v-col cols="2">
                            <v-btn variant="flat" color="teal" text @click="openAddNode()">Add Place</v-btn>
                        </v-col>
                    </v-row>
                    <v-expand-transition>
                        <v-card-text class="pt-0" v-if="nodes.length > 0" v-show="showPlaces">
                            <v-table>
                                <thead>
                                    <tr>
                                        <th class="text-left">Place Name</th>
                                        <th class="text-left">Edit</th>
                                        <th class="text-left">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in nodes" :key="item.id">
                                        <td>{{ item.name }}</td>
                                        <td>
                                            <v-icon size="small" icon="mdi-pencil" @click="openEditNode(item)"></v-icon>
                                        </td>
                                        <td>
                                            <v-icon size="small" icon="mdi-delete" @click="deleteNode(item)"></v-icon>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-card-text>
                    </v-expand-transition>
                </v-card>
            </div>
        </v-container>

        <v-container>
            <div class="d-flex align-center flex-column">
                <v-card class="rounded-lg elevation-5 mb-8" width="1200" @click="showPaths = !showPaths">
                    <v-row align="center">
                        <v-col cols="10">
                            <v-card-title class="headline">
                                <h3>Paths</h3>
                            </v-card-title>
                            <v-card-text class="body-1">
                                Click To See All Paths
                            </v-card-text>
                        </v-col>
                        <v-col cols="2">
                            <v-btn variant="flat" color="teal" text @click="openAddEdge()">Add Path</v-btn>
                        </v-col>
                    </v-row>
                    <v-expand-transition>
                        <v-card-text class="pt-0" v-if="edges.length > 0" v-show="showPaths">
                            <v-table>
                                <thead>
                                    <tr>
                                        <th class="text-left">From Place To To Place</th>
                                        <th class="text-left">Distance</th>
                                        <th class="text-left">Edit</th>
                                        <th class="text-left">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in edges" :key="item.id">
                                        <td><strong>{{ item.sourceNode.name }}</strong> To <strong>{{ item.targetNode.name
                                        }}</strong></td>
                                        <td>{{ item.cost }} mile</td>
                                        <td>
                                            <v-icon size="small" icon="mdi-pencil" @click="openEditEdge(item)"></v-icon>
                                        </td>
                                        <td>
                                            <v-icon size="small" icon="mdi-delete" @click="deleteEdge(item)"></v-icon>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-card-text>
                    </v-expand-transition>
                </v-card>
            </div>
        </v-container>
    </template>

    <template v-if="showingOrders">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card-title class="mx-10 my-3 py-3">
                        <v-row>
                            <h2>Orders</h2>
                            <v-spacer></v-spacer>
                            <v-btn variant="flat" color="teal" prepend-icon="mdi-plus" text @click="openAddOrder()">
                                Add Order
                            </v-btn>
                        </v-row>
                    </v-card-title>
                    <v-card-text v-if="allOrders.length > 0">
                        <template v-for="order in allOrders" :key="order.id">
                            <v-row>
                                <v-col cols="12">
                                    <div style="display: grid; grid-template-columns: 1fr auto; align-items: center;">
                                        <OrderCard :order="order" />
                                        <v-container class="rounded-lg elevation-0 mb-8" v-if="order.status === 'Created'"
                                            style="display: flex; justify-content: flex-end;">
                                            <v-btn icon size="x-large" @click="deleteOrder(order)" variant="text">
                                                <v-icon>
                                                    mdi-delete
                                                </v-icon>
                                            </v-btn>
                                        </v-container>
                                    </div>
                                </v-col>
                            </v-row>
                        </template>
                    </v-card-text>
                </v-col>
            </v-row>
        </v-container>
    </template>

    <template v-if="showingCouriersBonusPercentage">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card-title class="mx-10 my-3 py-3">
                        <v-row>
                            <h2>Couriers</h2>
                            <v-spacer></v-spacer>
                            <v-container>
                                <v-row>
                                    <v-col cols="6">
                                        <v-text-field v-model="selectedFromDate" label="From Date"
                                            type="date"></v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field v-model="selectedToDate" label="To Date" type="date"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-row>
                    </v-card-title>
                    <v-card v-if="couriers.length > 0" class="rounded-lg elevation-5">

                        <v-table class="rounded-lg elevation-5">
                            <thead>
                                <tr>
                                    <th class="text-left">FirstName</th>
                                    <th class="text-left">LastName</th>
                                    <th class="text-left">Download Bill</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in couriers" :key="item.id">
                                    <td>{{ item.firstName }}</td>
                                    <td>{{ item.lastName }}</td>
                                    <td>
                                        <v-btn icon size="large" @click="downloadBonus(item)" variant="text">
                                            <v-icon>
                                                mdi-download
                                            </v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </template>

    <v-dialog persistent v-model="isAddUser" width="800">
        <v-card class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">Create Account </v-card-title>
            <v-card-text>
                <v-text-field v-model="newUser.firstName" label="First Name" required></v-text-field>
                <v-text-field v-model="newUser.lastName" label="Last Name" required></v-text-field>
                <v-text-field v-model="newUser.email" label="Email" required></v-text-field>
                <v-text-field v-model="newUser.password" label="Password" type="password" required></v-text-field>
                <v-select v-model="newUser.role" label="Role" :items="['admin', 'courier', 'clerk']" required></v-select>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="isAddUser ? closeAddUser() : false">Close</v-btn>
                <v-btn variant="flat" color="teal" @click="isAddUser ? addUser() : false">
                    {{ isAddUser ? "Add User" : "" }}
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
                <v-text-field v-model="selectedUser.lastName" label="Last Name" required></v-text-field>
                <v-text-field v-model="selectedUser.firstName" label="First Name" required></v-text-field>
                <v-text-field v-model="selectedUser.email" label="Email" required></v-text-field>
                <v-select v-model="selectedUser.role" label="Role" :items="['admin', 'courier', 'clerk']"
                    required></v-select>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click=" isEditUser ? closeEditUser() : false">Close</v-btn>
                <v-btn variant="flat" color="teal" @click="isEditUser ? updateUser(selectedUser) : false">
                    {{ isEditUser ? "Update User" : "" }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog persistent :model-value="isGenerateReport" width="500">
        <v-card class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">
                {{ isGenerateReport ? "Generate Report" : "" }}
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="6">
                            <v-text-field v-model="selectedFromDate" label="From Date" type="date"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field v-model="selectedToDate" label="To Date" type="date"></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="isGenerateReport ? closeGenerateReport() : false">Close</v-btn>
                <v-btn variant="flat" color="teal" @click="isGenerateReport ? generateReport() : false">
                    {{ isGenerateReport ? "Generate Report" : "" }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog persistent :model-value="isGenerateBill" width="500">
        <v-card class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">
                {{ isGenerateBill ? "Generate Bill" : "" }}
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="6">
                            <v-text-field v-model="selectedFromDate" label="From Date" type="date"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field v-model="selectedToDate" label="To Date" type="date"></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="isGenerateBill ? closeGenerateBill() : false">Close</v-btn>
                <v-btn variant="flat" color="teal" @click="isGenerateBill ? generateBill() : false">
                    {{ isGenerateBill ? "Generate Bill" : "" }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog persistent :model-value="isEditCompany" width="500">
        <v-card class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">
                {{ isEditCompany ? "Edit Company" : "" }}
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="newCompany.name" label="Name" required></v-text-field>
                <v-text-field v-model="newCompany.address" label="Location" required></v-text-field>
                <v-text-field v-model="newCompany.costPerBlock" label="CostperBlock" required></v-text-field>
                <v-text-field v-model="newCompany.timePerBlock" label="TimeperBlock" required></v-text-field>
                <v-text-field v-model="newCompany.bonusPercentage" label="Bonus Percentage" required></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="isEditCompany ? closeEditCompany() : false">Close</v-btn>
                <v-btn variant="flat" color="teal" @click="isEditCompany ? updateCompany() : false">
                    {{ isEditCompany ? "Update Company" : "" }}
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

    <v-dialog persistent :model-value="isAddEdge || isEditEdge" width="500">
        <v-card class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">
                {{ isAddEdge ? "Add Edge" : isEditEdge ? "Edit Edge" : "" }}
            </v-card-title>
            <v-card-text>
                <v-select v-model="selectedFromNode" :items="nodes" item-title="name" item-value="id"
                    label="Select From Node" return-object required>
                </v-select>
                <v-select v-model="selectedToNode" :items="availableToNodes" item-title="name" item-value="id"
                    label="Select To Node" return-object required>
                </v-select>
                <v-text-field v-model="newEdge.cost" label="Cost" required></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="isAddEdge ? closeAddEdge() : isEditEdge ? closeEditEdge() : false">Close</v-btn>
                <v-btn variant="flat" color="teal" @click="isAddEdge ? addEdge() : isEditEdge ? updateEdge() : false">
                    {{ isAddEdge ? "Add Edge" : isEditEdge ? "Update Edge" : "" }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog persistent :model-value="isAddNode || isEditNode" width="500">
        <v-card class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">
                {{ isAddNode ? "Add Node" : isEditNode ? "Edit Node" : "" }}
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="newNode.name" label="Name" required></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="isAddNode ? closeAddNode() : isEditNode ? closeEditNode() : false">Close</v-btn>
                <v-btn variant="flat" color="teal" @click="isAddNode ? addNode() : isEditNode ? updateNode() : false">
                    {{ isAddNode ? "Add Node" : isEditNode ? "Update Node" : "" }}
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
