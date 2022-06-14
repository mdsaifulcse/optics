import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { Page } from "../_models/page";
import { AuthenticationService } from "../_services/authentication.service";
import { CommonService } from "../_services/common.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.scss"],
})
export class PostListComponent implements OnInit {
  entryForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "Update Post";
  btnSaveText = "Update";
  submitted = false;
  modalConfig: any = { class: "gray modal-md", backdrop: "static" };
  modalRef: BsModalRef;

  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = window.innerWidth < 1200;
  public categoryList: Array<any> = [];

  page = new Page();

  selectedUser: any;
  selectedStatus: any;

  postStatus: Array<any> = [
    { id: null, name: "All" },
    { id: "Pending", name: "Pending" },
    { id: "Published", name: "Published" },
    { id: "Suspended", name: "Suspended" },
    { id: "Outdated", name: "Outdated" },
    { id: "Draft", name: "Draft" }
  ];

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
    // this.entryForm = this.formBuilder.group({
    //   id: [null],
    //   stuts: [null],
    // });
    this.getList();
  }

  // get f() {
  //   return this.entryForm.controls;
  // }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }

  onStatusChange(e) {
    this.selectedStatus = e;
    if (e) {
      this.page.pageNumber = 0;
      this.page.size = 4;
      this.getList();
    }
  }

  getList() {
    this.loadingIndicator = true;
    const obj = {
      size: this.page.size,
      pageNumber: this.page.pageNumber,
      status: this.selectedStatus ? this.selectedStatus.id : null,
    };
    this._service.get("admin/get-post-list", obj).subscribe(
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

  onFormSubmit() {
    this.submitted = true;
    this.blockUI.start("Updating...");
    const obj = {
      id: this.selectedUser.id,
      status: this.selectedStatus,
    };

    this._service.post("update-user", obj).subscribe(
      (res) => {
        this.blockUI.stop();
        if (!res.success) {
          this.toastr.warning(res.message, "Warning!", {
            closeButton: true,
            disableTimeOut: false,
            enableHtml: true,
          });
          return;
        }
        this.toastr.success(res.message, "Success!", { timeOut: 2000 });
        this.modalHide();
        this.getList();
      },
      (err) => {
        this.blockUI.stop();
        this.toastr.error(err.message || err, "Error!", {
          closeButton: true,
          disableTimeOut: false,
          enableHtml: true,
        });
      }
    );
  }

  modalHide() {
    // this.entryForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.selectedUser = null;
    this.selectedStatus = null;
  }

  openModal(template: TemplateRef<any>, item) {
    this.selectedUser = item;
    this.selectedStatus = this.selectedUser.status;
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }
}
