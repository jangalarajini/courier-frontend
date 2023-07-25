<script setup>
import { computed,onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import CustomerServices from "../services/CustomerServices.js";
import NodeServices from "../services/NodeServices.js";
import EdgeServices from "../services/EdgeServices.js";
import OrderCard from "../components/OrderCardComponent.vue";
import CompanyServices from "../services/CompanyServices.js";
import OrderServices from "../services/OrderServices";
import PathServices from "../services/PathServices.js";

const router = useRouter();
const user = ref(null);
const title = ref("Courier Services");
const drawer = ref(false);
const companyId = 1;
const companies = ref([]);
const allOrders = ref([]);
const orders = ref([]);
const paths = ref([]);


const showingUsers = ref(false);
const showingCustomers = ref(false);
const showingClerks = ref(false);
const showingCouriers = ref(false);
const showingMapNodes = ref(false);
const showingMapEdges = ref(false);
const showingCompanies = ref(false);
const showingAllOrders = ref(false);
const showingOrders = ref(false);

async function showOrders() {
    showingUsers.value = false;
    showingCustomers.value = false;
    showingClerks.value = false;
    showingCouriers.value = false;
    showingMapEdges.value = false;
    showingMapNodes.value = false;
    showingCompanies.value = false;
    showingOrders.value = true;
    showingAllOrders.value = false;

    await getOrders();
    drawer.value = false;
}

async function showAllOrders() {
    showingUsers.value = false;
    showingCustomers.value = false;
    showingClerks.value = false;
    showingCouriers.value = false;
    showingMapEdges.value = false;
    showingMapNodes.value = false;
    showingCompanies.value = false;
    showingOrders.value = false;
    showingAllOrders.value = true;
    await getAllOrders();
    drawer.value = false;
}

async function showUsers() {
    showingUsers.value = true;
    showingCustomers.value = false;
    showingClerks.value = false;
    showingCouriers.value = false;
    showingMapEdges.value = false;
    showingMapNodes.value = false;
    showingCompanies.value = false;
    await getUsers();
    drawer.value = false;
}

async function showCompanies() {
    showingUsers.value = false;
    showingCustomers.value = false;
    showingClerks.value = false;
    showingCouriers.value = false;
    showingMapEdges.value = false;
    showingMapNodes.value = false;
    showingCompanies.value = true;
    await getCompanies();
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

async function showCustomers() {
    showingUsers.value = false;
    showingCustomers.value = true;
    showingClerks.value = false;
    showingCouriers.value = false;
    showingMapEdges.value = false;
    showingMapNodes.value = false;
    showingCompanies.value = false;
    await getCustomers();
    drawer.value = false;
}

async function showClerks() {
    showingUsers.value = false;
    showingCustomers.value = false;
    showingClerks.value = true;
    showingCouriers.value = false;
    showingMapEdges.value = false;
    showingMapNodes.value = false;
    showingCompanies.value = false;
    await getClerks();
    drawer.value = false;

}

async function showCouriers() {
    showingUsers.value = false;
    showingCustomers.value = false;
    showingClerks.value = false;
    showingCouriers.value = true;
    showingMapEdges.value = false;
    showingMapNodes.value = false;
    showingCompanies.value = false;
    await getCouriers();
    drawer.value = false;
}

async function showMapNodes() {
    showingUsers.value = false;
    showingCustomers.value = false;
    showingClerks.value = false;
    showingCouriers.value = false;
    showingMapEdges.value = false;
    showingMapNodes.value = true;
    showingCompanies.value = false;
    await getNodes();
    drawer.value = false;
}

async function showMapEdges() {
    showingUsers.value = false;
    showingCustomers.value = false;
    showingClerks.value = false;
    showingCouriers.value = false;
    showingMapNodes.value = false;
    showingMapEdges.value = true;
    showingCompanies.value = false;
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

function getPathDetails(pathId) {
  const path = paths.value.find((c) => c.id === pathId);
  if (path) {
    return path;
  } else {
    return "Path not found";
  }
}

async function getOrders() {
  user.value = JSON.parse(localStorage.getItem("user"));
  try {
    if (user.value !== null && user.value.id !== null) {
      const response = await OrderServices.getOrdersByAdminId(user.value.id);
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

async function getNodeId(location) {
  const nodeId = await NodeServices.getIdFromName(location);
  return nodeId;
}

onMounted(async () => {
    await getCustomers();
  await getCouriers();
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

const isAddClerk = ref(false);
const isEditClerk = ref(false);
const isAddCourier = ref(false);
const isEditCourier = ref(false);
const isEditUser = ref(false);
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

function addMinutesToTime(time, minutesToAdd) {
  const newTime = new Date(time);
  newTime.setMinutes(newTime.getMinutes() + minutesToAdd);
  return newTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

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

const isAddOrder = ref(false);
const isEditOrder = ref(false);

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
  isAddOrder.value = false;
  newOrder.value.companyId = companyId;
  newOrder.value.pickUpCustomerId = selectedPickUpCustomer.value.id;
  newOrder.value.dropOffCustomerId = selectedDropOffCustomer.value.id;
  newOrder.value.courierId = selectedCourier.value.id;
  newOrder.value.adminId = user.value.id;
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

const availableDropOffCustomers = computed(() => {
  // Filter out the selected pick-up customer from the drop-off customer list
  return customers.value.filter(
    (customer) => customer.id !== selectedPickUpCustomer.value?.id
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
  await getOrders();
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

function openEditNode(node) {
    newNode.value.id = node.id;
    newNode.value.name = node.name;
    isEditNode.value = true;
}


function openEditEdge(edge) {
    newEdge.value.id = edge.id;
    newEdge.value.cost = edge.cost;
    newEdge.value.sourcenodeid = edge.sourcenodeid;
    newEdge.value.targetnodeid = edge.targetnodeid;
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

function formatCourierName(courier) {
  return `${courier.firstName} ${courier.lastName}`;
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
            <v-list-item prepend-icon="mdi-account-details" @click="showCompanies()" title="Company Info"></v-list-item>
            <v-list-item prepend-icon="mdi-account-details" @click="showUsers()" title="Users"></v-list-item>
            <v-list-item prepend-icon="mdi-account-details" @click="showOrders()" title="Orders"></v-list-item>
        <v-list-item prepend-icon="mdi-account-group" @click="showAllOrders()" title="All Orders"></v-list-item>
            <v-list-item prepend-icon="mdi-account-group" @click="showCustomers()" title="Customers"></v-list-item>
            <v-list-item prepend-icon="mdi-face-agent" @click="showClerks()" title="Clerks"></v-list-item>
            <v-list-item prepend-icon="mdi-bike" @click="showCouriers()" title="Couriers"></v-list-item>
            <v-list-item prepend-icon="mdi-map" @click="showMapNodes()" title="MapPlaces"></v-list-item>
            <v-list-item prepend-icon="mdi-map" @click="showMapEdges()" title="MapPaths"></v-list-item>
            <v-list-item style="color: red;" @click="logout()" prepend-icon="mdi-logout-variant"
                title="Logout"></v-list-item>
        </v-list>
    </v-navigation-drawer>

    <template v-if="showingCompanies">
        <v-container>
            <v-card-title>
                <h2>Company Info</h2>
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

    <template v-if="showingMapNodes">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card-title class="mx-10 my-3 py-3">
                        <v-row>
                            <h2>Places</h2>
                        </v-row>
                    </v-card-title>
                    <v-card v-if="nodes.length > 0" class="rounded-lg elevation-5">

                        <v-table class="rounded-lg elevation-5">
                            <thead>
                                <tr>
                                    <th class="text-left">PlaceName</th>
                                    <th class="text-left">Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in nodes" :key="item.id">
                                    <td>{{ item.name }}</td>
                                    <td>
                                        <v-icon size="small" icon="mdi-pencil" @click="openEditNode(item)"></v-icon>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </template>

    <template v-if="showingMapEdges">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card-title class="mx-10 my-3 py-3">
                        <v-row>
                            <h2>Paths</h2>
                        </v-row>
                    </v-card-title>
                    <v-card v-if="edges.length > 0" class="rounded-lg elevation-5">
                        <v-table class="rounded-lg elevation-5">
                            <thead>
                                <tr>
                                    <th class="text-left">FromPlace To ToPlace</th>
                                    <th class="text-left">Distance</th>
                                    <th class="text-left">Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in edges" :key="item.id">
                                    <td><strong>{{ item.sourceNode.name }}</strong> To <strong>{{
                                        item.targetNode.name }}</strong></td>
                                    <td>{{ item.cost }} mile</td>
                                    <td>
                                        <v-icon size="small" icon="mdi-pencil" @click="openEditEdge(item)"></v-icon>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card>
                </v-col>
            </v-row>
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

    <v-dialog persistent :model-value="isEditNode" width="500">
        <v-card class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">
                {{ isEditNode ? "Edit Place" : "" }}
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="newNode.name" label="Name" required></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="isEditNode ? closeEditNode() : false">Close</v-btn>
                <v-btn variant="flat" color="teal" @click="isEditNode ? updateNode() : false">
                    {{ isEditNode ? "Update Place" : "" }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog persistent :model-value="isEditEdge" width="500">
        <v-card class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">
                {{ isEditEdge ? "Edit Path" : "" }}
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="newEdge.cost" label="Cost" required></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="isEditEdge ? closeEditEdge() : false">Close</v-btn>
                <v-btn variant="flat" color="teal" @click="isEditEdge ? updateEdge() : false">
                    {{ isEditEdge ? "Update Path" : "" }}
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
