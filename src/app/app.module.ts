import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GestorApiService } from './services/gestor-api.service';
import { AuthService } from './services/auth.service';
import { HTTP } from '@ionic-native/http/ngx';
import { UtilitiesService } from './services/utilities.service';
import { Camera } from '@ionic-native/camera/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,MaterialFileInputModule, BrowserAnimationsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },GestorApiService,AuthService,HTTP,UtilitiesService,Camera],
  bootstrap: [AppComponent],
})
export class AppModule {}
