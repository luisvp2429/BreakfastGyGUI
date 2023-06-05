import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';

import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'BreakfastGyG';

  displayedColumns: string[] = ['name', 'description', 'startDateTime', 'endDateTime', 'savory', 'sweet', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog : MatDialog, private api : ApiService){  }
  
  ngOnInit(): void {
    this.getAllBreakfasts();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: "30%"
    }).afterClosed().subscribe(val=>{
      this.getAllBreakfasts();
    })
  }

  getAllBreakfasts(){
  this.api.getBreakfast()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        alert("Error while fetching the breakfast list");
      }
    })
  }

  editBreakfast(row : any){
    this.dialog.open(DialogComponent, {
      width: "30%",
      data:row
    }).afterClosed().subscribe(val=>{
      this.getAllBreakfasts();
    })
  }

  deleteBreakfast(id : string){
    this.api.deleteBreakfast(id)
      .subscribe({
        next:(res)=>{
          alert("Breakfast deleted sucessfully");
          this.getAllBreakfasts();
        },
        error:()=>{
          alert("Error while deleting the breakfast")
        }
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
