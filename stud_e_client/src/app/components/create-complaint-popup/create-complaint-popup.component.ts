import { Component, OnInit } from '@angular/core';
import { ComplaintsService } from 'src/app/services/complaints.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-complaint-popup',
  templateUrl: './create-complaint-popup.component.html',
  styleUrls: ['./create-complaint-popup.component.css']
})
export class CreateComplaintPopupComponent implements OnInit {

  public feedbackSubmitted: boolean = false;
  public showError: boolean = false;
  public complaintText: string = '';
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

  /* 
  * Submit Your Feedback
  *
  */
  public submitFeedback(): void {
    this.isLoading = true;
    this.complaintsService.submitFeedback(this.complaintText)
      .subscribe(() => {
        this.feedbackSubmitted = true;
      }, (err) => {
        console.log(err);
        this.showError = true;
        this.isLoading = false;
      }, () => { this.isLoading = false; });
  }

}
