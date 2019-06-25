import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CustomMaterialModule} from './material/material.module';
import {MenuComponent} from './layout/menu/menu.component';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CustomMaterialModule,
    HttpClientModule
  ],
  declarations: [
    MenuComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    CustomMaterialModule,
    MenuComponent
  ],
  providers: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
