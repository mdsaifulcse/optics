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
  selector: "app-school",
  templateUrl: "./school.component.html",
  styleUrls: ["./school.component.scss"],
})
export class SchoolComponent implements OnInit {
  currentUser: any;
  baseUrl = environment.baseUrl;
  filterForm: FormGroup;
  editProfileForm: FormGroup;
  userPasswrodChangeForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "Create new School";
  btnSaveText = "Save";
  submitted = false;
  modalConfig: any = { class: "gray modal-md", backdrop: "static" };
  modalLgConfig: any = { class: "gray modal-lg", backdrop: "static" };
  modalRef: BsModalRef;
  imageFile: any;
  imageUrl: string | ArrayBuffer;
  userId=null;

  rows = [];
  schools = [];
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

  sequence:number;
  divisions=[];
  districts=[];
  subDistricts=[];


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

    this.editProfileForm = this.formBuilder.group({
      id: [null],
      division_id: [null, [Validators.required]],
      district_id: [null, [Validators.required]],
      sub_district_id: [null, [Validators.required]],
      name_bn: [null, [Validators.required]],
      name_en: [null, [Validators.required]],
      sequence:  [null, [Validators.required]],
      status: [1,[Validators.required]]
      //mobile_number: [{value:null,disable:true}]
    });

    this.getList();
    this.getDivisions();
    this.getSchoolMaxSequence();
    
  }

  get f() {
    return this.editProfileForm.controls;
  }


  getList() {
    this.loadingIndicator = true;
    this._service.get("schools").subscribe(
      (res) => {
        this.schools = res.result;
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

  getSchoolMaxSequence() {
    this.loadingIndicator = true;
    this._service.get("school-max-sequence").subscribe(
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
    this.editProfileForm.controls['district_id'].setValue(null);
    this.editProfileForm.controls['sub_district_id'].setValue(null);
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

  onDistrictChange(item) {
    this.getSubDistrictByDistrict(item.id)
    this.subDistricts=[]
    this.editProfileForm.controls['sub_district_id'].setValue(null);
  }

  getSubDistrictByDistrict(districtId) {
    this.loadingIndicator = true;
    this._service.get("subDistrictByDistrictId/"+districtId).subscribe(
      (res) => {
        this.subDistricts= res.result;
      },
      (err) => {}
    );
  }

  openModal(template: TemplateRef<any>) {
    this.editProfileForm.reset();
    this.imageUrl=null;
    this.modalTitle='Create new School';
    this.btnSaveText='Save';
    this.editProfileForm.controls['status'].setValue('Active');
    this.editProfileForm.controls['sequence'].setValue(this.sequence);
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }


  openUpdateModal(template: TemplateRef<any>, data) {
    this.editProfileForm.reset();
    this.modalTitle='Update School Details';
    this.btnSaveText='Update School';

    if(data.division_id){
      this.getDistrictByDivision(data.division_id)
    }

    if(data.district_id){
      this.getSubDistrictByDistrict(data.district_id)
    }
    
    this.editProfileForm.controls['division_id'].setValue(data.division_id);
    this.editProfileForm.controls['district_id'].setValue(data.district_id);
    this.editProfileForm.controls['sub_district_id'].setValue(data.sub_district_id);
    this.editProfileForm.controls['name_bn'].setValue(data.name_bn);
    this.editProfileForm.controls['name_en'].setValue(data.name_en);
    this.editProfileForm.controls['sequence'].setValue(data.sequence);
    this.editProfileForm.controls['status'].setValue(data.status);
    this.editProfileForm.controls['id'].setValue(data.id);

      if (data.photo) this.imageUrl = this.baseUrl +'/'+ data.photo;

    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }



  onFormSubmit() {
    this.submitted = true;
    if (this.editProfileForm.invalid) {
      return;
    }

    if(!this.editProfileForm.value.id){ // create new Scholl ----------------
      let formData = new FormData();

      formData.append('division_id', this.editProfileForm.value.division_id)
      formData.append('district_id', this.editProfileForm.value.district_id)
      formData.append('sub_district_id', this.editProfileForm.value.sub_district_id)
      formData.append('name_bn', this.editProfileForm.value.name_bn)
      formData.append('name_en', this.editProfileForm.value.name_en)
      formData.append('sequence', this.editProfileForm.value.sequence)
      formData.append('status', this.editProfileForm.value.status)

      if (this.imageFile) formData.append('photo', this.imageFile)
      
      this.blockUI.start('Creating...');
      this._service.post('schools', formData).subscribe(
        res => {
          this.blockUI.stop();
            this.toastr.success(res.messages, 'Success!', { timeOut: 2000 });
            this.submitted = false;
            this.modalHide();
            this.getList();
        },
        err => {
          this.blockUI.stop();
        }
      );

    }else{ // update School -----------------
      this.blockUI.start('Updating...');

      const obj = {
        division_id: this.editProfileForm.value.division_id,
        district_id: this.editProfileForm.value.district_id,
        sub_district_id: this.editProfileForm.value.sub_district_id,
        id: this.editProfileForm.value.id,
        name_bn: this.editProfileForm.value.name_bn.trim(),
        name_en: this.editProfileForm.value.name_en.trim(),
        sequence: this.editProfileForm.value.sequence,
        status: this.editProfileForm.value.status,
      };
  
      this._service.put('schools/'+this.editProfileForm.value.id, obj).subscribe(
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

  submitDeleteForm(school) {
    this.confirmService.confirm('Are you sure?', 'Do you want to delete the this School?')
    .subscribe(
        result => {
            if (result) {
                // delete school ----------------
              this.blockUI.start('Deleting...');
              this._service.delete('schools/'+school.id).subscribe(
                res => {
                  this.blockUI.stop();
                    this.toastr.success(res.messages, 'Success!', { timeOut: 2000 });
                    this.submitted = false;
                    this.getList();
                    this.getSchoolMaxSequence();
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
    formData.append('id', this.editProfileForm.value.id)
    if (this.imageFile) formData.append('photo', this.imageFile)

    this._service.post('school-photo-change', formData).subscribe(
      res => {
        this.blockUI.stop();
        //this.authService.updateImage(res.data);
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
    if(this.editProfileForm.value.id){
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
