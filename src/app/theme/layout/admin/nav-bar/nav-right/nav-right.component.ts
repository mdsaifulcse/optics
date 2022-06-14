import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/_models/page';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { CommonService } from 'src/app/_services/common.service';
import { environment } from 'src/environments/environment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
declare var $: any;

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit {
  currentUser: any;
  @BlockUI() blockUI: NgBlockUI;
  loadingIndicator: boolean = false;
  notifications: Array<any> = [];
  page = new Page();
  unseenTotal: number = 0;
  private connection: any;
  private proxy: any;



  constructor(private authService: AuthenticationService,
    private router: Router,
    private _service: CommonService,
    private toastr: ToastrService,) {
    this.page.size = 10;
    this.currentUser = this.authService.currentUserDetails.value;
  }

  ngOnInit() {
    // this.connection = $.hubConnection(environment.baseUrl);
    // this.proxy = this.connection.createHubProxy('NotificationHub');
    // this.connection.start().done(() => {
    //   console.log('Connected to Notification Hub');
    // }).fail((error: any) => {
    //   console.log('Notification Hub error -> ' + error);
    // });
    // this.proxy.on('NewNotification', (userType, userId, notificationId) => this.onNewNotification(userType, userId, notificationId));

   // this.getList();
  }

  onNewNotification(userType, userId, notificationId) {
    if (this.currentUser.UserType === userType || this.currentUser.Id === userId) {
      this._service.get('notification/get/' + notificationId).subscribe(res => {
        if (!res.Success) {
          this.toastr.error(res, 'Error!', { closeButton: true, disableTimeOut: false });
          return;
        }

        this.notifications.unshift(res.Record);
        this.unseenTotal++;
        this.page.totalElements++;
        this.page.totalPages = this.page.totalElements;
      }, err => {
        this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
      });
    }
  }

  logout() {


    this.blockUI.start('Sing outing...');
    const obj={}
    this._service.post('logout',obj).subscribe(
      res => {

        this.blockUI.stop();
        if (res.status=='OK') {
          this.toastr.success(res.messages, 'Success!', { timeOut: 2000 });

         // remove from local browser cookies --------------
        this.authService.logout(window.location.hostname);
        this.router.navigate(['/auth/signin']);
        }

        if (res.status=='FAIL') {
            this.toastr.error(res.message, 'Error!', { closeButton: true, disableTimeOut: true, enableHtml: true });
            return;
        }

      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
      }
    );
  }

  showMore() {
    this.page.pageNumber++;
   // this.getList();
  }

  getList() {
    this.loadingIndicator = true;
    this._service.get('notification/list', this.page).subscribe(res => {
      if (!res.Success) {
        this.toastr.error(res, 'Error!', { closeButton: true, disableTimeOut: false });
        return;
      }
      res.Records.forEach(element => {
        this.notifications.push(element);
      });
      this.unseenTotal = res.UnseenTotal;
      this.page.totalElements = res.Total;
      this.page.totalPages = this.page.totalElements > 0 ? this.page.totalElements / this.page.size : 0;
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    });
  }

  async onClickNotification(item: any) {
    try {
      if (!item.Seen) {
        await this.seenNotification(item.Id);
        item.Seen = true;
        this.unseenTotal--;
      }
      switch (item.Type) {
        case 'Exam':
          this.router.navigate(['check-trainee-answersheet', item.RefId]);
          break;
      }
    } catch (error) {

    }
  }

  private seenNotification(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this._service.get('notification/seen/' + id).subscribe(res => {
        if (!res.Success) {
          this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: false });
          return resolve(null);
        }
        resolve(null);
      }, err => {
        this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: false });
        reject(err.message || err);
      });
    })

  }
}
