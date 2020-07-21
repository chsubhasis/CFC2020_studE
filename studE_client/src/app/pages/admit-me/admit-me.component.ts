import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { userDetails } from 'src/app/models/complaints.model';

@Component({
  selector: 'app-admit-me',
  templateUrl: './admit-me.component.html',
  styleUrls: ['./admit-me.component.css']
})
export class AdmitMeComponent implements OnInit {


  @ViewChild('attendanceModal', { static: false }) attendanceModal: ModalDirective;

  // Visual Recognition App
  public url: string = 'https://ethicalhackersvisualrecognitionapp.eu-gb.cf.appdomain.cloud/';
  public urlSafe: SafeResourceUrl;
  public isAdmitted: boolean;
  public userDetails: userDetails;

  constructor(
    public sanitizer: DomSanitizer,
    private commonService: CommonService,
    private route: Router
  ) {
    this.commonService.isAdmitted$.subscribe(dataVal => {
      this.isAdmitted = dataVal;
    });
    /**
     * Listen to postMessage from child window
     */
    window.addEventListener("message", (event) => {
      // if it returns success
      if (event.data.v1 === 200) {
        const data = JSON.parse(JSON.parse(event.data.v2));
        const hasRecognized = data.images[0].classifiers[0].classes.length > 0 ? true : false;
        console.log(data.images[0].classifiers[0].classes[0].class);
        // assign username
        const userName = hasRecognized ? (data.images[0].classifiers[0].classes[0].class).match(/[a-zA-Z]+/g) : 'Guest';
        this.commonService.userDetails = {
          userName: userName[0]
        };

        this.isAdmitted = true;
        this.route.navigate(['/join-us']);
      }
    });
  }

  ngOnInit() {
  }

  /**
   * Sanitize Admit Me Url
   */
  public admitMe(): void {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    this.attendanceModal.show();
  }

  /**
   * Hide Attendance Modal
   */
  public hideModal(): void {
    this.attendanceModal.hide();
  }

  // Navigate To Join Us Page
  public navigateToJoinUs(): void {
    if (this.isAdmitted) {
      this.route.navigate(['/join-us']);
    } else {
      // If it is a guest user
      Swal.fire({
        title: 'Warning',
        text: 'Oops! Your are not recognized. Do you still want to proceed as guest?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#6f42c1',
      }).then((result) => {
        if (result.value) {
          this.commonService.userDetails = {
            userName: 'Guest'
          };
          this.route.navigate(['/join-us']);
        }
      })
    }

  }

}