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
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';
import { objectEach } from "highcharts";


@Component({
  selector: "app-class-wise-subject",
  templateUrl: "./class-wise-subject.component.html",
  styleUrls: ["./class-wise-subject.component.scss"],
})
export class ClassWiseSubjectComponent implements OnInit {
  currentUser: any;
  baseUrl = environment.baseUrl;
  filterForm: FormGroup;
  createEditForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "Assign Class Wise Subjects";
  btnSaveText = "Save";
  submitted = false;
  modalConfig: any = { class: "gray modal-md", backdrop: "static" };
  modalLgConfig: any = { class: "gray modal-lg", backdrop: "static" };
  modalRef: BsModalRef;
  imageFile: any;
  imageUrl: string | ArrayBuffer;
  userId=null;

  sequence:number;
  classes = [];
  subjects = [];
  classWisesubjects = [];
  status = [{ status: "Active", name: "Active" }, { status: "Inactive", name: "Inactive" }]
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

  constructor(
    private _service: CommonService,
    public formBuilder: FormBuilder,
    private confirmService: ConfirmService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private _lightbox: Lightbox,
    private authService: AuthenticationService,
  ) {
    this.authService.currentUserDetails.subscribe(value=>this.currentUser = value);
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      search_text: [null],
    });

    this.createEditForm = this.formBuilder.group({
      id: [null],
      class_id: [null, [Validators.required]],
      subject_id: [null, [Validators.required]],
      //mobile_number: [{value:null,disable:true}]
    });

    this.getList();
    this.getsubjectList();
    this.getClassWiseSubjects();
    
  }

  get f() {
    return this.createEditForm.controls;
  }

  getsubjectList() {
    this.loadingIndicator = true;
  
    this._service.get("subject-list").subscribe(
      (res) => {
        if (res.status=='FAIL') {
          this.toastr.warning(res.messages, "Warning!", { timeOut: 2000 });
          return;
        }
        this.subjects = res.result;
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

  getClassWiseSubjects() {
    this.loadingIndicator = true;
  
    this._service.get("class-wise-subject").subscribe(
      (res) => {
        if (res.status=='FAIL') {
          this.toastr.warning(res.messages, "Warning!", { timeOut: 2000 });
          return;
        }
        this.classWisesubjects = res.result;
        console.log(this.classWisesubjects)
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

  getList() {
    this.loadingIndicator = true;
  
    this._service.get("class-list").subscribe(
      (res) => {
        if (res.status=='FAIL') {
          this.toastr.warning(res.messages, "Warning!", { timeOut: 2000 });
          return;
        }
        this.classes = res.result;
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


  openModal(template: TemplateRef<any>) {
    this.createEditForm.reset();
    this.userId=null;
    this.modalTitle='Assign Class Wise Subjects';
    this.btnSaveText='Save';
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }


  openModalProfile(template: TemplateRef<any>, data) {
    this.createEditForm.reset();
    this.modalTitle='Update Subject Details';
    this.btnSaveText='Update Subject';
    let subject_ids =[];
    data.subjects.forEach(element => {
      subject_ids.push(element.id);
    });
    console.log(subject_ids)

    this.createEditForm.controls['class_id'].setValue(data.id);
    this.createEditForm.controls['subject_id'].setValue(subject_ids);
    this.createEditForm.controls['id'].setValue(data.id); // set id to identify the create or update method
   
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }



  onFormSubmit() {

    this.submitted = true;
    if (this.createEditForm.invalid) {
      return;
    }

    if(!this.createEditForm.value.id){ // create new ----------------
      let formData = new FormData();
      const obj={
        class_id:this.createEditForm.value.class_id,
        subject_id:this.createEditForm.value.subject_id
      }
      
      this.blockUI.start('Creating...');
      this._service.post('save-class-subject-assign', obj).subscribe(
        res => {
          this.blockUI.stop();
            this.toastr.success(res.messages, 'Success!', { timeOut: 2000 });
            this.submitted = false;
            this.modalHide();
            this.getClassWiseSubjects();
        },
        err => {
          this.blockUI.stop();
        }
      );

    }else{ // update -----------------
      this.blockUI.start('Updating...');

      const obj={
        class_id:this.createEditForm.value.class_id,
        subject_id:this.createEditForm.value.subject_id
      }
  
      this._service.post('update-class-subject-assign', obj).subscribe(
        res => {
          this.blockUI.stop();
            this.toastr.success(res.messages, 'Success!', { timeOut: 2000 });
            this.submitted = false;
            this.modalHide();
            this.getClassWiseSubjects();
        },
        err => {
          this.blockUI.stop();
          //this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
        }
      );

    }
  }

  submitDeleteForm(data) {
    this.confirmService.confirm('Are you sure?', 'Do you want to delete the this ?')
    .subscribe(
        result => {
            if (result) {
                // delete school ----------------
              this.blockUI.start('Deleting...');
              this._service.delete('delete-class-subject-assign/'+data.class_id).subscribe(
                res => {
              console.log(res)
                  this.blockUI.stop();
                    this.toastr.success(res.messages, 'Success!', { timeOut: 2000 });
                    this.submitted = false;
                    this.getClassWiseSubjects();
                },
                err => {
                  this.blockUI.stop();
                }
              );
            }
        }
    );  
  }


  onPhotoSubmit() {
    this.submitted = true;

    this.blockUI.start('Uploading...');
    let formData = new FormData();
    formData.append('id', this.createEditForm.value.id)
    if (this.imageFile) formData.append('icon_photo', this.imageFile)

    this._service.post('subject-icon-change', formData).subscribe(
      res => {
        this.blockUI.stop();
        this.toastr.success(res.messages, 'Success!', { timeOut: 3000 });
        this.submitted = false;
        this.getList()
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
      }
    );
  }


  RemovePhoto(){
    this.imageFile=[];
    this.imageUrl=null;
  }

  readURL(event: any, input) {
    if (!input || input.files.length === 0)
      return;

    var mimeType = input.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.toastr.warning("Only images are supported", 'Warning!!');
      return;
    }

    var reader = new FileReader();

    this.imageFile = input.files[0];
    reader.readAsDataURL(input.files[0]);
    reader.onload = (_event) => {
      this.imageUrl = reader.result;
    }
    if(this.createEditForm.value.id){
      this.onPhotoSubmit();
    }
    
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


  modalHideProfile() {
    this.modalRef.hide();
    this.selectedCustomer = null;
    this.images = [];
  }


  findImage(image_id){
    return this.images.find((x)=>x.image_id == image_id);
  }

}
