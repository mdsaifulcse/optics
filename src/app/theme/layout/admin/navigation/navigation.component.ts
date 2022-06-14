import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import {NextConfig} from '../../../../app-config';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  public windowWidth: number;
  public flatConfig: any;
  @Output() onNavMobCollapse = new EventEmitter();
  currentUser: any;

  constructor(private authService: AuthenticationService) {
    this.flatConfig = NextConfig.config;
    this.windowWidth = window.innerWidth;
    this.authService.currentUserDetails.subscribe(value=>this.currentUser = value);
  }

  ngOnInit() { }

  navMobCollapse() {
    if (this.windowWidth < 992) {
      this.onNavMobCollapse.emit();
    }
  }
}
