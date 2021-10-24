

//const firestore = require('firebase/firestore')
const express = require('express')
const cors = require('cors');
const { query } = require('express');


database = require('./config')
const ingrediente = database.ingrediente;
const producto = database.producto;
const familia =database.familia;
const cliente = database.cliente;
const pedido = database.pedido;
const firebase = database.firebase;

//const { async } = require('@firebase/util')
const app = express()
app.use(express.json())
app.use(cors())

app.get("/api/getIngredientes", async (req, res) => {
    const snapshot = await ingrediente.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(list);
  });

app.get("/api/getProductos", async (req, res) => {
    const snapshot = await producto.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(list);
  });

app.get("/api/getClientes", async (req, res) => {
    const snapshot = await cliente.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(list);
  });
app.get("/api/getPedidos", async (req, res) => {
    const snapshot = await pedido.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(list);
  });


app.post("/api/postIngrediente", async(req,res)=> 
{
    const data = req.body
    console.log("Info Ingredientes ",data)
    await ingrediente.add(data)
    res.send({msg: "Ingrediente added"})
})

app.post("/api/postCliente", async(req,res)=> 
{
    const data = req.body
    const nit = data.NIT
    var respuesta = null;
    
    let query = cliente.where('NIT', '==', nit);
    let querySnapshot = await query.get();

    if (querySnapshot.empty) {
        console.log(`No encontramos al NIT: ${nit}, lo creamos`);
        await cliente.add(data)
        respuesta = data
    } else {
        console.log('Encontramos al NIT: ',nit);
        querySnapshot.forEach(documentSnapshot => {
            console.log(`Found document at ${documentSnapshot.ref.path}`);
            respuesta = `El NIT ${nit} ya existe en ${documentSnapshot.ref.path}`
        });
    }

    res.send(respuesta)
})

app.get("/api/getIngrediente/:nombre", async (req, res) => {
    var nombreIng =req.params.nombre 
    console.log('Nombre:', nombreIng)
    let query = ingrediente.where('Nombre', '==', nombreIng);
    let querySnapshot = await query.get();
    let respuesta = null;

    if (querySnapshot.empty) {
        console.log(`No encontramos al Ingrediente: ${nombreIng}`);
       
    } else {
        console.log('Encontramos al ingrediente: ',nombreIng);
        const list = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        respuesta = list
    }


    res.send(respuesta);
  });

  app.get("/api/getCliente/:nit", async (req, res) => {
    var nitCliente =req.params.nit 
    //var nombreCliente =req.params.nombre 
    console.log('Typeof nit: ',(typeof nitCliente));
    nitCliente = parseInt(nitCliente, 10);
    let query = await cliente.where('NIT', '==', nitCliente);
    let querySnapshot = await query.get();
    let respuesta = null;

    if (querySnapshot.empty) {
        console.log(`No encontramos al cliente con nit: ${nitCliente}`);
       
    } else {
        console.log('Encontramos al nit: ',nitCliente);
        const list = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        respuesta = list
    }


    res.send(respuesta);
  });
  
  app.get("/api/getFamilia/:nombre", async (req, res) => {
    var prd =req.params.nombre 
    
    let query = await familia.where('Nombre', '==', prd);
    let querySnapshot = await query.get();
    let respuesta = null;

    if (querySnapshot.empty) {
        console.log(`No encontramos la familia con nombre: ${prd}`);
       
    } else {
        console.log('Encontramos a la familia: ',prd);
        const list = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        respuesta = list
    }


    res.send(respuesta);
  });

  app.get("/api/getProducto/Id/:id", async (req, res) => {
    var prd =req.params.id 
    let respuesta = null;
    await producto.doc(prd).get().then(snapshot => {
      let querySnapshot = snapshot.data()
      console.log(querySnapshot)
      // do something with document
      if (typeof querySnapshot == 'undefined'||querySnapshot.empty || querySnapshot == null) {
        console.log(`No encontramos el producto con Id: ${prd}`);
       
      } else {
          console.log('Encontramos al producto: ',prd);
          respuesta = querySnapshot
      }
    })
    
    res.send(respuesta);
  });

  app.get("/api/getProducto/Nombre/:nombre", async (req, res) => {
    var prd =req.params.nombre 
    
    let query = await producto.where('Nombre', '==', prd);
    let querySnapshot = await query.get();
    let respuesta = null;

    if (querySnapshot.empty) {
        console.log(`No encontramos el producto con nombre: ${prd}`);
        respuesta = `No encontramos el producto con nombre: ${prd}`;
       
    } else {
        console.log('Encontramos al producto: ',prd);
        const list = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        respuesta = list
    }


    res.send(respuesta);
  });

/*
  Para el siguiente post es necesaria la siguiente estructura en el requestbody:
  {
    "Fecha": "2019-01-02T10:12:04",
    "Detalle": 
    [
      {
        "IdProducto":"xHsRl949N5aptvF0M7vt",
        "Cantidad":2
      }
    ],
    "NombreCliente":"Lopez",
    "NITCliente": 77777,
    "IdEmpleado":"ABCRl949N5aptvF0M7vt"
  }
*/ 
app.post("/api/postPedido", async(req,res)=> 
{
    const data = req.body

    // const data = {
    //   "Fecha": "2019-01-02T10:12:04",
    //   "Detalle": 
    //   [
    //     {
    //       "IdProducto":"xHsRl949N5aptvF0M7vt",
    //       "Cantidad":4
    //     }
    //   ],
    //   "NombreCliente":"Lopez",
    //   "NITCliente": 77777,
    //   "IdEmpleado":"ABCRl949N5aptvF0M7vt"
    // }

    //buscamos todos los productos de la lista
    var misProds = []
    var precioTotal = 0;
    data.Detalle.forEach(
      async (prd) => 
      {
        
        //Verificamos si existen los productos y creamos la lista de productos a ingresar
        await producto.doc(prd.IdProducto).get().then(snapshot => {
          let querySnapshot = snapshot.data()
          console.log(querySnapshot)
          if (typeof querySnapshot == 'undefined'||querySnapshot.empty || querySnapshot == null) {
            console.log(`No encontramos el producto con Id: ${prd.IdProducto}`);
          
          } else {
              console.log('Encontramos al producto: ',prd.IdProducto);
              var miProd = {
                "Cantidad": prd.Cantidad,
                "Id": prd.IdProducto,
                "Nombre": querySnapshot.Nombre,
                "Precio": (parseInt(prd.Cantidad, 10) * Number(querySnapshot.Precio))
              }
              misProds.push(miProd);
              precioTotal = precioTotal + Number(miProd.Precio);
              
          }
        })
      }
      
      );


      //Verificamos si el cliente que nos pasan esta ya registrado, si no lo esta, lo registramos
      const nit = data.NITCliente;
      const nombre = data.NombreCliente;
      const dataCliente = 
      {
        "NIT": parseInt(nit, 10),
        "Nombre":nombre
      }
      
      
      let query = cliente.where('NIT', '==', nit);
      let querySnapshot = await query.get();

      if (querySnapshot.empty) {
          console.log(`No encontramos al NIT: ${nit}, lo creamos`);
          await cliente.add(dataCliente)
      } else {
          console.log('Encontramos al NIT: ',nit);
          querySnapshot.forEach(documentSnapshot => {
              console.log(`Found document at ${documentSnapshot.ref.path}`);
          });
      }
      var newPedido = 
      {
        "Fecha": firebase.firestore.Timestamp.fromDate(new Date(data.Fecha)),
        "Detalle" : misProds,
        "NITCliente": nit,
        "NombreCliente": nombre,
        "IdEmpleado": data.IdEmpleado,
        "Precio": precioTotal

      };
      console.log("Pedido: ",newPedido);


    await pedido.add(newPedido)
    res.send({msg: "Pedido added","Pedido": newPedido})
})



app.listen(4000,()=>console.log("Up and Running on 40000"))
