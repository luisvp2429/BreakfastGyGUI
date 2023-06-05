import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder, ValidatorFn, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {COMMA, E, ENTER, T} from '@angular/cdk/keycodes';
import {MatChipEditInput, MatChipEditedEvent, MatChipGrid, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {NgFor, formatDate} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import { DialogRef } from '@angular/cdk/dialog';
import { inject } from '@angular/core/testing';
import { EmptyExpr } from '@angular/compiler';

import { DatePipe } from '@angular/common';

export interface Savory {
  name: string;
}

export interface Sweet {
  name: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  breakfastForm !: FormGroup;
  actionButton : string = "Save";

  constructor(
    private formBuilder : FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private api : ApiService, 
    public datepipe: DatePipe,
    private dialogRef : DialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.breakfastForm = this.formBuilder.group ({
      name : ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description : ['', [Validators.required, Validators.minLength(50), Validators.maxLength(150)]],
      date : ['', Validators.required],
      startTime : ['', Validators.required],
      endTime : ['', Validators.required],
      savorys : ['', Validators.required],
      sweets : ['', Validators.required]
    });

    //function to set the end time not greater than start time
    this.breakfastForm.controls['endTime'].valueChanges.subscribe(
      (value: number) => {
        const startDate: Date = this.breakfastForm?.controls['startTime'].value;
        const endDate: Date = this.breakfastForm?.controls['endTime'].value;
      
        if (!startDate || !endDate) {
          return null;
        }
        if (startDate.getHours == endDate.getHours) {
          if(startDate.getMinutes >= endDate.getMinutes){
            this.breakfastForm?.controls['endTime'].setValue(EmptyExpr);
            return;
          }
        }
        else if(startDate.getHours >= endDate.getHours){
          this.breakfastForm?.controls['endTime'].setValue(EmptyExpr);
          return;
        }
        return null;
      }
    ); 

    if(this.editData){
      this.actionButton = "Update";
      this.breakfastForm.controls['name'].setValue(this.editData.name);      
      this.breakfastForm.controls['description'].setValue(this.editData.description);
      this.breakfastForm.controls['date'].setValue(this.editData.startDateTime);

      this.breakfastForm.controls['startTime'].setValue(this.getTimeAsString(this.editData.startDateTime));
      this.breakfastForm.controls['endTime'].setValue(this.getTimeAsString(this.editData.endDateTime));

      this.editData.savory.forEach((item: any) => {
        this.savorys.push({name: item});        
      });

      this.editData.sweet.forEach((item: any) => {
        this.sweets.push({name: item});
      });
    }
  }

  addEditBreakfast(){
    if(!this.editData){
      if(this.breakfastForm.valid){
      
        const startDateTime = this.setDateTime(this.breakfastForm.value.startTime, this.breakfastForm.value.date);
        const endDateTime = this.setDateTime(this.breakfastForm.value.endTime, this.breakfastForm.value.date);

        const savoryArray = this.savorys.map(function (obj) {
          return obj.name;
        });

        const sweetArray = this.sweets.map(function (obj) {
          return obj.name;
        });

        var val = {
          "name": this.breakfastForm.value.name,
          "description": this.breakfastForm.value.description,
          "startDateTime": startDateTime,
          "endDateTime": endDateTime,
          "savory": savoryArray,
          "sweet": sweetArray
        }

        this.api.postBreakfast(val)
        .subscribe({
          next:(res)=>{
            alert("Breakfast added successfully");
            this.breakfastForm.reset();
            this.dialogRef.close();
          },
          error:()=>{
            alert("Error while adding the breakfast");
          }
        })
      }
    }
    else{
      this.updateBreakfast();
    }
  }

  updateBreakfast(){

    const startDateTime = this.setDateTime(this.breakfastForm.value.startTime, this.breakfastForm.value.date);
    const endDateTime = this.setDateTime(this.breakfastForm.value.endTime, this.breakfastForm.value.date);
    
    const formattedStartDate = this.datepipe.transform(startDateTime,'YYYY-MM-ddTHH:mm:ss');
    const formattedEndDate = this.datepipe.transform(endDateTime,'YYYY-MM-ddTHH:mm:ss');

    const savoryArray = this.savorys.map(function (obj) {
      return obj.name;
    });

    const sweetArray = this.sweets.map(function (obj) {
      return obj.name;
    });

    var val = {
      "name": this.breakfastForm.value.name,
      "description": this.breakfastForm.value.description,
      "startDateTime": formattedStartDate,
      "endDateTime": formattedEndDate,
      "savory": savoryArray,
      "sweet": sweetArray
    }

    this.api.updateBreakfast(val, this.editData.id)
      .subscribe({
        next:(res)=>{
          alert("Breakfast updated successfully");
          this.breakfastForm.reset();
          this.dialogRef.close();
        },
        error:()=>{
          alert("Error while updating the breakfast");
        }
      });
  }

  //#region DateTime format
  //function to set the values to the form dialog for editing
  getTimeAsString(time: string) {
    time = time.split("T")[1];
    const hours = time.split(":")[0];
    const minutes = time.split(":")[1];
    const t = hours + ":" + minutes;
    return t;
  }

  //function to set the dateTime with both inputs
  setDateTime(time: { split: (arg0: string) => number[]; }, date: Date){    
    const d = new Date(date); 
    d.setHours(time.split(':')[0]);
    d.setMinutes(time.split(':')[1]);
    return d;
  }
  //#endregion

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  savorys: Savory[] = [];
  sweets: Sweet[] = [];

  //#region add elements
  addSavory(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our savory
    if (value) {
      this.savorys.push({name: value});
    }
    // Clear the input value
    event.chipInput!.clear();
  }
  addSweet(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our sweet
    if (value) {
      this.sweets.push({name: value});
    }
    // Clear the input value
    event.chipInput!.clear();
  }
  //#endregion

  //#region remove elements
  removeSavory(savory: Savory): void {
    const index = this.savorys.indexOf(savory);

    if (index >= 0) {
      this.savorys.splice(index, 1);
    }
  }

  removeSweet(sweet: Sweet): void {
    const index = this.sweets.indexOf(sweet);

    if (index >= 0) {
      this.sweets.splice(index, 1);
    }
  }
  //#endregion

  //#region edit elements
  editSavory(savory: Savory, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove savory if it no longer has a name
    if (!value) {
      this.removeSavory(savory);
      return;
    }

    // Edit existing savory
    const index = this.savorys.indexOf(savory);
    if (index >= 0) {
      this.savorys[index].name = value;
    }
  }

  editSweet(sweet: Sweet, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove sweet if it no longer has a name
    if (!value) {
      this.removeSweet(sweet);
      return;
    }

    // Edit existing sweet
    const index = this.sweets.indexOf(sweet);
    if (index >= 0) {
      this.sweets[index].name = value;
    }
  }
  //#endregion
}

