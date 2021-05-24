import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { GestorApiService } from 'src/app/services/gestor-api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
@Component({
  selector: 'app-edit-add-user',
  templateUrl: './edit-add-user.page.html',
  styleUrls: ['./edit-add-user.page.scss'],
})
export class EditAddUserPage implements OnInit {
  pagetitle:string="";
  user:User;
  form: FormGroup;
  defaultImage:string="../../assets/noimage.png";
  image:string=this.defaultImage;
  typePassWord:string="Password";
  iconPassW:string="eye-outline";
  typeClassIconPass:string="hide-option";
  count:number=0;
  constructor(private navParams:NavParams,private modalController: ModalController,private fb: FormBuilder,
    private bbdd:GestorApiService,private utils:UtilitiesService,private platform:Platform) {
    this.user=this.navParams.get("user");
    this.form=this.fb.group({
      file:[],
      email:['',[Validators.required,Validators.pattern("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$")]],
      adress:['',[Validators.required]],
      name:['',[Validators.required]],
      phone:['',[Validators.required,Validators.pattern("^\\(?(\\d{3})\\)?[-]?(\\d{3})[-]?(\\d{3})$")]],
      passW:['',[Validators.pattern("^(?=.*\\d)(?=.*[\\u0021-\\u002b\\u003c-\\u0040])(?=.*[A-Z])(?=.*[a-z])\\S{6,16}$")]],
      act:[]
    });
    console.log(this.user);
   }

  ngOnInit() {
    if(this.user===null){
      this.pagetitle="ADD USER";
      this.form.get("passW").setValidators([Validators.required,Validators.pattern("^(?=.*\\d)(?=.*[\\u0021-\\u002b\\u003c-\\u0040])(?=.*[A-Z])(?=.*[a-z])\\S{6,16}$")]);
    }else{
      this.pagetitle="EDIT USER";
      if(this.user.avatar!=null&&this.user.avatar!=""){
        this.image=this.user.avatar;
      }
      this.form.get("email").setValue(this.user.gmail);
      this.form.get("name").setValue(this.user.name);
      this.form.get("phone").setValue(this.user.phone);
      this.form.get("adress").setValue(this.user.address);
      this.form.get("act").setValue(this.user.active);
    }
  }

  public async selectAvatar(){
    var file=this.form.get("file").value._files[0];
    let varia=new FileReader();
    await varia.readAsDataURL(file);
    varia.onloadend=(e:any)=>{
      this.image=e.currentTarget.result;
    }
  }

  public clearImage(){
    this.image=this.defaultImage;
  }

  public changePasswordType(){
    if(this.iconPassW==="eye-outline"){
      this.iconPassW="eye-off-outline";
      this.typePassWord="text";
      this.typeClassIconPass="show-option";
    }else{
      this.iconPassW="eye-outline";
      this.typePassWord="Password";
      this.typeClassIconPass="hide-option";
    }
  }
  
  public Return(){
    let refresh:boolean=false;
    if(this.count>0){
      refresh=true;
    }
    this.modalController.dismiss(refresh);
  }

  public async sendForm(){
    await this.utils.presentLoading();
    let im:string="";
    let edited:boolean=false;
    if(this.image!=this.defaultImage){
      im=this.image;
    }
    if(this.user==null){
      let newuser:User={
        active:this.form.get("act").value,
        address:this.form.get("adress").value,
        gmail:this.form.get("email").value,
        name:this.form.get("name").value,
        phone:this.form.get("phone").value,
        avatar:im
      }
      try {
        let addeduser:User=await this.bbdd.crateUser(newuser,this.form.get("passW").value);
        if(addeduser!=null){
          console.log(addeduser);
          this.image=this.defaultImage;
          this.form.reset();
          this.count++;
        }else{
          //toast no va, error
          console.log("NO VA");
        }
      } catch (error) {
        console.log(error);
      }
    }else{
      //edit
      let password:string="null";
      let constantestring:string=this.form.get("passW").value;
      console.log(constantestring.length);
      if(constantestring.length>=6){
        console.log("Pasa");
        password=this.form.get("passW").value;
      }
      let editUser:User={
        uid:this.user.uid,
        active:this.form.get("act").value,
        address:this.form.get("adress").value,
        gmail:this.form.get("email").value,
        name:this.form.get("name").value,
        phone:this.form.get("phone").value,
        avatar:im
      }
     if(editUser.active!=this.user.active||editUser.address!=this.user.address||editUser.avatar!=this.user.avatar||editUser.gmail!=this.user.gmail||editUser.name.toUpperCase()!=this.user.name||editUser.phone!=this.user.phone||password!="null"){
      
      try {
        edited=await this.bbdd.updateUser(editUser,password);
      } catch (error) {
        console.log(error);
      }
     }else{
      console.log("no edit");
     }
    }
    await this.utils.dismissLoading();
    if(edited){
      this.modalController.dismiss(true);
    }
  }

  public async deleteUser(){
    let acept:boolean=false;
    let deleted:boolean=false;
    try {
      acept=await this.utils.presentAlertConfirm("","Alert","Delete User ?");
      if(acept){
        await this.utils.presentLoading();
        try {
          deleted=await this.bbdd.deleleUser(this.user.uid);
        } catch (error) {
          console.log(error);
        }
        await this.utils.dismissLoading();
      }
      
    } catch (error) {
      console.log(error);
    }
    if(deleted){
      this.modalController.dismiss(true);
    }
    
  }

  //0 galeria 1 vamera
  async takePhotoMovil(type:1|0){
    try {
      let cadena:string=await this.utils.takePhotoMovil(type);
      this.image=cadena;
    } catch (error) {
      console.log(error);
    }
    
  }

  public isAndroid():boolean{
    return this.platform.is("android");
  }

}
