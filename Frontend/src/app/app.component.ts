import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Frontend';
  constructor(private service:ApiService){

  }
  
  ngOnInit(){

    const body:JSON = <JSON><unknown>{
      "Fecha": "2021-01-02T10:10:08",
      "Detalle": 
      [
        {
          "IdProducto":"xHsRl949N5aptvF0M7vt",
          "Cantidad":5
        }
      ],
      "NombreCliente":"Allende",
      "NITCliente": 6789,
      "IdEmpleado":"ABCRl949N5aptTTTM7vt"
    };
    
    this.postPedido(body);

    
  }

    

  getProductos(){
    this.service.getProductos().subscribe((response) =>{
       console.log('Response from API', response);
    }, (error)=>{
      console.log('Error', error);
    })
  }

  postPedido(body: JSON){
    this.service.postPedido(body).subscribe((response) =>{
       console.log('Response from API', response);
    }, (error)=>{
      console.log('Error', error);
    })
  }
}
