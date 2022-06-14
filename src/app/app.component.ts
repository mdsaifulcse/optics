import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from './_services/authentication.service';
import { CommonService } from './_services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private router: Router, private authService: AuthenticationService,
    private _service: CommonService) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
   // if (this.authService.isAuthenticated()) this.getUserProfile();
  }

  // getUserProfile() {
  //   this._service.get('account/get-current-profile').subscribe(res => {
  //     this.authService.currentUserDetails.next(res);
  //   });
  // }
}
