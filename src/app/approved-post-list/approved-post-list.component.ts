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
  selector: "app-approved-post-list",
  templateUrl: "./approved-post-list.component.html",
  styleUrls: ["./approved-post-list.component.scss"],
})
export class ApprovedPostListComponent implements OnInit {
  filterForm: FormGroup;
  entryForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "";
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
    this.filterForm = this.formBuilder.group({
      search_text: [null],
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


  filterCustomer() {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.getList();
  }

  resetFilter() {
    this.page.pageNumber = 0;
    this.page.size = 10;
    // this.filterForm.controls['status'].setValue(null);
    this.filterForm.controls['search_text'].setValue(null);
    this.getList();
  }



  getList() {
    this.loadingIndicator = true;
    const obj = {
      size: this.page.size,
      pageNumber: this.page.pageNumber,
      status: 'Published',
      search_text: this.filterForm.value.search_text

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


}
