import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
readonly APIUrl="https://localhost:7168";

  constructor(private http : HttpClient) { }

  postBreakfast(data : any){
    return this.http.post<any>(this.APIUrl+"/breakfasts", data);
  }

  getBreakfast(){
    return this.http.get<any>(this.APIUrl+"/breakfasts");
  }

  updateBreakfast(data : any, id : string){
    return this.http.put<any>(this.APIUrl+"/breakfasts/" + id, data);
  }

  deleteBreakfast(id : string){
    return this.http.delete<any>(this.APIUrl+"/breakfasts/" + id);
  }
}
