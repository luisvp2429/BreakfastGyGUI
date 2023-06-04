import { Component, OnInit, Input } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {NgFor} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';

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

  constructor(private formBuilder : FormBuilder, private api : ApiService) { }

  ngOnInit(): void{
    this.breakfastForm = this.formBuilder.group ({
      breakfastName : ['', Validators.required],
      description : ['', Validators.required],
      date : ['', Validators.required],
      startTime : ['', Validators.required],
      endTime : ['', Validators.required],
      savory : ['', Validators.required],
      sweet : ['', Validators.required]
    })
  }

  addBreakfast(){
    if(this.breakfastForm.valid){
      
      const startDateTime = this.setDateTime(this.breakfastForm.value.startTime, this.breakfastForm.value.date);
      const endDateTime = this.setDateTime(this.breakfastForm.value.endTime, this.breakfastForm.value.date);

      var val = {
        "name": this.breakfastForm.value.breakfastName,
        "description": this.breakfastForm.value.description,
        "startDateTime": startDateTime,
        "endDateTime": endDateTime,
        "savory": ["apple", "apple2"], //[this.savorys],
        "sweet": ["apple", "apple2"]//
      }
      console.log(val);
      /* this.api.postBreakfast(val)
      .subscribe({
        next:(res)=>{
          alert("Breakfast added successfully")
        },
        error:()=>{
          alert("Error while adding the breakfast")
        }
      })  */
    }
  }

  //function to set the dateTime with both inputs
  setDateTime(time: { split: (arg0: string) => number[]; }, date: Date){
    const d = new Date(date);
    d.setHours(time.split(':')[0]);
    d.setMinutes(time.split(':')[1]);
    return d;
  }

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
