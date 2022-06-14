import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { CommonService } from '../_services/common.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../_services/authentication.service';
import { Page } from '../_models/page';
import { environment } from 'src/environments/environment';
import { ignoreElements } from 'rxjs/operators';
import { ResponseStatus } from '../_models/enum';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';



@Component({
   selector: 'app-dashboard-admin',
   templateUrl: './dashboard-admin.component.html',
   styleUrls: ['./dashboard-admin.component.scss'],
   providers: [NgbTooltipConfig]
})
export class AdminViewComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
   totalUsers: any = 0;
   totalPosts: any = 0;
  //  totalVideos: any;
  //  totalDocs: any;
  //  totalExam: any;
  //  totalTest: any;
   limit: Number = 5;

   page = new Page();
   baseUrl = environment.baseUrl;

   traineeProgressList = { list: [], total: 0 };
   traineePerformance = { list: [], total: 0 };
   belatedTraineeList = { list: [], total: 0 };
   certificateList = { list: [], total: 0 };
   courseProgressList = { list: [], total: 0 };



   constructor(private _service: CommonService,
      config: NgbTooltipConfig,
      private router: Router,
      private toastr: ToastrService,
      private authService: AuthenticationService) {
      this.page.pageNumber = 0;
      this.page.size = 3;
   //    config.placement = 'right';
   //  config.triggers = 'click';
   }

   ngOnInit() {
      // this.getCounts();
      // this.getBelatedTraineeList();
      // this.getCertificateList();
      // this.getCourseProgressList();
   }


   getTraineeProgressList() {
      this._service.get('dashboard/get-trainee-progress', this.page).subscribe(res => {
         if (res.Status === ResponseStatus.Warning) {
            this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
            return;
         }
         else if (res.Status === ResponseStatus.Error) {
            this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: false, enableHtml: true });
            return;
         }
         this.traineeProgressList.list = res.Data;
      }, err => {
         this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
      }
      );
   }



}
