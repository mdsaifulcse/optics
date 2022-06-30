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
  selector: "app-multi-ans",
  templateUrl: "./multi-ans.component.html",
  styleUrls: ["./multi-ans.component.scss"],
})
export class MultiAnsQuestComponent implements OnInit {
  currentUser: any;
  baseUrl = environment.baseUrl;
  filterForm: FormGroup;
  questionShowForm: FormGroup;
  createEditForm: FormGroup;
  userPasswrodChangeForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "Create new Multi Ans Question";
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
  isInitalBalanceGiven: boolean = true;

  images: Array<any> = [];
  provideExamSheet = [{ status: 1, name: "Yes" }, { status: 0, name: "No" }]
  status = [{ status: 'Active', name: "Active" }, { status: "Inactive", name: "Inactive" }]

  multiAnsQuestions=[];
  topics=[];
  sequence:number;
  classes=[];
  subjects=[];
  answerOptions=[];
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
      question_bn: [null],
      question_en: [null],
      details_bn: [null],
      details_en: [null],
      answer_options:  [null, [Validators.required]],
      sequence:  [null, [Validators.required]],
      is_provide_exam_sheet: [null,[Validators.required]],
      status: ['Active',[Validators.required]]
    });

    this.questionShowForm = this.formBuilder.group({
      id: [null],
      class_id: [null, [Validators.required]],
      subject_id: [null, [Validators.required]],
      topic_id: [null, [Validators.required]],
      question_bn: [null],
      question_en: [null],
      details_bn: [null],
      details_en: [null],
      answer_options:  [null, [Validators.required]],
      sequence:  [null, [Validators.required]],
      is_provide_exam_sheet: [null,[Validators.required]],
      status: ['Active',[Validators.required]]
    });

    this.isProvideExamSheet=0
    this.getList();
    this.getClasses();
    this.getMultiAnsQuestionMaxSequence();
    
  }

  get f() {
    return this.createEditForm.controls;
  }


  getList() {
    this.loadingIndicator = true;
    this._service.get("multi-answer-questions").subscribe(
      (res) => {
        this.multiAnsQuestions= res.result;
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

  getMultiAnsQuestionMaxSequence() {
    this.loadingIndicator = true;
    this._service.get("multi-answer-question-max-sequence").subscribe(
      (res) => {
        this.sequence = res.result.sequence;
      },
      (err) => {}
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
    this.getTopicByClassAndSubject(item.id)
    this.topics=[]
    this.createEditForm.controls['topic_id'].setValue(null);
  }
  getTopicByClassAndSubject(subjectId) {
    this.loadingIndicator = true;
    let classId=this.createEditForm.value.class_id
    this._service.get("topicByClassAdnSubjectId/"+classId+"/"+subjectId).subscribe(
      (res) => {
        this.topics = res.result;
      },
      (err) => {}
    );
  }



  openModal(template: TemplateRef<any>) {
    this.createEditForm.reset();
    this.imageUrl=null;
    this.modalTitle='Create new Multi Ans Question';
    this.btnSaveText='Save';
    this.answerOptions=[]
    this.createEditForm.controls['status'].setValue('Active');
    this.createEditForm.controls['sequence'].setValue(this.sequence);
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }


  openUpdateModal(template: TemplateRef<any>, data) {
    this.createEditForm.reset();
    this.modalTitle='Update Multi Ans Question Details';
    this.btnSaveText='Update';

    if(data.class_id){
      this.getSubjectByClass(data.class_id)
    }
    if(data.subject_id){
      this.getTopicByClassAndSubject(data.subject_id)
    }
    

    this.createEditForm.controls['class_id'].setValue(data.class_id);
    this.createEditForm.controls['subject_id'].setValue(data.subject_id);
    this.createEditForm.controls['topic_id'].setValue(data.topic_id);
    this.createEditForm.controls['is_provide_exam_sheet'].setValue(data.is_provide_exam_sheet);
    this.createEditForm.controls['question_bn'].setValue(data.question_bn);
    this.createEditForm.controls['question_en'].setValue(data.question_en);
    this.createEditForm.controls['details_bn'].setValue(data.details_bn);
    this.createEditForm.controls['details_en'].setValue(data.details_en);

    this.createEditForm.controls['answer_options'].setValue(JSON.parse(data.answer_options));
    this.createEditForm.controls['sequence'].setValue(data.sequence);
   
    this.createEditForm.controls['status'].setValue(data.status);
    this.createEditForm.controls['id'].setValue(data.id);
    if (data.question_image1) this.imageUrl = this.baseUrl +'/'+ data.question_image1;
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }

  openQuestionShowModal(template: TemplateRef<any>, data) {
    this.questionShowForm.reset();
    this.modalTitle='Mcq Question Details';
    this.btnSaveText='Mcq Question';

    if(data.class_id){
      this.getSubjectByClass(data.class_id)
    }
    if(data.subject_id){
      this.getTopicByClassAndSubject(data.subject_id)
    }
   
    this.modalTitle='Show MCQ Question Details';
    this.btnSaveText='';
    this.questionShowForm.controls['class_id'].setValue(data.class_id);
    this.questionShowForm.controls['class_id'].disable();
    this.questionShowForm.controls['subject_id'].setValue(data.subject_id);
    this.questionShowForm.controls['subject_id'].disable();
    this.questionShowForm.controls['topic_id'].setValue(data.topic_id);
    this.questionShowForm.controls['topic_id'].disable();
    this.questionShowForm.controls['is_provide_exam_sheet'].setValue(data.is_provide_exam_sheet);
    this.questionShowForm.controls['is_provide_exam_sheet'].disable();
    this.questionShowForm.controls['question_bn'].setValue(data.question_bn);
    this.questionShowForm.controls['question_bn'].disable();
    this.questionShowForm.controls['question_en'].setValue(data.question_en);
    this.questionShowForm.controls['question_en'].disable();
    this.questionShowForm.controls['details_bn'].setValue(data.details_bn);
    this.questionShowForm.controls['details_bn'].disable();
    this.questionShowForm.controls['details_en'].setValue(data.details_en);
    this.questionShowForm.controls['details_en'].disable();
    this.questionShowForm.controls['answer_options'].setValue(JSON.parse(data.answer_options));
    this.questionShowForm.controls['answer_options'].disable();
    this.questionShowForm.controls['sequence'].setValue(data.sequence);
    this.questionShowForm.controls['sequence'].disable();
    this.questionShowForm.controls['status'].setValue(data.status);
    this.questionShowForm.controls['status'].disable();
    this.questionShowForm.controls['id'].setValue(data.id);
    if (data.question_image1) this.imageUrl = this.baseUrl +'/'+ data.question_image1;
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }

  onFormSubmit() {
    this.submitted = true;
    if (this.createEditForm.invalid) {
      return;
    }

    if(!this.createEditForm.value.id){ // create new Question ----------------
      let formData = new FormData();

      this.answerOptions=[]
    this.createEditForm.value.answer_options.forEach(element=>{
      this.answerOptions.push(element.label)
    })
    this.createEditForm.controls['answer_options'].setValue(this.answerOptions);

      formData.append('class_id', this.createEditForm.value.class_id);
      formData.append('subject_id', this.createEditForm.value.subject_id);
      formData.append('topic_id', this.createEditForm.value.topic_id);
      formData.append('is_provide_exam_sheet', this.createEditForm.value.is_provide_exam_sheet);
      formData.append('question_bn', this.createEditForm.value.question_bn);
      formData.append('question_en', this.createEditForm.value.question_en);
      formData.append('details_bn', this.createEditForm.value.details_bn);
      formData.append('details_en', this.createEditForm.value.details_en);
      formData.append('answer_options', JSON.stringify(this.createEditForm.value.answer_options));
      formData.append('sequence', this.createEditForm.value.sequence);
      formData.append('status', this.createEditForm.value.status);

      if (this.imageFile) formData.append('question_image1', this.imageFile);

      this.blockUI.start('Creating...');
      this._service.post('multi-answer-questions', formData).subscribe(
        res => {
          console.log(res)
          this.blockUI.stop();
          this.toastr.success(res.messages, 'Success!', { timeOut: 2000 });
          this.submitted = false;
          this.modalHide();
          this.getList();
          this.getMultiAnsQuestionMaxSequence();
        },
        err => {
          this.modalHide();
          this.blockUI.stop();
        }
      );

    }else{ // update Question -----------------
      this.blockUI.start('Updating...');

      this.answerOptions=[]
      this.createEditForm.value.answer_options.forEach((element)=>{
        //return console.log(index)
        if(element.label){
          this.answerOptions.push(element.label)
        }else{
          this.answerOptions.push(element)
        }
      })
      this.createEditForm.controls['answer_options'].setValue(this.answerOptions);
      

      const obj = {
        class_id: this.createEditForm.value.class_id,
        subject_id: this.createEditForm.value.subject_id,
        topic_id: this.createEditForm.value.topic_id,
        is_provide_exam_sheet: this.createEditForm.value.is_provide_exam_sheet,
        question_bn: this.createEditForm.value.question_bn,
        question_en: this.createEditForm.value.question_en,
        details_bn: this.createEditForm.value.details_bn,
        details_en: this.createEditForm.value.details_en,
        answer_options: JSON.stringify(this.createEditForm.value.answer_options),
    
        id: this.createEditForm.value.id,
        sequence: this.createEditForm.value.sequence,
        status: this.createEditForm.value.status,
      };
  
      this._service.put('multi-answer-questions/'+this.createEditForm.value.id, obj).subscribe(
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

 

  submitDeleteForm(data) {

    this.confirmService.confirm('Are you sure?', 'Do you want to delete the this Mcq Question?')
    .subscribe(
        result => {
            if (result) {
                // delete Mcq Question----------------
              this.blockUI.start('Deleting...');
              this._service.delete('multi-answer-questions/'+data.id).subscribe(
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

    this._service.post('multi-answer-question-image-change', formData).subscribe(
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
