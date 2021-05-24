import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAddUserPageRoutingModule } from './edit-add-user-routing.module';

import { EditAddUserPage } from './edit-add-user.page';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditAddUserPageRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MaterialFileInputModule,
  ],
  declarations: [EditAddUserPage]
})
export class EditAddUserPageModule {}
