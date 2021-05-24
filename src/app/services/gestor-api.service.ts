import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class GestorApiService {

  constructor(private http:HTTP) { }

  public getAllUsers(order:string,page:number,size:number,name:string,phone:string,uid:string,email:string):Promise<User[]|null>{
    return new Promise((resolve,reyect)=>{
      const endpoint=environment.endpointApi+environment.userpoint+"getAllandSearch/"+page+"/"+size;
      this.http.get(endpoint,this.params(order,name,uid,phone,email),this.header).then((d)=>{
        if(d){
          let us:User[]=JSON.parse(d.data);
          if(us!=null&&us.length>0){
            resolve(us);
          }else{
            resolve(null);
          }
          
        }else{
          resolve(null);
        }
    }).catch(e=>reyect(e));
    });
  }

  public getTotalPgesUser(size:number):Promise<number|null>{
    return new Promise((resolve,reyect)=>{
      const endpoint=environment.endpointApi+environment.userpoint+environment.totalpagesuser+size;
      this.http.get(endpoint,{},this.header).then((d)=>{
        if(d){
          let n:number=JSON.parse(d.data);
          resolve(n);
        }else{
          resolve(null);
        }
      }).catch(e=>reyect(e));
    });
  }

  public crateUser(user:User,pass:string):Promise<User|null>{
    return new Promise((resolve,reyect)=>{
      const endpoint=environment.endpointApi+environment.userpoint+pass;
      this.http.setDataSerializer('json');
      this.http.post(endpoint,user,this.header).then((d)=>{
        if(d){
          let u:User=JSON.parse(d.data);
          resolve(u);
        }else{
          resolve(null);
        }
      }).catch(e=>reyect(e));
    });
  }

  public deleleUser(uid:string):Promise<boolean>{
    return new Promise((resolve,reyect)=>{
      const endpoint=environment.endpointApi+environment.userpoint+uid;
      this.http.delete(endpoint,{},this.header).then((d)=>{
        if(d){
          let b:boolean=JSON.parse(d.data);
          resolve(b);
        }else{
          resolve(false);
        }
      }).catch(e=>reyect(e));
    });
  }

  public updateUser(user:User,passW:string):Promise<boolean>{
    return new Promise((resolve,reyect)=>{
      const endpoint=environment.endpointApi+environment.userpoint+passW;
      this.http.setDataSerializer('json');
      this.http.put(endpoint,user,this.header).then((d)=>{
        if(d){
          let b:boolean=JSON.parse(d.data);
          resolve(b);
        }else{
          resolve(false);
        }
      }).catch(e=>reyect(e));
    });
  }

  private get header(){
    return{
      'Access-Control-Allow-Origin':'*',
      'Content-Type':'application/json',
      'apikey':environment.claveApi
    }
  }

  private params(order:string,name:string,uid:string,phone:string,email:string):any{
    return{
      'order':order.toUpperCase(),
      'name':name,
      'uid':uid,
      'phone':phone,
      'email':email,
    }
  }
}
