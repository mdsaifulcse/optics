import { Component, TemplateRef, ViewEncapsulation, OnInit, Pipe, PipeTransform } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { environment } from '../../environments/environment';
import { UploadDialogComponent } from '../_helpers/upload-dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Page } from '../_models/page';
import { ResponseStatus } from '../_models/enum';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  encapsulation: ViewEncapsulation.None
})

export class FAQComponent implements OnInit {

  entryForm: FormGroup;
  filterForm: FormGroup;
  submitted = false;
  filterSubmitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = 'SMS Configuration Create';
  btnSaveText = 'Save';
  to_Show = false;

  modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
  modalRef: BsModalRef;

  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  page = new Page();
  scrollBarHorizontal = (window.innerWidth < 1200);

  //imgBaseUrl = environment.imageUrl;
  baseUrl = environment.baseUrl;

  movementList = ["UP", "DOWN"];
  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private dialog: MatDialog) {
      this.page.pageNumber = 0;
      this.page.size = 10;
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };
  }


  ngOnInit() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      question: [null, [Validators.required, Validators.maxLength(250)]],
      answer: [null, [Validators.required, Validators.maxLength(250)]]

    });

    this.filterList();
  }

  get f() {
    return this.entryForm.controls;
  }

 

  filterList() {

    this.loadingIndicator = true;
    this._service.get('faq/list',this.page).subscribe(res => {
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
      if (res.Status === ResponseStatus.Warning) {
        this.toastr.warning(res.Message, 'Warning!', { closeButton: true, disableTimeOut: false, enableHtml: true });
        return;
      }
      else if (res.Status === ResponseStatus.Error) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: false, enableHtml: true });
        return;
      }

      this.rows = res.Data.Records;
      this.page.totalElements = res.Data.Total;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
    }, err => {
      this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: false, enableHtml: true });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }

  getItem(id, template: TemplateRef<any>) {
    this.blockUI.start('Getting data...');
    this._service.get('faq/get/' + id).subscribe(res => {
      this.blockUI.stop();
      if (res.Status === ResponseStatus.Warning) {
        this.toastr.warning(res.Message, 'Warning!', { closeButton: true, disableTimeOut: false, enableHtml: true });
        return;
      }
      else if (res.Status === ResponseStatus.Error) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: false, enableHtml: true });
        return;
      }
      this.modalTitle = 'Update FAQ';
      this.btnSaveText = 'Update';
      this.entryForm.controls['id'].setValue(res.Data.Record.Id);
      this.entryForm.controls['question'].setValue(res.Data.Record.Question);
      this.entryForm.controls['answer'].setValue(res.Data.Record.Answer);



      this.modalRef = this.modalService.show(template, this.modalConfig);
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: false, enableHtml: true });
    });
  }

  onFormSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    const obj = {
      Id: this.entryForm.value.id,
      QUestion: this.entryForm.value.question.trim(),
      Answer: this.entryForm.value.answer.trim(),
     
    };
    
    this._service.post('faq/create-or-update', obj).subscribe(
      res => {
        this.blockUI.stop();
        if (res.Status === ResponseStatus.Warning) {
          this.toastr.warning(res.Message, 'Warning!', { closeButton: true, disableTimeOut: false, enableHtml: true });
          return;
        }
        else if (res.Status === ResponseStatus.Error) {
          this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: false, enableHtml: true });
          return;
        }

        this.toastr.success(res.Message, 'Success!', { timeOut: 2000 });
        this.modalHide();
        this.filterList();

      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: false, enableHtml: true });
      }
    );

  }

  moveUp(id) {
    const obj={
      id: id,
      movement: this.movementList[0]
    }
    this.blockUI.start('Moving...');
    this._service.get('faq/move',obj).subscribe(res => {
      this.blockUI.stop();
      if (res.Status === ResponseStatus.Warning) {
        this.toastr.warning(res.Message, 'Warning!', { closeButton: true, disableTimeOut: false, enableHtml: true });
        return;
      }
      else if (res.Status === ResponseStatus.Error) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: false, enableHtml: true });
        return;
      }
      this.toastr.success(res.Message, 'SUCCESS!', { timeOut: 2000 });
      this.filterList();
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
    });
  }

  moveDown(id) {
    const obj={
      id: id,
      movement: this.movementList[1]
    }
    this.blockUI.start('Moving...');
    this._service.get('faq/move',obj).subscribe(res => {
      this.blockUI.stop();
      if (res.Status === ResponseStatus.Warning) {
        this.toastr.warning(res.Message, 'Warning!', { closeButton: true, disableTimeOut: false, enableHtml: true });
        return;
      }
      else if (res.Status === ResponseStatus.Error) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: false, enableHtml: true });
        return;
      }
      this.toastr.success(res.Message, 'SUCCESS!', { timeOut: 2000 });
      this.filterList();
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
    });
  }

  modalHide() {
    this.entryForm.reset();
    this.modalRef.hide();
    this.submitted = false;
   
    this.modalTitle = 'FAQ Create';
    this.btnSaveText = 'Save';
    
  }

  openModal(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(template, this.modalConfig);
  }


}
