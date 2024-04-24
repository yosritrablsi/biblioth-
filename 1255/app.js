const express = require("express");
const mongoose = require("mongoose");
const authentificationrouter = require("./router/authentification.router");
const routebibliotécaire = require('./router/bibliotécaire.router');
const routeevenement = require('./router/evenement.router');
const routeformation = require('./router/formation.router');
const routerreunion= require('./router/reunion.router');
const routerressource=require('./router/ressourcepedagoghique.router')
const routeremprunte =  require('./router/emprunteRoutes');
const app = express();
const cors=require('cors');

    
mongoose.connect('mongodb://localhost:27017/test');


app.use(express.json());
app.use(cors());

app.use("/api",authentificationrouter);
app.use('/api', routebibliotécaire);
app.use('/api', routeevenement);
app.use('/api', routeformation);
app.use('/api',routerreunion);
app.use('/api',routerressource);
app.use('/api', routeremprunte);

app.listen(5000, () => {
    console.log("Database is connected! Listening to localhost 5000");
});
