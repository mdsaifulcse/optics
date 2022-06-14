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
import { MustMatch } from "src/app/_helpers/must-match.validator";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "app-member-list",
  templateUrl: "./member-list.component.html",
  styleUrls: ["./member-list.component.scss"],
})
export class MemberListComponent implements OnInit {
  baseUrl = environment.baseUrl;
  filterForm: FormGroup;
  entryForm: FormGroup;
  passwordForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "Create Member";
  btnSaveText = "Save";
  submitted = false;
  modalConfig: any = { class: "gray modal-md", backdrop: "static" };
  modalLgConfig: any = { class: "gray modal-lg", backdrop: "static" };
  modalRef: BsModalRef;

  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  designationList: Array<any> = [];
  roleList: Array<any> = [];
  permissionList: Array<any> = [];
  rolePermissionList: Array<any> = [];

  permissions: Array<any> = [];

  page = new Page();

  selectedMember: any;

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
      search_text: [null]
    });

    this.entryForm = this.formBuilder.group({
      id: [null],
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      mobile_number: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      role: [null, [Validators.required]],
      designation: [null, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', Validators.required],
      is_active: [true],
    }, {
      validator: MustMatch('password', 'confirm_password')
    });

    this.passwordForm = this.formBuilder.group({
      user_id: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });

    this.getDesignationList();
    this.getRoleList();
    this.getPermissionList();

    this.filterForm.get("search_text").valueChanges.pipe(debounceTime(700)).subscribe(() => {
      this.getList();
    });

    this.getList();
  }


  get f() {
    return this.entryForm.controls;
  }

  get p() {
    return this.passwordForm.controls;
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
    this.filterForm.controls['search_text'].setValue(null);
    this.getList();
  }


  onRoleChange(e) {
    this.getRolePermissionList(e.id);
  }

  getList() {
    this.loadingIndicator = true;
    const obj = {
      size: this.page.size,
      pageNumber: this.page.pageNumber,
      search_text: this.filterForm.value.search_text
    };
    this._service.get("admin/get-member-list", obj).subscribe(
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



  getDesignationList() {
    this._service.get("get-designation-list").subscribe(
      (res) => {
        if (!res.success) {
          this.toastr.warning(res.message, "Warning!", { timeOut: 2000 });
          return;
        }
        this.designationList = res.data;
      },
      (err) => {
        this.toastr.warning(err.message || err, "Warning!", {
          closeButton: true,
          disableTimeOut: false,
        });
      }
    );
  }

  getRoleList() {
    this._service.get("get-role-list").subscribe(
      (res) => {
        if (!res.success) {
          this.toastr.warning(res.message, "Warning!", { timeOut: 2000 });
          return;
        }
        this.roleList = res.data;
      },
      (err) => {
        this.toastr.warning(err.message || err, "Warning!", {
          closeButton: true,
          disableTimeOut: false,
        });
      }
    );
  }

  getPermissionList() {
    this.permissionList = [];
    this._service.get("get-permission-list").subscribe(
      (res) => {
        if (!res.success) {
          this.toastr.warning(res.message, "Warning!", { timeOut: 2000 });
          return;
        }
        this.permissionList = res.data;

        this.permissionList.forEach(element => {
          element.is_selected = false;
        });
      },
      (err) => {
        this.toastr.warning(err.message || err, "Warning!", {
          closeButton: true,
          disableTimeOut: false,
        });
      }
    );
  }

  getRolePermissionList(id) {

    this._service.get("get-role-permission-list/" + id).subscribe(
      (res) => {
        if (!res.success) {
          this.toastr.warning(res.message, "Warning!", { timeOut: 2000 });
          return;
        }
        this.permissionList.forEach(element => {
          element.is_selected = res.data.indexOf(element.id) !== -1;
        });

      },
      (err) => {
        this.toastr.warning(err.message || err, "Warning!", {
          closeButton: true,
          disableTimeOut: false,
        });
      }
    );
  }


  getEditData(template: TemplateRef<any>, item) {

    this.blockUI.start('Getting data...');
    this._service.get("admin/get-member-details/" + item.id).subscribe(
      (res) => {
        if (!res.success) {
          this.toastr.warning(res.message, "Warning!", { timeOut: 2000 });
          return;
        }
        this.selectedMember = res.data;
        this.entryForm.controls['id'].setValue(this.selectedMember.id);
        this.entryForm.controls['first_name'].setValue(this.selectedMember.first_name);
        this.entryForm.controls['last_name'].setValue(this.selectedMember.last_name);
        this.entryForm.controls['mobile_number'].setValue(this.selectedMember.mobile_number);
        this.entryForm.controls['mobile_number'].disable();
        this.entryForm.controls['email'].setValue(this.selectedMember.email);
        this.entryForm.controls['role'].setValue(this.selectedMember.role_id);

        this.permissionList.forEach(element => {
          element.is_selected = this.selectedMember.permissions.indexOf(element.id) !== -1;
        });



        this.entryForm.controls['designation'].setValue(this.selectedMember.designation_id);
        this.entryForm.controls['is_active'].setValue(this.selectedMember.is_active);



        this.entryForm.controls['password'].setValidators(null);
        this.entryForm.controls['password'].updateValueAndValidity();

        this.entryForm.controls['confirm_password'].setValidators(null);
        this.entryForm.controls['confirm_password'].updateValueAndValidity();

        this.modalTitle = "Update Member";
        this.btnSaveText = "Update";

        this.modalRef = this.modalService.show(template, this.modalLgConfig);

        //   this.permissionList.forEach(element => {
        //     element.is_selected = false
        // });
        this.blockUI.stop();
      },
      (err) => {
        this.toastr.warning(err.message || err, "Warning!", {
          closeButton: true,
          disableTimeOut: false,
        });
        this.blockUI.stop();
      }
    );

  }

  onFormSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    let permissions = this.permissionList.filter((x) => x.is_selected).map((x) => x.id);

    // let permissions = [];
    // this.designationList.forEach((element) => {
    //   if (element.is_selected) {
    //     permissions.push(element.id);
    //   }
    // });

    if (permissions.length == 0) {
      this.toastr.warning('Permission ', 'Warning!', { timeOut: 2000 });
    }

    this.blockUI.start('Saving data...');

    const obj = {
      id: this.entryForm.value.id ? this.entryForm.value.id : null,
      first_name: this.entryForm.value.first_name.trim(),
      last_name: this.entryForm.value.last_name.trim(),
      mobile_number: this.entryForm.get('mobile_number').value,
      email: this.entryForm.value.email.trim(),
      role_id: this.entryForm.value.role,
      designation_id: this.entryForm.value.designation,
      password: this.entryForm.value.password ? this.entryForm.value.password.trim() : null,
      permissions: permissions,
      is_active: this.entryForm.value.is_active,
    };

    this._service.post('admin/create-or-update-member', obj).subscribe(
      res => {
        if (!res.success) {
          this.toastr.warning(res.message, 'Warning!', { closeButton: true, disableTimeOut: false, enableHtml: true });
          return;
        }
        this.toastr.success(res.message, 'Success!', { timeOut: 2000 });

        this.blockUI.stop();
        this.modalHide();
        this.submitted = false;
        this.entryForm.reset();
        this.getList();
      },
      error => {
        this.toastr.warning(error.message || error, 'Warning!', { timeOut: 2000 });
        this.blockUI.stop();
      }
    );

  }

  onPasswordFormSubmit() {
    this.submitted = true;
    if (this.passwordForm.invalid) {
      return;
    }

    this.blockUI.start('Resetting password...');
    const obj = {
      user_id: this.passwordForm.value.user_id,
      password: typeof (this.passwordForm.value.password) != 'number' ? this.passwordForm.value.password.trim() : this.passwordForm.value.password
    };

    this._service.post('admin/reset-member-password', obj).subscribe(
      res => {
        if (!res.success) {
          this.toastr.warning(res.message, 'Warning!', { closeButton: true, disableTimeOut: false, enableHtml: true });
          return;
        }
        this.toastr.success(res.message, 'Success!', { timeOut: 2000 });

        this.blockUI.stop();
        this.modalHidePassword();
      },
      error => {
        this.toastr.warning(error.message || error, 'Warning!', { timeOut: 2000 });
        this.blockUI.stop();
      }
    );

  }



  modalHide() {
    this.entryForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.selectedMember = null;

    this.entryForm.controls['password'].setValidators([Validators.required, Validators.minLength(6)]);
    this.entryForm.controls['password'].updateValueAndValidity();

    this.entryForm.controls['confirm_password'].setValidators([Validators.required]);
    this.entryForm.controls['confirm_password'].updateValueAndValidity();

    this.modalTitle = "Create Member";
    this.btnSaveText = "Save";
    this.getPermissionList();

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }

  modalHidePassword() {
    this.passwordForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.selectedMember = null;
  }

  openModalPassword(template: TemplateRef<any>, item) {
    this.selectedMember = item;
    this.passwordForm.controls['password'].setValue(Math.floor(100000 + Math.random() * 900000));
    this.passwordForm.controls['user_id'].setValue(this.selectedMember.id);
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }



}
