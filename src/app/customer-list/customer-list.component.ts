import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Lightbox } from "ngx-lightbox";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";
import { Page } from "../_models/page";
import { AuthenticationService } from "../_services/authentication.service";
import { CommonService } from "../_services/common.service";

@Component({
  selector: "app-customer-list",
  templateUrl: "./customer-list.component.html",
  styleUrls: ["./customer-list.component.scss"],
})
export class CustomerListComponent implements OnInit {
  baseUrl = environment.baseUrl;
  filterForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "Change Status";
  btnSaveText = "Update";
  submitted = false;
  modalConfig: any = { class: "gray modal-md", backdrop: "static" };
  modalLgConfig: any = { class: "gray modal-lg", backdrop: "static" };
  modalRef: BsModalRef;

  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  public categoryList: Array<any> = [];

  page = new Page();

  selectedCustomer: any;
  selectedStatus: any;
  config: any;
  amount: number = 0;
  isInitalBalanceGiven: boolean = true;

  images: Array<any> = [];

  statusTypes: Array<any> = [
    { id: null, name: "All" },
    { id: "Pending", name: "Pending" },
    { id: "Verified", name: "Verified" },
    { id: "Suspended", name: "Suspended" },
  ];

  constructor(
    private _service: CommonService,
    public formBuilder: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private _lightbox: Lightbox
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      search_text: [null],
      status: [null]
    });
    this.getConfig();
    this.getList();
  }

  get f() {
    return this.filterForm.controls;
  }


  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }


  filterCustomer() {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.getList();
  }

  resetFilter() {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.filterForm.controls['status'].setValue(null);
    this.filterForm.controls['search_text'].setValue(null);
    this.getList();
  }



  getList() {
    this.loadingIndicator = true;
    const obj = {
      size: this.page.size,
      pageNumber: this.page.pageNumber,
      status: this.filterForm.value.status,
      search_text: this.filterForm.value.search_text
    };
    this._service.get("admin/get-customer-list", obj).subscribe(
      (res) => {
        if (!res.success) {
          this.toastr.warning(res.message, "Warning!", { timeOut: 2000 });
          return;
        }

        this.rows = res.data.records;
        this.page.totalElements = res.data.total;
        this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
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

  onStatusChange(e) {
    if (e.id == 'Verified') this.checkInitialBalanceEntry();
    else this.isInitalBalanceGiven = true;
  }

  checkInitialBalanceEntry() {
    const obj = {
      user_id: this.selectedCustomer.id
    };
    this._service.get("admin/check-inital-balance-entry", obj).subscribe(
      (res) => {
        if (!res.success) {
          this.toastr.warning(res.message, "Warning!", { timeOut: 2000 });
          return;
        }
        this.isInitalBalanceGiven = res.data.is_inital_balance_given;
      },
      (err) => {
        this.toastr.warning(err.message || err, "Warning!", {
          closeButton: true,
          disableTimeOut: false,
        });
      }
    );
  }

  getConfig() {
    this._service.get("admin/configuration/get").subscribe(
      (res) => {
        if (!res.success) {
          this.toastr.warning(res.message, "Warning!", { timeOut: 2000 });
          return;
        }
        this.config = res.data;
      },
      (err) => {
        this.toastr.warning(err.message || err, "Warning!", {
          closeButton: true,
          disableTimeOut: false,
        });
      }
    );
  }


  onFormSubmit() {
    this.submitted = true;

    if (this.selectedStatus == 'Verified' && (!this.amount || this.amount == 0)) {
      this.toastr.warning("Initial balance can't be 0 or empty!", 'Warning!', { timeOut: 2000 });
      return;
    }

    this.blockUI.start('Updating...');

    const obj = {
      id: this.selectedCustomer.id,
      status: this.selectedStatus,
      amount: Number(this.amount)
    };

    this._service.post('admin/update-user-status', obj).subscribe(
      res => {
        this.blockUI.stop();
        if (!res.success) {
          this.toastr.warning(res.message, 'Warning!', { closeButton: true, disableTimeOut: false, enableHtml: true });
          return;
        }
        this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
        this.modalHide();
        this.getList();
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: false, enableHtml: true });
      }
    );

  }

  open(id: number): void {
    // open lightbox
    const i = this.images.findIndex((x)=>x.image_id == id);
    this._lightbox.open(this.images, i, { wrapAround: true, showImageNumberLabel: true, positionFromTop: 50 });
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }


  modalHide() {
    // this.entryForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.selectedCustomer = null;
    this.selectedStatus = null;
    this.isInitalBalanceGiven = true;
    this.amount = 0;
    this.images = [];
  }

  openModal(template: TemplateRef<any>, item) {
    this.selectedCustomer = item;
    this.selectedStatus = this.selectedCustomer.status;
    this.amount = this.config.default_wallet_value;
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  modalHideProfile() {
    this.modalRef.hide();
    this.selectedCustomer = null;
    this.images = [];
  }

  openModalProfile(template: TemplateRef<any>, item) {
    this.selectedCustomer = item;
    if (this.selectedCustomer.NID_image) {
      this.images.push({
        image_id :1,
        src: this.baseUrl + '/' + this.selectedCustomer.NID_image,
        caption: 'NID Image',
        thumb: this.baseUrl + '/' + this.selectedCustomer.NID_image
      });
    }

    if (this.selectedCustomer.passport_image) {
      this.images.push({
        image_id :2,
        src: this.baseUrl + '/' + this.selectedCustomer.passport_image,
        caption: 'Passport Iamge',
        thumb: this.baseUrl + '/' + this.selectedCustomer.passport_image
      });
    }

    if (this.selectedCustomer.TIN_image) {
      this.images.push({
        image_id :3,
        src: this.baseUrl + '/' + this.selectedCustomer.TIN_image,
        caption: 'TIN Image',
        thumb: this.baseUrl + '/' + this.selectedCustomer.TIN_image
      });
    }

    if (this.selectedCustomer.BIN_image) {
      this.images.push({
        image_id :4,
        src: this.baseUrl + '/' + this.selectedCustomer.BIN_image,
        caption: 'BIN Image',
        thumb: this.baseUrl + '/' + this.selectedCustomer.BIN_image
      });
    }

    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }


  findImage(image_id){
    return this.images.find((x)=>x.image_id == image_id);
  }

}
