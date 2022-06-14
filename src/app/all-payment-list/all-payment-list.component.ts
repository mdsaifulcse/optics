import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { debounceTime } from "rxjs/operators";
import { Page } from "../_models/page";
import { AuthenticationService } from "../_services/authentication.service";
import { CommonService } from "../_services/common.service";
import * as moment from 'moment';
import { BsDaterangepickerConfig } from "ngx-bootstrap/datepicker";

@Component({
  selector: "app-all-payment-list",
  templateUrl: "./all-payment-list.component.html",
  styleUrls: ["./all-payment-list.component.scss"],
})
export class AllPaymentListComponent implements OnInit {
  filterForm: FormGroup;
  entryForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "";
  btnSaveText = "Save";
  submitted = false;
  modalConfig: any = { class: "gray modal-md", backdrop: "static" };
  modalRef: BsModalRef;
  bsConfig: Partial<BsDaterangepickerConfig>;
  bsValue: Date[] = [];
  maxDate = new Date();
  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = window.innerWidth < 1200;

  page = new Page();

  typeList = [{'id':null,'name':'All'},{'id':'Load','name':'Load'},{'id':'Membership','name':'Membership'}]

  constructor(
    private _service: CommonService,
    public formBuilder: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {

    this.bsConfig = Object.assign({}, {
      isAnimated: true,
      adaptivePosition: true,
      showClearButton: true,
      clearPosition: 'top',
     // placement: 'right',
      rangeInputFormat: 'DD MMM YYYY'
  });

    this.filterForm = this.formBuilder.group({
      date: [[null, null]],
      type: [null],
      // status: [null]
    });

    this.getList();
  }

  get f() {
    return this.filterForm.controls;
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }


  filterPayment() {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.getList();
  }

  resetFilter() {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.filterForm.reset();
    this.getList();
  }



  getList() {
    this.loadingIndicator = true;
    const obj = {
      size: this.page.size,
      pageNumber: this.page.pageNumber,
      from_date: this.filterForm.value.date ? this.filterForm.value.date[0] ? moment(this.filterForm.value.date[0]).format('DD-MMM-YYYY') : null : null,
      to_date: this.filterForm.value.date ? this.filterForm.value.date[1] ? moment(this.filterForm.value.date[1]).format('DD-MMM-YYYY') : null : null,
      type: this.filterForm.value.type ? this.filterForm.value.type.id : null

    };
    this._service.get("admin/get-all-transaction-history", obj).subscribe(
      (res) => {
        if (!res.success) {
          this.toastr.warning(res.message, "Warning!", { timeOut: 2000 });
          return;
        }

        this.rows = res.data.records;
        this.page.totalElements = res.data.total;
        this.page.totalPages = Math.ceil(
          this.page.totalElements / this.page.size
        );
        setTimeout(() => {
          this.loadingIndicator = false;
        }, 1000);
      },
      (err) => {
        this.toastr.warning(err.message || err, "Warning!", {
          closeButton: true,
          disableTimeOut: false,
        });
        setTimeout(() => {
          this.loadingIndicator = false;
        }, 1000);
      }
    );
  }



}
