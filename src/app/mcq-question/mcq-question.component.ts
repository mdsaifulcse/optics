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
  selector: "app-mcq-question",
  templateUrl: "./mcq-question.component.html",
  styleUrls: ["./mcq-question.component.scss"],
})
export class McqQuestionComponent implements OnInit {
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
  isInitalBalanceGiven: boolean = true;

  images: Array<any> = [];
  provideExamSheet = [{ status: 1, name: "Yes" }, { status: 0, name: "No" }]
  status = [{ status: 'Active', name: "Active" }, { status: "Inactive", name: "Inactive" }]

  mcqQuestions=[];
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
      answer_hint: [null],
      question_bn: [null],
      question_en: [null],
      details_bn: [null],
      details_en: [null],
      option1:  [null, [Validators.required]],
      option1_mark:  [0, [Validators.required]],
      option2:  [null, [Validators.required]],
      option2_mark:  [0, [Validators.required]],
      option3:  [null],
      option3_mark:  [0],
      option4:  [null],
      option4_mark:  [0],
      option5:  [null],
      option5_mark:  [0],
      option6:  [null],
      option6_mark:  [0],
      correct_option:  [null],
      sequence:  [null, [Validators.required]],
      is_provide_exam_sheet: [null,[Validators.required]],
      status: ['Active',[Validators.required]]
      //mobile_number: [{value:null,disable:true}]
    });

    this.questionShowForm = this.formBuilder.group({
      id: [null],
      class_id: [null, [Validators.required]],
      subject_id: [null, [Validators.required]],
      topic_id: [null, [Validators.required]],
      answer_hint: [null],
      question_bn: [null],
      question_en: [null],
      details_bn: [null],
      details_en: [null],
      option1:  [null, [Validators.required]],
      option1_mark:  [0, [Validators.required]],
      option2:  [null, [Validators.required]],
      option2_mark:  [0, [Validators.required]],
      option3:  [null],
      option3_mark:  [0],
      option4:  [null],
      option4_mark:  [0],
      option5:  [null],
      option5_mark:  [0],
      option6:  [null],
      option6_mark:  [0],
      correct_option:  [null],
      sequence:  [null, [Validators.required]],
      is_provide_exam_sheet: [null,[Validators.required]],
      status: ['Active',[Validators.required]]
      //mobile_number: [{value:null,disable:true}]
    });

    this.isProvideExamSheet=0
    this.getList();
    this.getClasses();
    this.getMcqQuestionMaxSequence();
    
  }

  get f() {
    return this.createEditForm.controls;
  }


  getList() {
    this.loadingIndicator = true;
    this._service.get("mcq-questions").subscribe(
      (res) => {
        console.log(res.result)
        this.mcqQuestions= res.result;
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

  getMcqQuestionMaxSequence() {
    this.loadingIndicator = true;
    this._service.get("mcq-question-max-sequence").subscribe(
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
    this.isProvideExamSheet=0;
    this.imageUrl=null;
    this.modalTitle='Create new MCQ Question';
    this.btnSaveText='Save';
    // this.createEditForm.controls['option1_mark'].setValue(0);
    // this.createEditForm.controls['option2_mark'].setValue(0);
    this.createEditForm.controls['option3_mark'].setValue(0);
    this.createEditForm.controls['option4_mark'].setValue(0);
    this.createEditForm.controls['option5_mark'].setValue(0);
    this.createEditForm.controls['option6_mark'].setValue(0);
    this.createEditForm.controls['status'].setValue('Active');
    this.createEditForm.controls['sequence'].setValue(this.sequence);
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }


  openUpdateModal(template: TemplateRef<any>, data) {
    this.createEditForm.reset();
    this.isProvideExamSheet=data.is_provide_exam_sheet;
    this.modalTitle='Update MCQ Question Details';
    this.btnSaveText='Update MCQ Question';

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
    this.createEditForm.controls['answer_hint'].setValue(data.answer_hint);
    this.createEditForm.controls['question_bn'].setValue(data.question_bn);
    this.createEditForm.controls['question_en'].setValue(data.question_en);
    this.createEditForm.controls['details_bn'].setValue(data.details_bn);
    this.createEditForm.controls['details_en'].setValue(data.details_en);

    this.createEditForm.controls['option1'].setValue(data.option1);
    this.createEditForm.controls['option2'].setValue(data.option2);
    this.createEditForm.controls['option3'].setValue(data.option3);
    this.createEditForm.controls['option4'].setValue(data.option4);
    this.createEditForm.controls['option5'].setValue(data.option5);
    this.createEditForm.controls['option6'].setValue(data.option6);

    this.createEditForm.controls['option1_mark'].setValue(data.option1_mark);
    this.createEditForm.controls['option2_mark'].setValue(data.option2_mark);
    this.createEditForm.controls['option3_mark'].setValue(data.option3_mark);
    this.createEditForm.controls['option4_mark'].setValue(data.option4_mark);
    this.createEditForm.controls['option5_mark'].setValue(data.option5_mark);
    this.createEditForm.controls['option6_mark'].setValue(data.option6_mark);

    this.createEditForm.controls['correct_option'].setValue(data.correct_option);
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
    this.questionShowForm.controls['answer_hint'].setValue(data.answer_hint);
    this.questionShowForm.controls['answer_hint'].disable();
    this.questionShowForm.controls['question_bn'].setValue(data.question_bn);
    this.questionShowForm.controls['question_bn'].disable();
    this.questionShowForm.controls['question_en'].setValue(data.question_en);
    this.questionShowForm.controls['question_en'].disable();
    this.questionShowForm.controls['details_bn'].setValue(data.details_bn);
    this.questionShowForm.controls['details_bn'].disable();
    this.questionShowForm.controls['details_en'].setValue(data.details_en);
    this.questionShowForm.controls['details_en'].disable();

    this.questionShowForm.controls['option1'].setValue(data.option1);
    this.questionShowForm.controls['option1'].disable();
    this.questionShowForm.controls['option2'].setValue(data.option2);
    this.questionShowForm.controls['option2'].disable();
    this.questionShowForm.controls['option3'].setValue(data.option3);
    this.questionShowForm.controls['option3'].disable();
    this.questionShowForm.controls['option4'].setValue(data.option4);
    this.questionShowForm.controls['option4'].disable();
    this.questionShowForm.controls['option5'].setValue(data.option5);
    this.questionShowForm.controls['option5'].disable();
    this.questionShowForm.controls['option6'].setValue(data.option6);
    this.questionShowForm.controls['option6'].disable();

    this.questionShowForm.controls['option1_mark'].setValue(data.option1_mark);
    this.questionShowForm.controls['option1_mark'].disable();
    this.questionShowForm.controls['option2_mark'].setValue(data.option2_mark);
    this.questionShowForm.controls['option2_mark'].disable();
    this.questionShowForm.controls['option3_mark'].setValue(data.option3_mark);
    this.questionShowForm.controls['option3_mark'].disable();
    this.questionShowForm.controls['option4_mark'].setValue(data.option4_mark);
    this.questionShowForm.controls['option4_mark'].disable();
    this.questionShowForm.controls['option5_mark'].setValue(data.option5_mark);
    this.questionShowForm.controls['option5_mark'].disable();
    this.questionShowForm.controls['option6_mark'].setValue(data.option6_mark);
    this.questionShowForm.controls['option6_mark'].disable();

    this.questionShowForm.controls['correct_option'].setValue(data.correct_option);
    this.questionShowForm.controls['correct_option'].disable();
    
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
    
    if(!this.createEditForm.value.correct_option){
      return this.toastr.error('Correct option is reqired', 'Error!', { timeOut: 2000 });
     }else{
      
       const optionName=this.createEditForm.value.correct_option;

      if(optionName=='option1' && this.createEditForm.value.option1==null){
        return this.toastr.error(optionName+' can not be null ', 'Error!', { timeOut: 2000 });
      }else if(optionName=='option2' && this.createEditForm.value.option2==null){
        return this.toastr.error(optionName+' can not be null ', 'Error!', { timeOut: 2000 });
      }else if(optionName=='option3' && this.createEditForm.value.option3==null){
        return this.toastr.error(optionName+' can not be null ', 'Error!', { timeOut: 2000 });
      }else if(optionName=='option4' && this.createEditForm.value.option4==null){
        return this.toastr.error(optionName+' can not be null ', 'Error!', { timeOut: 2000 });
      }else if(optionName=='option5' && this.createEditForm.value.option5==null){
        return this.toastr.error(optionName+' can not be null ', 'Error!', { timeOut: 2000 });
      }else if(optionName=='option6' && this.createEditForm.value.option6==null){
        return this.toastr.error(optionName+' can not be null ', 'Error!', { timeOut: 2000 });
      }
       console.log(this.createEditForm.value)

      // if(!this.createEditForm.value+'.'+optionName){
      //   return this.toastr.error(optionName+' can not be null ', 'Error!', { timeOut: 2000 });
      //  }
     }
    

    if(!this.createEditForm.value.id){ // create new MCQ Question ----------------
      let formData = new FormData();

      formData.append('class_id', this.createEditForm.value.class_id)
      formData.append('subject_id', this.createEditForm.value.subject_id)
      formData.append('topic_id', this.createEditForm.value.topic_id)
      formData.append('is_provide_exam_sheet', this.createEditForm.value.is_provide_exam_sheet)
      formData.append('answer_hint', this.createEditForm.value.answer_hint)
      formData.append('question_bn', this.createEditForm.value.question_bn)
      formData.append('question_en', this.createEditForm.value.question_en)
      formData.append('details_bn', this.createEditForm.value.details_bn)
      formData.append('details_en', this.createEditForm.value.details_en)

      formData.append('option1', this.createEditForm.value.option1)
      formData.append('option1_mark', this.createEditForm.value.option1_mark)

      formData.append('option2', this.createEditForm.value.option2)
      formData.append('option2_mark', this.createEditForm.value.option2_mark)

      formData.append('option3', this.createEditForm.value.option3)
      formData.append('option3_mark', this.createEditForm.value.option3_mark)

      formData.append('option4', this.createEditForm.value.option4)
      formData.append('option4_mark', this.createEditForm.value.option4_mark)

      formData.append('option5', this.createEditForm.value.option5)
      formData.append('option5_mark', this.createEditForm.value.option5_mark)

      formData.append('option6', this.createEditForm.value.option6)
      formData.append('option6_mark', this.createEditForm.value.option6_mark)

      formData.append('correct_option', this.createEditForm.value.correct_option)
      formData.append('sequence', this.createEditForm.value.sequence)
      formData.append('status', this.createEditForm.value.status)

      if (this.imageFile) formData.append('question_image1', this.imageFile)
      
      this.blockUI.start('Creating...');
      this._service.post('mcq-questions', formData).subscribe(
        res => {
          this.blockUI.stop();
          this.toastr.success(res.messages, 'Success!', { timeOut: 2000 });
          this.submitted = false;
          this.modalHide();
          this.getList();
          this.getMcqQuestionMaxSequence();
        },
        err => {
          this.blockUI.stop();
        }
      );

    }else{ // update MCQ Question -----------------
      this.blockUI.start('Updating...');

      const obj = {
        class_id: this.createEditForm.value.class_id,
        subject_id: this.createEditForm.value.subject_id,
        topic_id: this.createEditForm.value.topic_id,
        is_provide_exam_sheet: this.createEditForm.value.is_provide_exam_sheet,
        answer_hint: this.createEditForm.value.answer_hint,
        question_bn: this.createEditForm.value.question_bn,
        question_en: this.createEditForm.value.question_en,
        details_bn: this.createEditForm.value.details_bn,
        details_en: this.createEditForm.value.details_en,
        option1: this.createEditForm.value.option1,
        option2: this.createEditForm.value.option2,
        option3: this.createEditForm.value.option3,
        option4: this.createEditForm.value.option4,
        option5: this.createEditForm.value.option5,
        option6: this.createEditForm.value.option6,

        option1_mark: this.createEditForm.value.option1_mark,
        option2_mark: this.createEditForm.value.option2_mark,
        option3_mark: this.createEditForm.value.option3_mark,
        option4_mark: this.createEditForm.value.option4_mark,
        option5_mark: this.createEditForm.value.option5_mark,
        option6_mark: this.createEditForm.value.option6_mark,

        correct_option: this.createEditForm.value.correct_option,
        correct_option_mark: this.createEditForm.value.correct_option_mark,

        id: this.createEditForm.value.id,
        sequence: this.createEditForm.value.sequence,
        status: this.createEditForm.value.status,
      };
  
      this._service.put('mcq-questions/'+this.createEditForm.value.id, obj).subscribe(
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
