import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, fromEvent, Subscription } from 'rxjs';
import {  DELETE_ITEM_MUTATION, CREATE_ITEM_MUTATION, UPDATE_ITEM_MUTATION, GET_ALL_ITEMS, } from './items.gql';
import { GridOptions, ColDef } from 'ag-grid-community';
import { NgForm } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AgGridAngular } from 'ag-grid-angular';
import { GridColumnConfig, SkillRating } from './model';
import { ToastrService } from 'ngx-toastr';
import { MDDGridService } from './services/MDDGrid.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('addUpdateForm', { static: false }) addUpdateForm: NgForm;
  @ViewChild('itemsGrid', { static: false }) itemsGrid: AgGridAngular;
  windowResizeObservable$: Observable<Event>;
  windowResizeSubscription$: Subscription;

  title = 'AngularRX';
  items: any;
  slectedItem: any;
  latestSize: string;
  actionType = 'Add';
  deviceTypes: any;
  columnDefs = [];
  cellRenderers = []
  gridOptions: GridOptions;

  constructor(private apollo: Apollo, private breakpointObserver: BreakpointObserver,
              private mddGridService:MDDGridService,
              private toastrSrv: ToastrService) {

    this.cellRenderers = [
    { headerName: 'EDIT', field: 'edit', cellRenderer: this.mddGridService.getEditCellRenderer, cellStyle: { 'text-align': 'center' }, width: 80},
    { headerName: 'DELETE', field: 'delete', cellRenderer: this.mddGridService.getDeleteCellRenderer, cellStyle: { 'text-align': 'center'}, width: 80, },
    ];
    this.deviceTypes = [
      {value: SkillRating.NOVICE, label: 'Novice'},
      {value: SkillRating.BEGINNER, label: 'Beginner'},
      {value: SkillRating.COMPETENT, label: 'Competent'},
      {value: SkillRating.PROFICIENT, label: 'Proficient'},
      {value: SkillRating.EXPORT, label: 'Export'}
    ];
  }

  ngOnInit() {
    this.getAllItems();
    this.windowResizeObservable$ = fromEvent(window, 'resize');
    this.windowResizeSubscription$ = this.windowResizeObservable$.subscribe( evt => {
      setTimeout(() => {
        this.itemsGrid.gridOptions.api.sizeColumnsToFit();
       }, 100);
    });
  }

  ngOnDestroy() {
    this.windowResizeSubscription$.unsubscribe();
  }

  getAllItems() {
    this.apollo
      .watchQuery({
        query: GET_ALL_ITEMS
      })
      .valueChanges.subscribe(result => {
        this.items = result.data['items'];
        this.initGridColumns(GridColumnConfig.userGrid);
      });
  }

  initGridColumns(data: any) {
    this.columnDefs = data; //this.generateColumns(data);
    this.itemsGrid.gridOptions.api.setColumnDefs(this.columnDefs );
    this.mddGridService.showColumnsByWindowSize(this.itemsGrid);
    setTimeout(() => {
      this.columnDefs = [...this.columnDefs, ...this.cellRenderers];
      this.itemsGrid.gridOptions.api.setColumnDefs(this.columnDefs );
      this.itemsGrid.gridOptions.api.sizeColumnsToFit();
     }, 100);
  }

  onAddUpdate(form) {
    if (this.actionType === 'Add') {
      this.apollo.mutate<any>({
        mutation: CREATE_ITEM_MUTATION,
        variables: {
          title: form.value.title,
          price: form.value.price,
          description: form.value.description,
          supportDevice: form.value.deviceType,
        },
        refetchQueries: [{
          query: GET_ALL_ITEMS
        }]
      }).subscribe((response) => {
        this.toastrSrv.success("Added Successfully");
      });
    } else if (this.actionType === 'Update') {
      this.apollo.mutate<any>({
        mutation: UPDATE_ITEM_MUTATION,
        variables: {
          id: this.slectedItem.id,
          title: form.value.title,
          price: form.value.price,
          description: form.value.description,
          supportDevice: form.value.deviceType,
        },
        refetchQueries: [{
          query: GET_ALL_ITEMS
        }]
      }).subscribe((response) => {
        this.toastrSrv.success("Updated Successfully");

      });
    }
    this.onResetForm();
  }

  onCellClicked(evt) {
    switch (evt.column.colId) {
      case 'delete':
        this.apollo.mutate<any>({
          mutation: DELETE_ITEM_MUTATION,
          variables: {
            id: evt.data.id
          },
          refetchQueries: [{
            query: GET_ALL_ITEMS
          }]
        }).subscribe((response) => {
          this.toastrSrv.success("Deleted Successfully");
        });
        break;
      case 'edit':
        this.slectedItem = evt.data;
        this.addUpdateForm.setValue({
          title: evt.data.title,
          description: evt.data.description,
          price: evt.data.price,
          deviceType: evt.data.supportDevice
        });
        this.actionType = 'Update';
        break;

    }
  }

  onResetForm() {
    this.addUpdateForm.reset();
    this.actionType = 'Add';
  }


}
