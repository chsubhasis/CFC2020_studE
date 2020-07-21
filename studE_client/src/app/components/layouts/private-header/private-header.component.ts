import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-private-header',
  templateUrl: './private-header.component.html',
  styleUrls: ['./private-header.component.css']
})
export class PrivateHeaderComponent implements OnInit {
  constructor(
    private route: Router
  ) { }

  ngOnInit(): void {
  }


  /**
   * Navigate To Home Page
   */
  public goToHome() {
    this.route.navigate(['/']);
  }
}
