import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Page } from '../_models/page';
import { CommonService } from '../_services/common.service';
import { debounceTime } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-result-list',
  templateUrl: './test-result-list.component.html',
  styleUrls: ['./test-result-list.component.scss']
})
export class TestResultListComponent implements OnInit {

  id: string;
  learnerId: string;
  grade: string;
  isEdit: boolean;
  ColumnMode = ColumnMode;
  qsn=[]
  marks:0
  modalTitle = 'Add Video';
  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  btnSaveText = 'Save';
  loadingIndicator = false;
  filterForm: FormGroup;
  DeviceDetail: any = [];

  page = new Page();
  rows = [];
  subject: any;
  test: any;
  Learner: any = [];
  subjectList: Array<any> = [];
  levelList: Array<any> = [];
  optionLabels: Array<string> = ['a', 'b', 'c', 'd'];
  baseUrl;
  modalLgConfig: any = { class: 'gray modal-xl', backdrop: 'static' };
  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;
  @ViewChild('dataTable', { static: false }) table: any;
  @ViewChild(DatatableComponent) tableComponent: DatatableComponent;

  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.baseUrl = environment.baseUrl;
    this.page.pageNumber = 0;
    this.page.size = 20;
    if (this.route.snapshot.paramMap.has("id") && this.route.snapshot.paramMap.has("learnerId")) {
      this.id = this.route.snapshot.paramMap.get("id");
      this.learnerId = this.route.snapshot.paramMap.get("learnerId");
      this.GetLearnerDetaileById();
      this.getList();
    }

  }


  ngOnInit() {

  }


  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }
  GetLearnerDetaileById() {
    this._service.get('Learner/GetLearnerDetaileById/' + this.learnerId).subscribe(res => {
      if (res.Status === 2) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === 1) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.Learner = res.Data;
    }, err => {
      this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    }
    );
  }
  getList() {
    this.loadingIndicator = true;
    const obj = {
      size: this.page.size,
      pageNumber: this.page.pageNumber,
      testId: this.id,
      learnerId: this.learnerId,
    };
    this._service.get('Learner/GetSmallTestResult', obj).subscribe(res => {
      this.loadingIndicator = false;
      if (res.Status === 2) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === 1) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      let data = [];
      if (res.Data.List) {
        res.Data.List.SmallTests.forEach(element => {
          this.subject = res.Data.List.Name;
          this.test = element.Name;

          data.push({
            ID: element.ID,
            TotalQuestion: element.TotalQuestion,
            CorrectAnswerCount: element.CorrectAnswerCount,
            WrongAnswerCount: element.WrongAnswerCount,
            NotAnsweredCount: element.NotAnsweredCount,
            CreatedOn: element.CreatedOn,
            Percentage: Number((element.CorrectAnswerCount / element.TotalQuestion) * 100),
            Grade: this.findGrade((element.CorrectAnswerCount / element.TotalQuestion) * 100)

          })
        });
        this.rows = data;
        this.page.totalElements = res.Data.Total;
        this.page.totalPages = this.page.totalElements / this.page.size;
      }


      setTimeout(() => {
        this.loadingIndicator = false;
        this.tableComponent.recalculate();
      }, 1000);
    }, err => {
      this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    });
  }

  findGrade(value): string {
    switch (true) {
      case (value >= 80):
        this.grade = "A+"
        return this.grade;
      case (value >= 70 && value <= 79):
        this.grade = "A"
        return this.grade;
      case (value >= 60 && value <= 69):
        this.grade = "A-"
        return this.grade;
      case (value >= 50 && value <= 59):
        this.grade = "B"
        return this.grade;
      case (value >= 40 && value <= 49):
        this.grade = "C"
        return this.grade;
      case (value >= 30 && value <= 39):
        this.grade = "D"
        return this.grade;
      case (value < 30):
        this.grade = "F"
        return this.grade;
      default:
        return "";
    }
  }
  getDetailsView(row, template) {
    const obj = {
      size: this.page.size,
      pageNumber: this.page.pageNumber,
      historyId: row.ID,
      testId: this.id,
      learnerId: this.learnerId,
    };
    this._service.get('Learner/GetSmallTestResultAnswer', obj).subscribe(res => {
      if (res.Status === 2) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === 1) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.qsn=[];
      this.marks=row.Percentage
      res.Data.forEach(element => {
        var ans = element.Answered;
        this.qsn.push({
          Id: element.QuestionID, Question: element.Question_bn,
          Options:
            [
              { Text: element.Answer1, Selected: element.Answered === element.Answer1 },
              { Text: element.Answer2, Selected: element.Answered === element.Answer2 },
              { Text: element.Answer3, Selected: element.Answered === element.Answer3 },
              { Text: element.Answer4, Selected: element.Answered === element.Answer4 },
            ],
          CorrectAns: element.Answer,
          Answered: element.Answered? element.Answered.trim() : null,
          Correct : element.Correct
         
        });
      });
      //this.qsn = res.Data;
    }, err => {
      this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    }
    );
    this.modalRef = this.modalService.show(template, { class: 'gray modal-lg', backdrop: 'static' })
  
  }
  modalHideView(){
    this.modalRef.hide();
  }
  ShowDeviceDetails(deviceTemplate){
    var deviceNo = this.Learner.DeviceNo
    //this.modalRef = this.modalService.show(deviceTemplate, this.modalConfig);
    this._service.get('Master/GetDeviceInfo/'+ deviceNo).subscribe(res => {
       this.blockUI.stop();
       if (res.Status === 2) {
          this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
          return;
       }
       else if (res.Status === 1) {
          this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
          return;
       }
       this.DeviceDetail = res.Data;
       this.modalRef = this.modalService.show(deviceTemplate, this.modalConfig);
    }, err => {
       this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    }
    );

 }
 modalHide() {
    this.modalRef.hide();
 }
 
}
