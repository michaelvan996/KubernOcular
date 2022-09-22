const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();


const k8s = require('@kubernetes/client-node');
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);


const client = require('prom-client');
client.collectDefaultMetrics();
// console.log(client.register._metrics);
client.register.getMetricsAsJSON()
.then(data => console.log(data));
// const register = new Registry();
// register.clusterMetrics()
// .then(data => console.log(data));




app.use(express.json());

k8sApi.listNamespacedPod('default')
.then(data => {
    const output = [];
    for (const element of data.body.items) {
        output.push(element.metadata.ownerReferences[0].name);
    }
    console.log(output);
})

k8sApi.listNamespace()
.then(data => {
    // console.log(data.body.items[0].metadata.name);
    const output = [];
    for (const element of data.body.items) {
        output.push(element.metadata.name);
    }
    console.log(output);
})

k8sApi.listNode('default')
.then(data => {
    const output = [];
    for (const element of data.body.items) {
        output.push(element.metadata.name);
    }
    console.log(output);
}) 





const url = 'http://localhost:9090/api/v1/';
const start = new Date(Date.now() - (1440 * 60000)).toISOString();
const end = new Date(Date.now()).toISOString();
console.log('start: ', start);
console.log('end: ', end);
const step = '1h';


app.get('/', (req, res) => {
    fetch(`http://localhost:9090/api/v1/query_range?query=sum(up)&start=${start}&end=${end}&step=20m`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        return res.status(200).send(data);
    });
})

app.get('/cpu', (req, res) => {
    fetch(`http://localhost:9090/api/v1/query_range?query=sum(rate(container_cpu_usage_seconds_total[2h]))&start=${start}&end=${end}&step=2h`)
    .then(response => response.json())
    .then(data => {
        console.log((new Date(data.data.result[0].values[0][0] * 1000)));
        //when sending to frontend, multiply all x valus by 1000
        
        return res.status(200).send(data);
    })
})

app.get('/cpubypod', (req, res) => {
    const { pod } = req.query;
    fetch(`http://localhost:9090/api/v1/query_range?query=rate(container_cpu_usage_seconds_total[2h]{pod=${pod}})&start=${start}&end=${end}&step=2h`)
    .then(response => response.json())
    .then(data => {
        console.log('cpu usage for', pod, ':', data);
        return res.status(200).send(data);
    })
})

app.get('/mem', (req, res) => {
    fetch(`http://localhost:9090/api/v1/query_range?query=sum(container_memory_working_set_bytes)&start=${start}&end=${end}&step=2h`)
    .then(response => response.json())
    .then(data => {
        console.log('mem sum', data);
        return res.status(200).send(data);
    })
})


app.get('/cpubynode', (req, res) => {
    const { node } = req.query;
    //add node with {node=${node}}
    fetch(`http://localhost:9090/api/v1/query_range?query=sum(rate(node_cpu_seconds_total[2h]))&start=${start}&end=${end}&step=2h`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        return res.status(200).send(data)
    }) 
})

app.get('/membynode', (req, res) => {
    fetch(`http://localhost:9090/api/v1/query_range?query=sum(rate([2h]))&start=${start}&end=${end}&step=2h`)
    .then(data => {
        console.log(data);
        return res.status(200).send(data);
    })
})

// console.log(k8sApi.listNamespacedService('default'));
// k8sApi.listNamespacedService('default')
// .then(data => console.log(data))

app.listen(3000, () => console.log('listening on port 3000'));