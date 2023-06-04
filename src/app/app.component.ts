import { Component } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BreakfastGyG';

  constructor(private dialog : MatDialog){}
  
  BreakfastList:any=[];
  breakf: any;

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: "30%"
    });

    this.breakf={
      Name:"",
      Description:"",
      StartDateTime:"",
      EndDateTime:"",
      Savory:[],
      Sweet:[]
    }
  }


}
