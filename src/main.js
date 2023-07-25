import { createApp, toRaw } from "vue";
import App from "./App.vue";
import { ref } from "vue";
import router from "./router.js";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import UserServices from "./services/UserServices.js";
import NodeServices from "./services/NodeServices.js";
import EdgeServices from "./services/EdgeServices.js";
import PathServices from "./services/PathServices.js";


loadFonts();


function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function initializeApp() {
  try {
    const isDataInserted = window.localStorage.getItem("dataInserted");

    if (!isDataInserted) {

    const adminUser = {
      firstName: "admin",
      lastName: "admin",
      email: "admin",
      password: "admin",
      role: "admin",
      companyId : 1,
    };

    await UserServices.addUser(adminUser);

    const user = {
      value: {
        email: "admin",
        password: "admin",
      },
    };

    window.localStorage.removeItem("user");
    const data = await UserServices.loginUser(toRaw(user));
    window.localStorage.setItem("user", JSON.stringify(data.data));

      const nodes = [
      "1st Ave and A Street",
      "2nd Ave and A Street",
      "3rd Ave and A Street",
      "4th Ave and A Street",
      "5th Ave and A Street",
      "6th Ave and A Street",
      "7th Ave and A Street",
      "1st Ave and B Street",
      "2nd Ave and B Street",
      "3rd Ave and B Street",
      "4th Ave and B Street",
      "5th Ave and B Street",
      "6th Ave and B Street",
      "7th Ave and B Street",
      "1st Ave and C Street",
      "2nd Ave and C Street",
      "3rd Ave and C Street",
      "4th Ave and C Street",
      "5th Ave and C Street",
      "6th Ave and C Street",
      "7th Ave and C Street",
      "1st Ave and D Street",
      "2nd Ave and D Street",
      "3rd Ave and D Street",
      "4th Ave and D Street",
      "5th Ave and D Street",
      "6th Ave and D Street",
      "7th Ave and D Street",
      "1st Ave and E Street",
      "2nd Ave and E Street",
      "3rd Ave and E Street",
      "4th Ave and E Street",
      "5th Ave and E Street",
      "6th Ave and E Street",
      "7th Ave and E Street",
      "1st Ave and F Street",
      "2nd Ave and F Street",
      "3rd Ave and F Street",
      "4th Ave and F Street",
      "5th Ave and F Street",
      "6th Ave and F Street",
      "7th Ave and F Street",
      "1st Ave and G Street",
      "2nd Ave and G Street",
      "3rd Ave and G Street",
      "4th Ave and G Street",
      "5th Ave and G Street",
      "6th Ave and G Street",
      "7th Ave and G Street",
    ];

    const edges = [
      { source: '1st Ave and A Street', target: '2nd Ave and A Street', cost: 1 },
      { source: '2nd Ave and A Street', target: '3rd Ave and A Street', cost: 1 },
      { source: '2nd Ave and A Street', target: '2nd Ave and B Street', cost: 1 },
      { source: '3rd Ave and A Street', target: '4th Ave and A Street', cost: 1 },
      { source: '4th Ave and A Street', target: '5th Ave and A Street', cost: 1 },
      { source: '4th Ave and A Street', target: '4th Ave and B Street', cost: 1 },
      { source: '5th Ave and A Street', target: '6th Ave and A Street', cost: 1 },
      { source: '6th Ave and A Street', target: '7th Ave and A Street', cost: 1 },
      { source: '6th Ave and A Street', target: '6th Ave and B Street', cost: 1 },
      { source: '1st Ave and B Street', target: '1st Ave and A Street', cost: 1 },
      { source: '2nd Ave and B Street', target: '1st Ave and B Street', cost: 1 },
      { source: '2nd Ave and B Street', target: '2nd Ave and A Street', cost: 1 },
      { source: '2nd Ave and B Street', target: '2nd Ave and C Street', cost: 1 },
      { source: '3rd Ave and B Street', target: '2nd Ave and B Street', cost: 1 },
      { source: '3rd Ave and B Street', target: '3rd Ave and A Street', cost: 1 },
      { source: '4th Ave and B Street', target: '3rd Ave and B Street', cost: 1 },
      { source: '4th Ave and B Street', target: '4th Ave and C Street', cost: 1 },
      { source: '5th Ave and B Street', target: '4th Ave and B Street', cost: 1 },
      { source: '5th Ave and B Street', target: '5th Ave and A Street', cost: 1 },
      { source: '6th Ave and B Street', target: '5th Ave and B Street', cost: 1 },
      { source: '6th Ave and B Street', target: '6th Ave and A Street', cost: 1 },
      { source: '6th Ave and B Street', target: '6th Ave and C Street', cost: 1 },
      { source: '7th Ave and B Street', target: '6th Ave and B Street', cost: 1 },
      { source: '7th Ave and B Street', target: '7th Ave and A Street', cost: 1 },
      { source: '1st Ave and C Street', target: '2nd Ave and C Street', cost: 1 },
      { source: '1st Ave and C Street', target: '1st Ave and B Street', cost: 1 },
      { source: '2nd Ave and C Street', target: '3rd Ave and C Street', cost: 1 },
      { source: '2nd Ave and C Street', target: '2nd Ave and B Street', cost: 1 },
      { source: '2nd Ave and C Street', target: '2nd Ave and D Street', cost: 1 },
      { source: '3rd Ave and C Street', target: '4th Ave and C Street', cost: 1 },
      { source: '3rd Ave and C Street', target: '3rd Ave and B Street', cost: 1 },
      { source: '4th Ave and C Street', target: '5th Ave and C Street', cost: 1 },
      { source: '4th Ave and C Street', target: '4th Ave and D Street', cost: 1 },
      { source: '5th Ave and C Street', target: '6th Ave and C Street', cost: 1 },
      { source: '5th Ave and C Street', target: '5th Ave and B Street', cost: 1 },
      { source: '6th Ave and C Street', target: '7th Ave and C Street', cost: 1 },
      { source: '6th Ave and C Street', target: '6th Ave and B Street', cost: 1 },
      { source: '6th Ave and C Street', target: '6th Ave and D Street', cost: 1 },
      { source: '7th Ave and C Street', target: '7th Ave and B Street', cost: 1 },
      { source: '1st Ave and D Street', target: '1st Ave and C Street', cost: 1 },
      { source: '1st Ave and D Street', target: '2nd Ave and D Street', cost: 1 },
      { source: '2nd Ave and D Street', target: '1st Ave and D Street', cost: 1 },
      { source: '2nd Ave and D Street', target: '2nd Ave and C Street', cost: 1 },
      { source: '2nd Ave and D Street', target: '2nd Ave and E Street', cost: 1 },
      { source: '2nd Ave and D Street', target: '3rd Ave and D Street', cost: 1 },
      { source: '3rd Ave and D Street', target: '2nd Ave and D Street', cost: 1 },
      { source: '3rd Ave and D Street', target: '3rd Ave and C Street', cost: 1 },
      { source: '3rd Ave and D Street', target: '4th Ave and D Street', cost: 1 },
      { source: '4th Ave and D Street', target: '3rd Ave and D Street', cost: 1 },
      { source: '4th Ave and D Street', target: '5th Ave and D Street', cost: 1 },
      { source: '4th Ave and D Street', target: '4th Ave and E Street', cost: 1 },
      { source: '5th Ave and D Street', target: '4th Ave and D Street', cost: 1 },
      { source: '5th Ave and D Street', target: '5th Ave and C Street', cost: 1 },
      { source: '5th Ave and D Street', target: '6th Ave and D Street', cost: 1 },
      { source: '6th Ave and D Street', target: '5th Ave and D Street', cost: 1 },
      { source: '6th Ave and D Street', target: '7th Ave and D Street', cost: 1 },
      { source: '6th Ave and D Street', target: '6th Ave and C Street', cost: 1 },
      { source: '6th Ave and D Street', target: '6th Ave and E Street', cost: 1 },
      { source: '7th Ave and D Street', target: '6th Ave and D Street', cost: 1 },
      { source: '7th Ave and D Street', target: '7th Ave and C Street', cost: 1 },
      { source: '1st Ave and E Street', target: '2nd Ave and E Street', cost: 1 },
      { source: '1st Ave and E Street', target: '1st Ave and D Street', cost: 1 },
      { source: '2nd Ave and E Street', target: '3rd Ave and E Street', cost: 1 },
      { source: '2nd Ave and E Street', target: '2nd Ave and D Street', cost: 1 },
      { source: '2nd Ave and E Street', target: '2nd Ave and F Street', cost: 1 },
      { source: '3rd Ave and E Street', target: '4th Ave and E Street', cost: 1 },
      { source: '3rd Ave and E Street', target: '3rd Ave and D Street', cost: 1 },
      { source: '4th Ave and E Street', target: '5th Ave and E Street', cost: 1 },
      { source: '4th Ave and E Street', target: '4th Ave and F Street', cost: 1 },
      { source: '5th Ave and E Street', target: '6th Ave and E Street', cost: 1 },
      { source: '5th Ave and E Street', target: '5th Ave and D Street', cost: 1 },
      { source: '6th Ave and E Street', target: '7th Ave and E Street', cost: 1 },
      { source: '6th Ave and E Street', target: '6th Ave and D Street', cost: 1 },
      { source: '6th Ave and E Street', target: '6th Ave and F Street', cost: 1 },
      { source: '7th Ave and E Street', target: '7th Ave and D Street', cost: 1 },
      { source: '1st Ave and F Street', target: '1st Ave and E Street', cost: 1 },
      { source: '2nd Ave and F Street', target: '1st Ave and F Street', cost: 1 },
      { source: '2nd Ave and F Street', target: '2nd Ave and E Street', cost: 1 },
      { source: '2nd Ave and F Street', target: '2nd Ave and G Street', cost: 1 },
      { source: '3rd Ave and F Street', target: '2nd Ave and F Street', cost: 1 },
      { source: '3rd Ave and F Street', target: '3rd Ave and E Street', cost: 1 },
      { source: '4th Ave and F Street', target: '3rd Ave and F Street', cost: 1 },
      { source: '4th Ave and F Street', target: '4th Ave and G Street', cost: 1 },
      { source: '5th Ave and F Street', target: '4th Ave and F Street', cost: 1 },
      { source: '5th Ave and F Street', target: '5th Ave and E Street', cost: 1 },
      { source: '6th Ave and F Street', target: '5th Ave and F Street', cost: 1 },
      { source: '6th Ave and F Street', target: '6th Ave and E Street', cost: 1 },
      { source: '6th Ave and F Street', target: '6th Ave and G Street', cost: 1 },
      { source: '7th Ave and F Street', target: '6th Ave and F Street', cost: 1 },
      { source: '7th Ave and F Street', target: '7th Ave and E Street', cost: 1 },
      { source: '1st Ave and G Street', target: '2nd Ave and G Street', cost: 1 },
      { source: '1st Ave and G Street', target: '1st Ave and F Street', cost: 1 },
      { source: '2nd Ave and G Street', target: '3rd Ave and G Street', cost: 1 },
      { source: '2nd Ave and G Street', target: '2nd Ave and F Street', cost: 1 },
      { source: '3rd Ave and G Street', target: '4th Ave and G Street', cost: 1 },
      { source: '3rd Ave and G Street', target: '3rd Ave and F Street', cost: 1 },
      { source: '4th Ave and G Street', target: '5th Ave and G Street', cost: 1 },
      { source: '5th Ave and G Street', target: '6th Ave and G Street', cost: 1 },
      { source: '5th Ave and G Street', target: '5th Ave and F Street', cost: 1 },
      { source: '6th Ave and G Street', target: '7th Ave and G Street', cost: 1 },
      { source: '6th Ave and G Street', target: '6th Ave and F Street', cost: 1 },
      { source: '7th Ave and G Street', target: '7th Ave and F Street', cost: 1 }
    ];

    for (let i = 0; i < nodes.length; i++) {
      await NodeServices.addNode({ name: nodes[i] , companyId: 1});
    }

    for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    const sourceNodeIdPromise = NodeServices.getIdFromName(edge.source);
    const targetNodeIdPromise = NodeServices.getIdFromName(edge.target);
    const cost = edge.cost;
    const companyId = 1;

    const sourceNodeId1 = await sourceNodeIdPromise;
    const targetNodeId1 = await targetNodeIdPromise;

    const sourceNodeId = sourceNodeId1;
    const targetNodeId = targetNodeId1;

    await EdgeServices.addEdge({
      sourceNodeId: sourceNodeId,
      targetNodeId: targetNodeId,
      cost: cost,
      companyId: companyId
    });
  }

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
    window.localStorage.setItem("dataInserted", "true");
    await wait(2000);
  }
    createApp(App).use(vuetify).use(router).mount("#app");
    
  } catch (error) {
    console.error("Error initializing app:", error);
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

initializeApp();
