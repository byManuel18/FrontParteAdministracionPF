import { Injectable } from '@angular/core';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  private isLoading:boolean=false;
  constructor(private loadingController: LoadingController,public alertController: AlertController,public plataforma:Platform,
    private camera:Camera) { }

  async presentLoading() {
    this.isLoading = true;
    return await this.loadingController.create().then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }

  async dismissLoading() {
    if (this.isLoading) {
      this.isLoading = false;
      return await this.loadingController.dismiss();
    }
    return null;
  }

  async presentAlertConfirm(css: string, header: string, message: string): Promise<boolean> {
  
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        cssClass: css,
        header: header,
        message: message,
        buttons: [
          {
            text: 'CANCELAR',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              resolve(false)
            }
          }, {
            text: 'ACEPTAR',
            handler: () => {
              resolve(true);
            }
          }
        ]
      });
      await alert.present();
    });

  }

  public takePhotoMovil(sourceType):Promise<string>{
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType
    };
    return new Promise(async (resolve,reyect)=>{
     try {
      resolve('data:image/png;base64,'+await this.camera.getPicture(options));
     } catch (error) {
       reyect(error);
     }
    })
  }
}
