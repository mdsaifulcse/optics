import { Component, OnInit, TemplateRef } from "@angular/core";
import { Location } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { Page } from "../_models/page";
import { AuthenticationService } from "../_services/authentication.service";
import { CommonService } from "../_services/common.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-post-edit",
  templateUrl: "./post-edit.component.html",
  styleUrls: ["./post-edit.component.scss"],
})
export class PostEditComponent implements OnInit {
  baseUrl = environment.baseUrl;
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
  postId: any;
  page = new Page();

  selectedUser: any;
  selectedStatus: any;

  paramObj: any = null;


  postStatus: Array<any> = [

    { id: "Pending", name: "Pending" },
    { id: "Published", name: "Published" },
    { id: "Suspended", name: "Suspended" },
    { id: "Draft", name: "Draft" },
  ];

  categoryList: Array<any> = [];
  genreList: Array<any> = [];
  unitList: Array<any> = [];
  standardSizeList: Array<any> = [];
  otherSizeList: Array<any> = [];
  sizeInMonthList: Array<any> = [];
  sizeInYearList: Array<any> = [];
  sizeList: Array<any> = [];
  filteredSizeList: Array<any> = [];
  dayWithCostList: Array<any> = [];

  selectedSize = "";
  selectedStandardSize = [];
  selectedOtherSize = [];
  selectedSizeInMonth = [];
  selectedSizeInYear = [];

  featureImage = null;
  additionalImages = [];

  size_inches_min = null;
  size_inches_max = null;

  size_cm_min = null;
  size_cm_max = null;

  postDetails: any = null;

  selectedUnit = null;
  cost = 0;

  uploadedFeatureImage = null;
  uploadedAdditionalImages = [];
  size_error_msg: string;

  constructor(
    private _location: Location,
    private _service: CommonService,
    public formBuilder: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.postId = this.route.snapshot.paramMap.get("id");

    this.route.queryParamMap.subscribe((params) => {
    const param:any = { ...params.keys, ...params };
    this.paramObj = param.params;
  }

);

  }

  ngOnInit() {

    this.entryForm = this.formBuilder.group({
      id: [null],
      user_id: [null],
      item_name: [null, [Validators.required, Validators.maxLength(550)]],
      category: [null, [Validators.required]],
      genre: [null, [Validators.required]],
      unit: [null, [Validators.required]],
      qty: [null, [Validators.required]],
      unit_price: [null, [Validators.required]],
      moq: [null, [Validators.required]],
      color_min: [null, [Validators.required]],
      color_max: [null, [Validators.required]],
      size_type: [null, [Validators.required]],

      description: [null],
      feature_image: [null],
      additional_images: [null],
      day_cost: [null, [Validators.required]],
      status: [null, [Validators.required]],
      is_featured: [false],
      is_urgent: [false],

      size_inches_min: [null],
      size_inches_max: [null],

      size_cm_min: [null],
      size_cm_max: [null],

    });

    this.getCategoryList();
    this.getGenreList();
    this.getUnitList();
    this.getSizeTypeList();
    this.getDayCostList();
    this.getStandardSizeList();
    this.getOtherSizeList();
    this.getSizeInMonthList();
    this.getSizeInYearList();

    this.doAsyncTask().then(() => {
     // this.blockUI.stop();
    });
  }

  get f() {
    return this.entryForm.controls;
  }

  getCategoryList() {
    this.categoryList = [];
    this._service.get("category-list").subscribe({
      next: (res: any) => {
        if (!res.success) {
          this.toastr.warning(res.message, "Warning!", { timeOut: 2000 });
          return;
        }
        this.categoryList = res.data;
      },
      error: (err) => {
        this.toastr.warning(err.message || err, "Warning!", {
          closeButton: true,
          disableTimeOut: false,
        });
      },
      complete: () => {},
    });
  }

  getGenreList() {
    this.genreList = [];
    this._service.get("genre-list").subscribe({
      next: (res: any) => {
        if (!res.success) {
          this.toastr.warning(res.message, "Warning!", { timeOut: 2000 });
          return;
        }
        this.genreList = res.data;
      },
      error: (err) => {
        this.toastr.warning(err.message || err, "Warning!", {
          closeButton: true,
          disableTimeOut: false,
        });
      },
      complete: () => {},
    });
  }

  getUnitList() {
    this.unitList = [];
    this._service.get("unit-list").subscribe({
      next: (res: any) => {
        if (!res.success) {
          this.toastr.warning(res.message, "Warning!", { timeOut: 2000 });
          return;
        }
        this.unitList = res.data;
      },
      error: (err) => {
        this.toastr.warning(err.message || err, "Warning!", {
          closeButton: true,
          disableTimeOut: false,
        });
      },
      complete: () => {},
    });
  }

  getSizeTypeList() {
    this.sizeList = [];
    this._service.get("size-type-list").subscribe({
      next: (res: any) => {
        if (!res.success) {
          this.toastr.warning(res.message, "Warning!", { timeOut: 2000 });
          return;
        }
        this.sizeList = res.data;
      },
      error: (err) => {
        this.toastr.warning(err.message || err, "Warning!", {
          closeButton: true,
          disableTimeOut: false,
        });
      },
      complete: () => {},
    });
  }

  getStandardSizeList() {
    this.standardSizeList = [];
    this._service.get("standard-size-list").subscribe({
      next: (res: any) => {
        if (!res.success) {
          this.toastr.warning(res.message, "Warning!", { timeOut: 2000 });
          return;
        }
        this.standardSizeList = res.data.map((item: any) => {
          item.selected = false;
          return item;
        });
      },
      error: (err) => {
        this.toastr.warning(err.message || err, "Warning!", {
          closeButton: true,
          disableTimeOut: false,
        });
      },
      complete: () => {},
    });
  }

  getOtherSizeList() {
    this.otherSizeList = [];
    this._service.get("other-size-list").subscribe({
      next: (res: any) => {
        if (!res.success) {
          this.toastr.warning(res.message, "Warning!", { timeOut: 2000 });
          return;
        }
        this.otherSizeList = res.data.map((item: any) => {
          item.selected = false;
          return item;
        });
      },
      error: (err) => {
        this.toastr.warning(err.message || err, "Warning!", {
          closeButton: true,
          disableTimeOut: false,
        });
      },
      complete: () => {},
    });
  }

  getSizeInMonthList() {
    this.sizeInMonthList = [];
    this._service.get("month-size-list").subscribe({
      next: (res: any) => {
        if (!res.success) {
          this.toastr.warning(res.message, "Warning!", { timeOut: 2000 });
          return;
        }
        this.sizeInMonthList = res.data.map((item: any) => {
          item.selected = false;
          return item;
        });
      },
      error: (err) => {
        this.toastr.warning(err.message || err, "Warning!", {
          closeButton: true,
          disableTimeOut: false,
        });
      },
      complete: () => {},
    });
  }

  getSizeInYearList() {
    this.sizeInYearList = [];
    this._service.get("year-size-list").subscribe({
      next: (res: any) => {
        if (!res.success) {
          this.toastr.warning(res.message, "Warning!", { timeOut: 2000 });
          return;
        }
        this.sizeInYearList = res.data.map((item: any) => {
          item.selected = false;
          return item;
        });
      },
      error: (err) => {
        this.toastr.warning(err.message || err, "Warning!", {
          closeButton: true,
          disableTimeOut: false,
        });
      },
      complete: () => {},
    });
  }

  getDayCostList() {
    this.dayWithCostList = [];
    this._service.get("day-cost-list").subscribe({
      next: (res: any) => {
        if (!res.success) {
          this.toastr.warning(res.message, "Warning!", { timeOut: 2000 });
          return;
        }
        this.dayWithCostList = res.data;
      },
      error: (err) => {
        this.toastr.warning(err.message || err, "Warning!", {
          closeButton: true,
          disableTimeOut: false,
        });
      },
      complete: () => {},
    });
  }

  clearValidator() {
    this.entryForm.controls['size_inches_max'].setValidators(null);
    this.entryForm.controls['size_inches_max'].updateValueAndValidity();

    this.entryForm.controls['size_inches_min'].setValidators(null);
    this.entryForm.controls['size_inches_min'].updateValueAndValidity();

    this.entryForm.controls['size_cm_max'].setValidators(null);
    this.entryForm.controls['size_cm_max'].updateValueAndValidity();

    this.entryForm.controls['size_cm_min'].setValidators(null);
    this.entryForm.controls['size_cm_min'].updateValueAndValidity();
  }

  sizeClick(e){
    console.log(e);
    if(e){
      this.size_error_msg = null;
    }
  }

  onSizeChange(e) {
    this.selectedSize = e.slug;
    this.clearSizeSelection();
    switch (this.selectedSize) {
      case 'standard_size':
        this.clearValidator();
        return;
      case 'size_in_month':
        this.clearValidator();
        return;

      case 'size_in_year':
        this.clearValidator();
        return;

      case 'other_size':
        this.clearValidator();
        return;

      case 'size_in_inches':
        this.clearValidator();

        this.entryForm.controls['size_inches_min'].setValidators(
          Validators.required
        );
        this.entryForm.controls['size_inches_min'].updateValueAndValidity();

        this.entryForm.controls['size_inches_max'].setValidators(
          Validators.required
        );
        this.entryForm.controls['size_inches_max'].updateValueAndValidity();
        return;

      case 'size_in_cm':
        this.clearValidator();

        this.entryForm.controls['size_cm_min'].setValidators(
          Validators.required
        );
        this.entryForm.controls['size_cm_min'].updateValueAndValidity();

        this.entryForm.controls['size_cm_max'].setValidators(
          Validators.required
        );
        this.entryForm.controls['size_cm_max'].updateValueAndValidity();
        return;
    }
  }

  clearSizeSelection() {
    this.standardSizeList.forEach((element) => {
      element.selected = false;
    });
    this.otherSizeList.forEach((element) => {
      element.selected = false;
    });
    this.sizeInYearList.forEach((element) => {
      element.selected = false;
    });
    this.sizeInMonthList.forEach((element) => {
      element.selected = false;
    });

    this.selectedStandardSize = [];
    this.selectedOtherSize = [];
    this.selectedSizeInMonth = [];
    this.selectedSizeInYear = [];
  }

  doAsyncTask() {
    var promise = new Promise((resolve: any, reject) => {

        this.getPostDetails();
        resolve(true);
    });
    return promise;
  }

  onUnitChange(e) {
    this.selectedUnit = this.unitList.find(x=> x.id == e);
  }


  onGenreChange(e) {
    if (e.name == 'Kids') {
      this.filteredSizeList = this.sizeList.filter(
        (x) => x.slug == 'size_in_month' || x.slug == 'size_in_year'
      );
    } else {
      this.filteredSizeList = this.sizeList.filter(
        (x) => x.slug != 'size_in_month' && x.slug != 'size_in_year'
      );
    }
    this.selectedSize = null;
    this.clearSizeSelection();
    this.entryForm.controls['size_type'].setValue(null);
  }


  onDurationChange(e){
    this.cost = 0;
    if(e){
      this.cost = e.value;
    }
  }


  getPostDetails() {
    this.blockUI.start("Getting Data...");
    this._service.get("post/" + this.postId).subscribe({
      next: (res: any) => {
        if (!res.success) {
          this.toastr.warning(res.message, "Warning!", { timeOut: 2000 });
          return;
        }
        this.postDetails = res.data;
      this.blockUI.stop();
      this.entryForm.controls['id'].setValue(this.postDetails.id);
      this.entryForm.controls['user_id'].setValue(this.postDetails.user_id);
      this.entryForm.controls['item_name'].setValue(this.postDetails.item_name);
      this.entryForm.controls['category'].setValue(this.postDetails.category_id);
      this.entryForm.controls['genre'].setValue(this.postDetails.genre_id);
      this.entryForm.controls['unit'].setValue(this.postDetails.unit_id);
      this.onUnitChange(this.postDetails.unit_id);
      this.entryForm.controls['qty'].setValue(this.postDetails.qty);
      this.entryForm.controls['unit_price'].setValue(this.postDetails.unit_price);
      this.entryForm.controls['moq'].setValue(this.postDetails.minimum_order_qty);
      this.entryForm.controls['color_min'].setValue(this.postDetails.color_min);
      this.entryForm.controls['color_max'].setValue(this.postDetails.color_max);
      this.entryForm.controls['is_featured'].setValue(this.postDetails.is_featured);
      this.entryForm.controls['is_urgent'].setValue(this.postDetails.is_urgent);
      let sizeObj = this.sizeList.find(x=> x.id == this.postDetails.size_type_id);

      this.filteredSizeList = this.sizeList;

      this.entryForm.controls['size_type'].setValue(sizeObj);
      this.onSizeChange(sizeObj);


      if (sizeObj.name == 'Kids') {
        this.filteredSizeList = this.sizeList.filter(
          (x) => x.slug == 'size_in_month' || x.slug == 'size_in_year'
        );
      } else {
        this.filteredSizeList = this.sizeList.filter(
          (x) => x.slug != 'size_in_month' && x.slug != 'size_in_year'
        );
      }

      this.entryForm.controls['description'].setValue(this.postDetails.description);
      let day_cost_item = this.dayWithCostList.find(x=> x.day == this.postDetails.live_time && x.value == this.postDetails.post_cost)
      this.entryForm.controls['day_cost'].setValue(day_cost_item);

      this.entryForm.get('day_cost').disable();



      this.onDurationChange(day_cost_item);


      this.postDetails.post_images.forEach(element => {
        if(element.is_featured){
          this.uploadedFeatureImage = element;
        }else{
          this.uploadedAdditionalImages.push(element);
        }
      });
      switch (sizeObj.slug) {
        case 'standard_size':
          this.postDetails.post_sizes.forEach((element) => {
            this.standardSizeList.find((x)=>{
             if(x.id == element.size_id){
              x.selected = true;
              return x
             }
            });
          });
          return;

        case 'size_in_month':
          this.postDetails.post_sizes.forEach((element) => {
            this.sizeInMonthList.find((x)=>{
             if(x.id == element.size_id){
              x.selected = true;
              return x
             }
            });
          });
          return;

        case 'size_in_year':
          this.postDetails.post_sizes.forEach((element) => {
            this.sizeInYearList.find((x)=>{
             if(x.id == element.size_id){
              x.selected = true;
              return x
             }
            });
          });
          return;

        case 'other_size':
          this.postDetails.post_sizes.forEach((element) => {
            this.otherSizeList.find((x)=>{
             if(x.id == element.size_id){
              x.selected = true;
              return x
             }
            });
          });
          return;

        case 'size_in_inches':
          this.entryForm.controls['size_inches_min'].setValue(this.postDetails.size_inches_min);
          this.entryForm.controls['size_inches_max'].setValue(this.postDetails.size_inches_max);
          return;

        case 'size_in_cm':
          this.entryForm.controls['size_cm_min'].setValue(this.postDetails.size_cm_min);
          this.entryForm.controls['size_cm_max'].setValue(this.postDetails.size_cm_max);
          return;

      }

      },
      error: (err) => {

        this.toastr.warning(err.message || err, "Warning!", {
          closeButton: true,
          disableTimeOut: false,
        });
      },
      complete: () => {

      },
    });
  }

  goBack() {
    this._location.back();
  }


  onFeatureImageFileChange(event) {
    this.featureImage = null;
    this.uploadedFeatureImage = null;
    if (event.target.files && event.target.files[0]) {
      let imageFile = event.target.files[0];

      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.featureImage = {
          baseFile: event.target.result,
          rawFile: imageFile,
        };
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onAdditionalImageFileChange(event) {
    this.additionalImages = [];
    this.uploadedAdditionalImages = [];
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        let imageFile = event.target.files[i];

        var reader = new FileReader();
        reader.onload = (event: any) => {
          // console.log(event.target.result);
          this.additionalImages.push({
            baseFile: event.target.result,
            rawFile: imageFile,
          });
        };

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }


  onPostUpdateSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let feature_image_url = null;
    let additional_image_urls = [];

    let sizes = [];
    if (this.standardSizeList.filter((x) => x.selected).length > 0) {
      this.standardSizeList.forEach((element) => {
        if (element.selected) {
          sizes.push({
            size_type_id: this.entryForm.value.size_type.id,
            size_id: element.id,
            size_value: element.name,
          });
        }
      });
    } else if (this.otherSizeList.filter((x) => x.selected).length > 0) {
      this.otherSizeList.forEach((element) => {
        if (element.selected) {
          sizes.push({
            size_type_id: this.entryForm.value.size_type.id,
            size_id: element.id,
            size_value: element.name,
          });
        }
      });
    } else if (this.sizeInMonthList.filter((x) => x.selected).length > 0) {
      this.sizeInMonthList.forEach((element) => {
        if (element.selected) {
          sizes.push({
            size_type_id: this.entryForm.value.size_type.id,
            size_id: element.id,
            size_value: element.name,
          });
        }
      });
    } else if (this.sizeInYearList.filter((x) => x.selected).length > 0) {
      this.sizeInYearList.forEach((element) => {
        if (element.selected) {
          sizes.push({
            size_type_id: this.entryForm.value.size_type.id,
            size_id: element.id,
            size_value: element.name,
          });
        }
      });
    }
    let formData = new FormData();

    if (this.featureImage) {
      formData.append("feature_image", this.featureImage.rawFile);
    }else{
      feature_image_url = this.uploadedFeatureImage.image_url;
    }

    if (this.additionalImages.length > 0) {
      this.additionalImages.forEach((element) => {
        formData.append("additional_images[]", element.rawFile);
      });
    } else{
      this.uploadedAdditionalImages.forEach(element => {
        additional_image_urls.push(element.image_url);
      });

    }

    if(sizes.length == 0 && (this.selectedSize != 'size_in_inches' && this.selectedSize != 'size_in_cm')){
      this.size_error_msg = 'Select sizes';
      return;
    }

    let status;
    if(this.paramObj.status == 'Published'){
      status = this.postDetails.status;
      if(this.entryForm.value.status){
        status = "Outdated";
      }
    }else{
      status = this.entryForm.value.status;
    }

    let obj = {
      id: this.entryForm.value.id,
      user_id: this.entryForm.value.user_id,
      item_name: this.entryForm.value.item_name.trim(),
      category_id: this.entryForm.value.category,
      genre_id: this.entryForm.value.genre,
      unit_id: this.entryForm.value.unit,
      unit_price: Number(this.entryForm.value.unit_price),
      qty: Number(this.entryForm.value.qty),
      minimum_order_qty: Number(this.entryForm.value.moq),
      color_min: this.entryForm.value.color_min? Number(this.entryForm.value.color_min): 0,
      color_max: this.entryForm.value.color_max
        ? Number(this.entryForm.value.color_max)
        : Number(this.entryForm.value.color_min),
      size_type_id: this.entryForm.value.size_type.id,
      size_inches_min: this.entryForm.value.size_inches_min
      ? Number(this.entryForm.value.size_inches_min)
      : 0,
    size_inches_max: this.entryForm.value.size_inches_max
      ? Number(this.entryForm.value.size_inches_max)
      : 0,
    size_cm_min: this.entryForm.value.size_cm_min
      ? Number(this.entryForm.value.size_cm_min)
      : 0,
    size_cm_max: this.entryForm.value.size_cm_max
      ? Number(this.entryForm.value.size_cm_max)
      : 0,
      description: this.entryForm.value.description,
      live_time: this.postDetails.live_time,
      post_cost: this.postDetails.post_cost,
      is_featured: this.entryForm.value.is_featured ,
      is_urgent: this.entryForm.value.is_urgent,
      sizes: sizes,
      status: status,
      feature_image_url : feature_image_url ?? null,
      additional_image_urls : additional_image_urls ?? null
    };

    this.blockUI.start("Updating...");
    formData.append("data", JSON.stringify(obj));



    this._service.post("admin/update-post", formData).subscribe({
      next: (res: any) => {
        if (!res.success) {
          this.toastr.error(res.message, "Warning!", { timeOut: 3000 });
        }
        this.toastr.success(res.message, "Success!", { timeOut: 3000 });
        this.router.navigate(["/post-list"]);
      },
      error: (e) => {
        this.toastr.error(e.message, "Warning!", { timeOut: 3000 });
      },
      complete: () => this.blockUI.stop(),
    });
  }




}
