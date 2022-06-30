import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Lightbox } from "ngx-lightbox";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";
import { Page } from "../../_models/page";
import { AuthenticationService } from "../../_services/authentication.service";
import { CommonService } from "../../_services/common.service";
import { MustMatch } from "src/app/_helpers/must-match.validator";
import { ConfirmService } from '../../_helpers/confirm-dialog/confirm.service';


@Component({
  selector: "app-interactive-exam",
  templateUrl: "./interactive-exam.component.html",
  styleUrls: ["./interactive-exam.component.scss"],
})
export class InteractiveExamComponent implements OnInit {
  currentUser: any;
  baseUrl = environment.baseUrl;
  filterForm: FormGroup;
  questionShowForm: FormGroup;
  createEditForm: FormGroup;
  userPasswrodChangeForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "Create new Mcq Question";
  btnSaveText = "Save";
  submitted = false;
  modalConfig: any = { class: "gray modal-lg", backdrop: "static"};
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
  obtainMark: number = 0;
  isInitalBalanceGiven: boolean = true;

  images: Array<any> = [];
  provideExamSheet = [{ status: 1, name: "Yes" }, { status: 0, name: "No" }]
  status = [{ status: 'Active', name: "Active" }, { status: "Inactive", name: "Inactive" }]

  exams=[];
  examDetails;
  is_examDetails_load=false;
  topics=[];
  sequence:number;
  classes=[];
  subjects=[];
  isProvideExamSheet:number;


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
      class_id: [null, [Validators.required]],
      subject_id: [null, [Validators.required]],
      topic_id: [null, [Validators.required]],
      answer_hint: [null]
    });

    this.questionShowForm = this.formBuilder.group({
      id: [null],
      class_id: [null, [Validators.required]],
      subject_id: [null, [Validators.required]],
      topic_id: [null, [Validators.required]]
    });

    this.isProvideExamSheet=0
    this.getList();
  }

  get f() {
    return this.createEditForm.controls;
  }


  getList() {
    this.loadingIndicator = true;
    this._service.get("interactive-exam-list").subscribe(
      (res) => {
        this.exams= res.result;
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


  getClasses() {
    this.loadingIndicator = true;
    this._service.get("class-list").subscribe(
      (res) => {
        this.classes = res.result;
      },
      (err) => {}
    );
  }

  onIsProvideSheetChange(item) {
    this.isProvideExamSheet=item.status
    if(item.status==1){
      this.createEditForm.controls['question_bn'].setValue('');
      this.createEditForm.controls['question_en'].setValue('');
    }
  }

  onClassChange(item) {
    this.getSubjectByClass(item.id)
    this.subjects=[]
    this.topics=[]
    this.createEditForm.controls['subject_id'].setValue(null);
    this.createEditForm.controls['topic_id'].setValue(null);
  }

  getSubjectByClass(classId) {
    this.loadingIndicator = true;
    this._service.get("subjectByClassId/"+classId).subscribe(
      (res) => {
        this.subjects = res.result.subjects;
      },
      (err) => {}
    );
  }
  // -------------------- on subject change ---------
  onSubjectChange(item) {
    this.getTopicBySubject(item.id)
    this.topics=[]
    this.createEditForm.controls['topic_id'].setValue(null);
  }
  getTopicBySubject(subjectId) {
    this.loadingIndicator = true;
    this._service.get("topicBySubjectId/"+subjectId).subscribe(
      (res) => {
        this.topics = res.result;
      },
      (err) => {}
    );
  }



  openModal(template: TemplateRef<any>) {
    this.modalTitle='Create new MCQ Question';
    this.btnSaveText='Save';
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }


  openExamDetailsModal(template: TemplateRef<any>, examdata) {
    this.questionShowForm.reset();
    this.modalTitle='Show Inter Active Exam Details';
    this.btnSaveText='Print';
    this.modalTitle='Show Inter Active Exam Details';
    this.btnSaveText='';
    this.getInterActiveExamDetailByExamId(examdata.exam_id)
    if (examdata.question_image1) this.imageUrl = this.baseUrl +'/'+ examdata.question_image1;
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }


  getInterActiveExamDetailByExamId(examId) {
    this.loadingIndicator = true;
    this._service.get("interactive-exam-details/"+examId).subscribe(
      (res) => {
        this.obtainMark=0;
        this.examDetails = res.result;
        this.is_examDetails_load=true;

        // this.examDetails.forEach(item => {
        // this.obtainMark = this.obtainMark + Number(item.answer_option_mark);
        // });
      },
      (err) => {}
    );
  }

 

  submitDeleteForm(data) {

    this.confirmService.confirm('Are you sure?', 'Do you want to delete the this Mcq Question?')
    .subscribe(
        result => {
            if (result) {
                // delete Mcq Question----------------
              this.blockUI.start('Deleting...');
              this._service.delete('mcq-questions/'+data.id).subscribe(
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
    if (this.imageFile) formData.append('question_image1', this.imageFile)

    this._service.post('mcq-question-image-change', formData).subscribe(
      res => {
        this.blockUI.stop();
        this.toastr.success(res.messages, 'Success!', { timeOut: 3000 });
        this.submitted = false;
        this.getList()
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
