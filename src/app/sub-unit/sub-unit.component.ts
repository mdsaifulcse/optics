import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../_services/common.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Page } from '../_models/page';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';
import 'rxjs/add/operator/debounceTime';
import { ResponseStatus } from '../_models/enum';

@Component({
    selector: 'app-sub-unit',
    templateUrl: './sub-unit.component.html',
    styleUrls: ['./sub-unit.component.scss']
})
export class SubUnitComponent implements OnInit {

    entryForm: FormGroup;
    filterForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    formTitle = 'Create SubUnit';
    btnSaveText = 'Save';

    modalLgConfig: any = { class: 'gray modal-md', backdrop: 'static' };
    modalRef: BsModalRef;

    page = new Page();
    rows = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;

    scrollBarHorizontal: boolean = false;

    constructor(
        public formBuilder: FormBuilder,
        private toastr: ToastrService,
        private confirmService: ConfirmService,
        private _service: CommonService
    ) {
        this.page.pageNumber = 0;
        this.page.size = 10;
        window.onresize = () => {
            this.scrollBarHorizontal = (window.innerWidth < 1200);
        };
    }

    ngOnInit() {
      

        this.filterForm = this.formBuilder.group({
            name: [null],
        });

        this.filterForm.get("name").valueChanges.debounceTime(700).subscribe(() => {
            this.getList();
        })

        this.getList();
    }

    get f() {
        return this.entryForm.controls;
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getList();
    }

    getList() {
        this.loadingIndicator = true;
        const obj = {
            name: this.filterForm.value.name ? this.filterForm.value.name.trim() : null,
            size: this.page.size,
            pageNumber: this.page.pageNumber
        };
        this._service.get('sub-unit/list', obj).subscribe(res => {
            if (res.Status === ResponseStatus.Warning) {
                this.toastr.warning(res.Message, 'Warning!', { closeButton: true, disableTimeOut: false, enableHtml: true });
                return;
              }
              else if (res.Status === ResponseStatus.Error) {
                this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: false, enableHtml: true });
                return;
              }
            this.rows = res.Data.Records;
            this.page.totalElements = res.Data.Total;
            this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
            setTimeout(() => {
                this.loadingIndicator = false;
            }, 1000);
        }, err => {
            this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            setTimeout(() => {
                this.loadingIndicator = false;
            }, 1000);
        }
        );
    }

 


}
