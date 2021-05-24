import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  user: Observable<firebase.User>;
  constructor(private firebaseAuth: AngularFireAuth) { 
    this.user = firebaseAuth.authState;
  }

  public SignUp(gmail:string,password:string):Promise<firebase.auth.UserCredential>{
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(gmail,password);
  }
  
  public SendEmailVerificationten(){
    return this.firebaseAuth.auth.currentUser.sendEmailVerification();
  }

  public Deñete(){
    
  }
}
