import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrivateHeaderComponent } from './components/layouts/private-header/private-header.component';
import { PrivateBaseComponent } from './components/layouts/private-base/private-base.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MeetComponent } from './pages/meet/meet.component';
import { SocketioService } from './services/socketio.service';
import { AdminComponent } from './pages/admin/admin.component';
import { HttpClientModule } from '@angular/common/http';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AdmitMeComponent } from './pages/admit-me/admit-me.component';
import { ChartsModule } from 'ng2-charts';
import { DecimalPipe } from '@angular/common';
import { CreateComplaintPopupComponent } from './components/create-complaint-popup/create-complaint-popup.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { LoaderComponent } from './components/loader/loader.component';
import { SendReminderPopupComponent } from './components/send-reminder-popup/send-reminder-popup.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { SentimentAnalysisComponent } from './components/sentiment-analysis/sentiment-analysis.component';

@NgModule({
  declarations: [
    AppComponent,
    PrivateHeaderComponent,
    PrivateBaseComponent,
    MeetComponent,
    AdminComponent,
    AdmitMeComponent,
    CreateComplaintPopupComponent,
    LoaderComponent,
    SendReminderPopupComponent,
    SentimentAnalysisComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AccordionModule.forRoot(),
    FormsModule,
    ChartsModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    AngularDraggableModule,
  ],
  providers: [
    SocketioService,
    DecimalPipe
  ],
  entryComponents: [
    CreateComplaintPopupComponent,
    SendReminderPopupComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
