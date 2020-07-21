import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivateBaseComponent } from './components/layouts/private-base/private-base.component';
import { MeetComponent } from './pages/meet/meet.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdmitMeComponent } from './pages/admit-me/admit-me.component';

const routes: Routes = [
  {
    path: '',
    component: PrivateBaseComponent,
    children: [
      {
        path: '',
        component: AdmitMeComponent,
        canActivate: []
      },
      {
        path: 'join-us',
        component: MeetComponent,
        canActivate: []
      },
      {
        path: 'admin',
        component: AdminComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
