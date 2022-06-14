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
  selector: "app-upazila",
  templateUrl: "./upazila.component.html",
  styleUrls: ["./upazila.component.scss"],
})
export class UpazilaComponent implements OnInit {
  currentUser: any;
  baseUrl = environment.baseUrl;
  filterForm: FormGroup;
  createEditForm: FormGroup;
  userPasswrodChangeForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "Create new Upazila";
  btnSaveText = "Save";
  submitted = false;
  modalConfig: any = { class: "gray modal-md", backdrop: "static" };
  modalLgConfig: any = { class: "gray modal-lg", backdrop: "static" };
  modalRef: BsModalRef;
  imageFile: any;
  imageUrl: string | ArrayBuffer;
  userId=null;
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
  status = [{ status: 'Active', name: "Active" }, { status: "Inactive", name: "Inactive" }]

  subDistricts=[];
  sequence:number;
  divisions=[];
  districts=[];


  constructor(
    private _service: CommonService,
    private confirmService: ConfirmService,
    public formBuilder: FormBuilder,
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
      status: ['Active']
    });

    this.createEditForm = this.formBuilder.group({
      id: [null],
      division_id: [null, [Validators.required]],
      district_id: [null, [Validators.required]],
      sub_district_bn: [null, [Validators.required]],
      sub_district_en: [null, [Validators.required]],
      sequence:  [null, [Validators.required]],
      status: ['Active',[Validators.required]]
      //mobile_number: [{value:null,disable:true}]
    });

    this.getList();
    this.getDivisions();
    this.getUpazilaMaxSequence();
    
  }

  get f() {
    return this.createEditForm.controls;
  }


  getList() {
    this.loadingIndicator = true;
    this._service.get("sub-districts").subscribe(
      (res) => {
        console.log(res.result)
        this.subDistricts= res.result;
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

  getUpazilaMaxSequence() {
    this.loadingIndicator = true;
    this._service.get("sub-district-max-sequence").subscribe(
      (res) => {
        this.sequence = res.result.sequence;
      },
      (err) => {}
    );
  }
  getDivisions() {
    this.loadingIndicator = true;
    this._service.get("division-list").subscribe(
      (res) => {
        this.divisions = res.result;
      },
      (err) => {}
    );
  }

  onDivisionChange(item) {
    this.getDistrictByDivision(item.id)
    this.districts=[]
    this.createEditForm.controls['district_id'].setValue(null);
  }
  getDistrictByDivision(divisionId) {
    this.loadingIndicator = true;
    this._service.get("districtByDivisionId/"+divisionId).subscribe(
      (res) => {
        this.districts = res.result;
      },
      (err) => {}
    );
  }

  openModal(template: TemplateRef<any>) {
    this.createEditForm.reset();
    this.imageUrl=null;
    this.modalTitle='Create new Upazila';
    this.btnSaveText='Save';
    this.createEditForm.controls['status'].setValue('Active');
    this.createEditForm.controls['sequence'].setValue(this.sequence);
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }


  openUpdateModal(template: TemplateRef<any>, data) {
    this.createEditForm.reset();
    this.modalTitle='Update Upazila Details';
    this.btnSaveText='Update Upazila';

    if(data.division_id){
      this.getDistrictByDivision(data.division_id)
    }
    
    this.createEditForm.controls['division_id'].setValue(data.division_id);
    this.createEditForm.controls['district_id'].setValue(data.district_id);
    this.createEditForm.controls['sub_district_bn'].setValue(data.sub_district_bn);
    this.createEditForm.controls['sub_district_en'].setValue(data.sub_district_en);
    this.createEditForm.controls['sequence'].setValue(data.sequence);
    this.createEditForm.controls['status'].setValue(data.status);
    this.createEditForm.controls['id'].setValue(data.id);

      if (data.photo) this.imageUrl = this.baseUrl +'/'+ data.photo;

    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }



  onFormSubmit() {
    this.submitted = true;
    if (this.createEditForm.invalid) {
      return;
    }

    if(!this.createEditForm.value.id){ // create new Upazila ----------------
      let formData = new FormData();

      formData.append('division_id', this.createEditForm.value.division_id)
      formData.append('district_id', this.createEditForm.value.district_id)
      formData.append('sub_district_bn', this.createEditForm.value.sub_district_bn)
      formData.append('sub_district_en', this.createEditForm.value.sub_district_en)
      formData.append('sequence', this.createEditForm.value.sequence)
      formData.append('status', this.createEditForm.value.status)

      if (this.imageFile) formData.append('photo', this.imageFile)
      
      this.blockUI.start('Creating...');
      this._service.post('sub-districts', formData).subscribe(
        res => {
          this.blockUI.stop();
            this.toastr.success(res.messages, 'Success!', { timeOut: 2000 });
            this.submitted = false;
            this.modalHide();
            this.getList();
            this.getUpazilaMaxSequence();
        },
        err => {
          this.blockUI.stop();
        }
      );

    }else{ // update Upazila -----------------
      this.blockUI.start('Updating...');

      const obj = {
        division_id: this.createEditForm.value.division_id,
        district_id: this.createEditForm.value.district_id,
        id: this.createEditForm.value.id,
        sub_district_bn: this.createEditForm.value.sub_district_bn.trim(),
        sub_district_en: this.createEditForm.value.sub_district_en.trim(),
        sequence: this.createEditForm.value.sequence,
        status: this.createEditForm.value.status,
      };
  
      this._service.put('sub-districts/'+this.createEditForm.value.id, obj).subscribe(
        res => {
          this.blockUI.stop();
            this.toastr.success(res.messages, 'Success!', { timeOut: 2000 });
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

 

  submitDeleteForm(school) {

    this.confirmService.confirm('Are you sure?', 'Do you want to delete the this Upazila?')
    .subscribe(
        result => {
            if (result) {
                // delete school ----------------
              this.blockUI.start('Deleting...');
              this._service.delete('sub-districts/'+school.id).subscribe(
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
    formData.append('user_id', this.createEditForm.value.id)
    if (this.imageFile) formData.append('photo', this.imageFile)

    this._service.post('user-upload-profile-image', formData).subscribe(
      res => {
        this.blockUI.stop();
        //this.authService.updateImage(res.data);
        this.toastr.success(res.message, 'Success!', { timeOut: 3000 });
        this.submitted = false;

      },
      err => {
        //this.blockUI.stop();
        this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
      }
    );
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
