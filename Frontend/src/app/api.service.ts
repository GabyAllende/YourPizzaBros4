import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(private http: HttpClient) 
  {

 }
  postPedido(body: JSON)
  {
    return this.http.post('/api/postPedido', body
    );
  }

  getProductos()
  {
     return this.http.get('/api/getProductos');
  }
}
