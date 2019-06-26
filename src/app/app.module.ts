import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {FormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SharedModule} from './shared/shared.module';
import { CalendarComponent } from './calendar/calendar.component';
import {reducers} from './store/reducers';
import {ReminderDialogComponent} from './calendar/reminder-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    ReminderDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({maxAge: 10})
  ],
  entryComponents: [
    ReminderDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
