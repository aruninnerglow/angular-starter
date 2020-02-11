import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, fromEvent, Subscription } from 'rxjs';
import {  DELETE_ITEM_MUTATION, CREATE_ITEM_MUTATION, UPDATE_ITEM_MUTATION, GET_ALL_ITEMS, } from './items.gql';
import { GridOptions, ColDef } from 'ag-grid-community';
import { NgForm } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BreakpointObserverService } from './services/breakpoint-observer.service';
import { AgGridAngular } from 'ag-grid-angular';
import { WindowTypes, GridConfig } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('addUpdateForm', { static: false }) addUpdateForm: NgForm;
  @ViewChild('itemsGrid', { static: false }) itemsGrid: AgGridAngular;


  public size$: Observable<string>;
  windowResizeObservable$: Observable<Event>;
  windowResizeSubscription$: Subscription;
  
  title = 'AngularRX';
  items: any;
  slectedItem: any;
  latestSize: string;
  actionType = 'Add';
  deviceTypes: any;
  columnDefs = [];
  cellRenderers = [
    { headerName: 'EDIT', field: 'edit', cellRenderer: this.editCellRenderer, cellStyle: { 'text-align': 'center' }, width: 80},
    { headerName: 'DELETE', field: 'delete', cellRenderer: this.deleteCellRenderer, cellStyle: { 'text-align': 'center'}, width: 80, },
  ];
  gridOptions: GridOptions;

  constructor(private apollo: Apollo, private breakpointObserver: BreakpointObserver,
              private breakpointservce: BreakpointObserverService) {
    this.size$ = breakpointservce.size$;
    this.deviceTypes = [
      {value: WindowTypes.DESKTOP, label: 'Desktop'},
      {value: WindowTypes.LAPTOP, label: 'Laptop'},
      {value: WindowTypes.TABLETS, label: 'Tablet'},
      {value: WindowTypes.LARGE_PHONE, label: 'Large Phone'},
      {value: WindowTypes.PHONE, label: 'Phone'}
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
        this.initGridColumns(result.data['items']);
      });
  }

  initGridColumns(data: any) {
    this.columnDefs = this.generateColumns(data);
    this.itemsGrid.gridOptions.api.setColumnDefs(this.columnDefs );
    this.showColumnsByWindowSize();
    setTimeout(() => {
      this.columnDefs = [...this.columnDefs, ...this.cellRenderers];
      this.itemsGrid.gridOptions.api.setColumnDefs(this.columnDefs );
      this.itemsGrid.gridOptions.api.sizeColumnsToFit();
     }, 100);
  }

  generateColumns(items: any[]) {
    let columnDefinitions = [];
    // tslint:disable-next-line: forin
    for (const key in items[0]) {
      if (key !== '__typename') {
        const mappedColumn:ColDef = {
          headerName: key.toUpperCase(),
          field: key
        };
        columnDefinitions.push(mappedColumn);
      }
    }
    return columnDefinitions;
  }

  editCellRenderer() {
    const eGui = document.createElement('span');
    const icon = '/assets/icons/edit.png';
    eGui.innerHTML = '<img width="20px" style="cursor: pointer;" src="' + icon + '" />';
    return eGui;
  }

  deleteCellRenderer() {
    const eGui = document.createElement('span');
    const icon = '/assets/icons/delete.png';
    eGui.innerHTML = '<img width="20px" style="cursor: pointer;" src="' + icon + '" />';
    return eGui;
  }

  onAddUpdate(form) {
    if (this.actionType === 'Add') {
      this.apollo.mutate<any>({
        mutation: CREATE_ITEM_MUTATION,
        variables: {
          title: form.value.title,
          price: parseInt(form.value.price),
          description: form.value.description,
          supportDevice: form.value.deviceType,
        },
        refetchQueries: [{
          query: GET_ALL_ITEMS
        }]
      }).subscribe((response) => {
      });
    } else if (this.actionType === 'Update') {
      this.apollo.mutate<any>({
        mutation: UPDATE_ITEM_MUTATION,
        variables: {
          id: this.slectedItem.id,
          title: form.value.title,
          price: parseInt(form.value.price),
          description: form.value.description,
          supportDevice: form.value.deviceType,
        },
        refetchQueries: [{
          query: GET_ALL_ITEMS
        }]
      }).subscribe((response) => {

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

  showColumnsByWindowSize() {
    this.size$.subscribe(value => {
      const columns = this.itemsGrid.gridOptions.columnApi.getAllColumns();
      if (GridConfig[value] !== GridConfig.DESKTOP) {
        let count = 0;
        for (const column of columns) {
          if (count >= GridConfig[value]) {
            if (column.getColId() !== 'edit' && column.getColId() !== 'delete' ) {
              this.itemsGrid.gridOptions.columnApi.setColumnVisible(column, false);
            }
          } else {
            this.itemsGrid.gridOptions.columnApi.setColumnVisible(column, true);
          }
          count++;
        }
      } else {
        for (const column of columns) {
          this.itemsGrid.gridOptions.columnApi.setColumnVisible(column, true);
        }
      }
      setTimeout(() => {
        this.itemsGrid.gridOptions.api.sizeColumnsToFit();
       }, 100);
    });
  }
}
