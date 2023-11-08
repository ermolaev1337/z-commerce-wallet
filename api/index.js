const express = require("express");
const axios = require("axios");

const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const hostname = process.env.BASE_URL;
const port = 8086;
const cors = require("cors");
app.use(cors());
const ip_holder = process.env.IP_HOLDER;
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

app.get("/sendAttrReq1", async (req, res, next) => {
    console.log("req:", req.body);
    //"http://"+ip_holder+"/heimdalljs/pres/attribute?\
    //index=10&expiration=100&challenge=1231423534&\
    //secretKey=holder_sk.txt&destination=pres_attribute_before_revocation.json&credential=cred_holder.json"
    const response = await axios.get(`http://${ip_holder}/heimdalljs/key/new?seed=1337`);
    console.log("makeAttrPreResponse", response.data);
    res.send(response);
});

app.get('/sendAttrReq', async (req, res) => {
    try {
        console.log(req);
        const response = await axios.get(
        `http://${ip_holder}/heimdalljs/pres/attribute?index=10&expiration=100&challenge=1231423534&secretKey=holder_sk.txt&destination=pres_attribute_before_revocation.json&credential=cred_holder.json`);
        const textResponse = response.data;
        res.send(JSON.stringify(textResponse));
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

app.get('/verifyHolder', async (req, res) => {
    try {
        const response = await axios.get(
        `http://${ip_holder}/heimdalljs/verify?path=pres_attribute_before_revocation.json`);
        const textResponse = response.data;
        console.log(textResponse);
        res.send(JSON.stringify(textResponse));
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});