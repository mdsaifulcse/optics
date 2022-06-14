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


@Component({
  selector: "app-classes",
  templateUrl: "./classes.component.html",
  styleUrls: ["./classes.component.scss"],
})
export class ClassComponent implements OnInit {
  currentUser: any;
  baseUrl = environment.baseUrl;
  filterForm: FormGroup;
  createEditForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "Create new Class";
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
      name_bn: [null, [Validators.required]],
      name_en: [null, [Validators.required]],
      sequence: [null, [Validators.required]],
      icon_photo: [null],
      status: ["Active",[Validators.required]]
      //mobile_number: [{value:null,disable:true}]
    });

    this.getList();
    this.getClassMaxSequence();
    
  }

  get f() {
    return this.createEditForm.controls;
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





  getList() {
    this.loadingIndicator = true;
  
    this._service.get("classes").subscribe(
      (res) => {
        console.log(res)
      
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
  getClassMaxSequence() {
    this.loadingIndicator = true;
    this._service.get("class-max-sequence").subscribe(
      (res) => {
        this.sequence = res.result.sequence;
      },
      (err) => {}
    );
  }

  openModal(template: TemplateRef<any>) {
    this.createEditForm.reset();
    this.imageUrl=null;
    this.userId=null;
    this.modalTitle='Create new Class';
    this.btnSaveText='Save';
    this.createEditForm.controls['sequence'].setValue(this.sequence);
    this.createEditForm.controls['status'].setValue("Active");
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }


  openModalProfile(template: TemplateRef<any>, data) {
    this.createEditForm.reset();
    this.modalTitle='Update Class Details';
    this.btnSaveText='Update Class';

    this.imageUrl=null;
    this.createEditForm.controls['name_bn'].setValue(data.name_bn);
    this.createEditForm.controls['name_en'].setValue(data.name_en);
    this.createEditForm.controls['sequence'].setValue(data.sequence);
    this.createEditForm.controls['id'].setValue(data.id);
    this.createEditForm.controls['status'].setValue(data.status);
    this.userId=data.id;
    if (data.icon_photo) this.imageUrl = this.baseUrl +'/'+ data.icon_photo;

    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }



  onFormSubmit() {

    this.submitted = true;
    if (this.createEditForm.invalid) {
      return;
    }

    if(!this.createEditForm.value.id){ // create new class ----------------
      let formData = new FormData();

      formData.append('name_bn', this.createEditForm.value.name_bn.trim())
      formData.append('name_en', this.createEditForm.value.name_en.trim())
      formData.append('sequence', this.createEditForm.value.sequence)
      formData.append('status', this.createEditForm.value.status)
      
      if (this.imageFile) formData.append('icon_photo', this.imageFile)
      
      this.blockUI.start('Creating...');
      this._service.post('classes', formData).subscribe(
        res => {
          this.blockUI.stop();
            this.toastr.success(res.messages, 'Success!', { timeOut: 2000 });
            this.submitted = false;
            this.modalHide();
            this.getList();
            this.getClassMaxSequence();
        },
        err => {
          this.blockUI.stop();
        }
      );

    }else{ // update admin -----------------
      this.blockUI.start('Updating...');

      const obj = {
        id: this.createEditForm.value.id,
        name_bn: this.createEditForm.value.name_bn.trim(),
        name_en: this.createEditForm.value.name_en.trim(),
        sequence: this.createEditForm.value.sequence,
        status: this.createEditForm.value.status,
      };
  
      this._service.put('classes/'+this.createEditForm.value.id, obj).subscribe(
        res => {
          this.blockUI.stop();
            this.toastr.success(res.messages, 'Success!', { timeOut: 2000 });
            //this.authService.updateProfile(res.result);
            this.submitted = false;
            this.modalHide();
            this.getList();
        },
        err => {
          this.blockUI.stop();
          //this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
        }
      );

    }
  }

  submitDeleteForm(data) {
    this.confirmService.confirm('Are you sure?', 'Do you want to delete the this Class?')
    .subscribe(
        result => {
            if (result) {
                // delete school ----------------
              this.blockUI.start('Deleting...');
              this._service.delete('classes/'+data.id).subscribe(
                res => {
                  this.blockUI.stop();
                    this.toastr.success(res.messages, 'Success!', { timeOut: 2000 });
                    this.submitted = false;
                    this.getList();
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

    this._service.post('class-icon-change', formData).subscribe(
      res => {
        console.log(res)
        this.blockUI.stop();
        this.toastr.success(res.messages, 'Success!', { timeOut: 3000 });
        this.submitted = false;
        this.getList();
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
