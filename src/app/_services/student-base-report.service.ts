import {Injectable} from '@angular/core';
import { CommonService } from './common.service';
import 'jspdf-autotable';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as moment from 'moment';
import { element } from 'screenfull';

@Injectable()

export class PrintStudentReportService {
  @BlockUI() blockUI: NgBlockUI;
  fontSizes: any = {
    HeadTitleFontSize: 18,
    Head2TitleFontSize: 16,
    TitleFontSize: 14,
    SubTitleFontSize: 10,
    NormalFontSize: 10,
    SmallFontSize: 8
  };

  lineSpacing: any = {
    NormalSpacing: 12
  };

  constructor(
    private _service: CommonService
  ) {}


  printReport(res:any) {
    this.blockUI.start('Generating Report...');
   

      const doc = new jsPDF('p', 'mm', 'a4');
      //Dimension of A4 in mm: 210 × 297
      //Dimension of A4 in pts: 595 × 842
      doc.setProperties({
        title: "Report"
      });


      let rightStartCol1 = 140;
      let rightStartCol2 = 150;

      let InitialstartX = 40;
      let startX = 12;
      let InitialstartY = 10;
      let startY = 10;


    
      doc.line(10, 18, 200, 18);
      doc.setFontSize(this.fontSizes.HeadTitleFontSize);
      doc.setFont("times", "bold");
      doc.text("Report", InitialstartX + 65, (InitialstartY += this.lineSpacing.NormalSpacing + 2), null, "center");
      doc.line(10, 26, 200, 26);


      
      doc.setFontSize(this.fontSizes.SubTitleFontSize);
      doc.setFont("times", "bold");
      doc.text("Student : " + res.student.name_bn, startX + 30, (startY += this.lineSpacing.NormalSpacing + 20), null, 'left');
      
      doc.setFontSize(this.fontSizes.SubTitleFontSize);
      doc.setFont("times", "bold");
      doc.text("Subject : " + res.subject.name_en, (startX + 120), startY , null, 'left');

      doc.setFontSize(this.fontSizes.SubTitleFontSize);
      doc.setFont("times", "bold");
      doc.text("School : " + res.student.school.name_en, startX + 30, startY +=5, null, 'left');
      
      doc.setFontSize(this.fontSizes.SubTitleFontSize);
      doc.setFont("times", "bold");
      doc.text("Class : " + res.student.rel_class.name_en, (startX + 120), startY , null, 'left');
          
  
      let columns = [];  
          columns = [
            { title: 'SL', dataKey: 'index' },
            { title: 'SUBTASK', dataKey: 'subtask' },
            { title: 'RESULT', dataKey: 'result' }
          ];


          let dataArray = [];
          res.exam.forEach((element,i) => {
            let result = null;
            if(element.exam_report){
              result = "("+element.exam_report.obtained_mark+"/"+element.exam_report.total_mark+") "+(element.exam_report.obtained_mark*100)/element.exam_report.total_mark+"%"
            }else{
              result = "N/A";
            }
            dataArray.push({
              index: (i+1),
              subtask: element.name_en,
              result: result
            });

          });

          /** Table */
          // @ts-ignore
          doc.autoTable(columns, dataArray, {
            theme: 'plain',
            startY: startY + 5,
            margin:12,
            columnStyles: {
              SL: { cellWidth: 10 },
              SUBTASK: { cellWidth: 140 },
              RESULT: { cellWidth: 60 }
            },
            styles: {
              font: 'times',
              lineWidth: 0.4,
              overflow: 'linebreak',
              fontSize: 10
            },
            cellPadding: 2

          });



      window.open(URL.createObjectURL(doc.output("blob")));
      this.blockUI.stop();
    
  }


}
