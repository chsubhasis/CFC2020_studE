import { Component, OnInit } from '@angular/core';
import { ComplaintsService } from 'src/app/services/complaints.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-send-reminder-popup',
  templateUrl: './send-reminder-popup.component.html',
  styleUrls: ['./send-reminder-popup.component.css']
})
export class SendReminderPopupComponent implements OnInit {

  public messageSent: boolean = false;
  public showError: boolean = false;
  public reminderText: string = '';
  public isLoading: boolean = false;

  constructor(
    private complaintsService: ComplaintsService,
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit() {
  }

  public closePopup(): void {
    this.bsModalRef.hide();
  }
  public sendReminderMessage(): void {
    this.isLoading = true;
    this.complaintsService.sendReminderMessage(this.reminderText)
      .subscribe(() => {
        this.messageSent = true;
      }, (err) => {
        console.log(err);
        this.showError = true;
        this.isLoading = false;
      }, () => { this.isLoading = false; });
  }

}
