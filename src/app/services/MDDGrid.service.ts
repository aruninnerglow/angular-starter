import { Injectable } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridConfig } from '../model';
import { BreakpointObserverService } from './breakpoint-observer.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MDDGridService {

  public size$: Observable<string>;

  constructor(private breakpointservce: BreakpointObserverService,) { 
    this.size$ = breakpointservce.size$;
  }

  public showColumnsByWindowSize(gridRef:AgGridAngular) {
    this.size$.subscribe(value => {
      const columns = gridRef.gridOptions.columnApi.getAllColumns();
      if (GridConfig[value] !== GridConfig.DESKTOP) {
        let count = 0;
        for (const column of columns) {
          if (count >= GridConfig[value]) {
            if (column.getColId() !== 'edit' && column.getColId() !== 'delete' ) {
              gridRef.gridOptions.columnApi.setColumnVisible(column, false);
            }
          } else {
            gridRef.gridOptions.columnApi.setColumnVisible(column, true);
          }
          count++;
        }
      } else {
        for (const column of columns) {
          gridRef.gridOptions.columnApi.setColumnVisible(column, true);
        }
      }
      setTimeout(() => {
        gridRef.gridOptions.api.sizeColumnsToFit();
       }, 100);
    });
  }

  public getEditCellRenderer() {
    const eGui = document.createElement('span');
    const icon = '/assets/icons/edit.png';
    eGui.innerHTML = '<img width="20px" style="cursor: pointer;" src="' + icon + '" />';
    return eGui;
  }

  public getDeleteCellRenderer() {
    const eGui = document.createElement('span');
    const icon = '/assets/icons/delete.png';
    eGui.innerHTML = '<img width="20px" style="cursor: pointer;" src="' + icon + '" />';
    return eGui;
  }

}