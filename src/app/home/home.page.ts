import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IonMenu, IonSearchbar, IonSelect, ModalController } from '@ionic/angular';
import { User } from '../models/user';
import { EditAddUserPage } from '../pages/edit-add-user/edit-add-user.page';
import { GestorApiService } from '../services/gestor-api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit,OnDestroy{
  public listusers:User[]=[];
  displayedColumns: string[] = ['uid','avatar', 'gmail', 'name','phone'];
  dataSource:MatTableDataSource<User>;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [1,5, 10, 25, 100];
  pageEvent: PageEvent;
  ordertype:string="ASCENDING";
  typesearch:string="disabled";
  disableSearch:boolean=true;
  auxpagenow:number=0;
  button_order:string="caret-up-outline";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(IonSearchbar) searchBar: IonSearchbar;
  @ViewChild(IonMenu) ionmenu:IonMenu;
  @ViewChild(IonSelect) ionselect:IonSelect;
  nameSerach:string="";
  emailSerach:string="";
  phoneSerach:string="";
  uidSerach:string="";
  constructor(private basedatos:GestorApiService,private modalController:ModalController,private utils:UtilitiesService) {
    
  }
  ngOnDestroy(): void {
    if(this.ionmenu.isOpen()){
      this.ionmenu.close();
    }
  }
  ngOnInit(): void {
    this.carga(this.auxpagenow,this.pageSize);
  }

  private async carga(page:number,size:number,$event=null){
    if($event==null){
      await this.utils.presentLoading();
    }
     
      try {
        this.length=await this.basedatos.getTotalPgesUser(this.pageSize);
      } catch (error) {
        console.log(error);
      }
      try {
        this.listusers=await this.basedatos.getAllUsers(this.ordertype,page,size,this.nameSerach,this.phoneSerach,this.uidSerach,this.emailSerach);
        this.dataSource=new MatTableDataSource<User>(this.listusers);
      } catch (error) {
        console.log(error);
      }
      if($event==null){
        await this.utils.dismissLoading();
      }else{
        $event.target.complete();
      }
    
      if(this.auxpagenow>0&&(this.listusers==null||this.listusers.length==0)){
        this.paginator.previousPage();
      }

  }

  public async changePaginator($event){
    console.log($event);
    if($event.pageSize!=this.pageSize){
      this.paginator.firstPage();
      this.pageSize=$event.pageSize;
      this.carga(0,this.pageSize);
    }else{
      this.auxpagenow=$event.pageIndex;
      this.carga(this.auxpagenow,this.pageSize);
    }
  }

  public async getRecord(row:User){
    if(this.ionmenu.isOpen()){
      this.ionmenu.close();
    }
    const modal=await this.modalController.create({
      component: EditAddUserPage,
      cssClass: 'my-custom-class',
      componentProps:{
        user:row
      },
     backdropDismiss:false,

    });
    await modal.present();

    let data=await modal.onWillDismiss();
    if(data.data){
      if(data.data==true){
        this.carga(this.auxpagenow,this.pageSize);
      }
    }
  }

  public  selectButton($event){
    let cadena:string=$event.detail.value;
    if(cadena==="nothing"){
      this.disableSearch=true;
      this.typesearch="disabled";
      this.nameSerach="";
      this.uidSerach="";
      this.emailSerach="";
      this.phoneSerach="";
      this.searchBar.value="";
      
    }else{
      this.disableSearch=false;
      this.typesearch=cadena;
      let searchstring:string=this.searchBar.value;
      if(cadena=='name'){
        this.nameSerach=searchstring;
      }else if(cadena=='phone'){
        this.phoneSerach=searchstring;
      }else if(cadena=='uid'){
        this.uidSerach=searchstring;
      }else if(cadena=='email'){
        this.emailSerach=searchstring;
      }
      this.paginator.firstPage();
    }
  }

  public async ClickButtoOrder(){
    if(this.button_order==="caret-down-outline"){
      this.button_order="caret-up-outline";
      this.ordertype="ASCENDING";
    }else{
      this.button_order="caret-down-outline";
      this.ordertype="DESCENDING";
    }
    await this.carga(this.auxpagenow,this.pageSize);
  }

  public async onChangeSearchBar($event){
    console.log($event.detail.value)
    let searchvalue:string=$event.detail.value;
    if(this.typesearch=='name'){
     this.nameSerach=searchvalue;
    }else if(this.typesearch=='phone'){
      this.phoneSerach=searchvalue;
    }else if(this.typesearch=='uid'){
      this.uidSerach=searchvalue;
    }else if(this.typesearch=='email'){
      this.emailSerach=searchvalue;
    }
    if(this.auxpagenow>0){
      this.paginator.firstPage();
    }else{
      await this.carga(this.auxpagenow,this.pageSize);
    }
    this.searchBar.setFocus();
    
  }

  async Refres($event){
    this.length = 0;
    this.pageSize = 10;
    this.ordertype="ASCENDING";
    this.typesearch="disabled";
    this.disableSearch=true;
    this.auxpagenow=0;
    this.button_order="caret-up-outline";
    this.nameSerach="";
    this.emailSerach="";
    this.phoneSerach="";
    this.uidSerach="";
    this.searchBar.value="";
    this.ionselect.value="";
    this.carga(this.auxpagenow,this.pageSize,$event);
  }


}
