import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSliderModule, MatDividerModule,
  MatListModule,
  MatIconModule,
  MatCardModule } from '@angular/material';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridModule } from 'ag-grid-angular';
import {FormsModule } from '@angular/forms';
import {LayoutModule} from '@angular/cdk/layout';
import { BreakpointObserverService } from './services/breakpoint-observer.service';
import { ToastrModule } from 'ngx-toastr'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LayoutModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    FormsModule,
    AgGridModule.withComponents(),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    GraphQLModule,
    HttpClientModule,
    MatSliderModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    NoopAnimationsModule
  ],
  providers:    [ BreakpointObserverService ],

  bootstrap: [AppComponent]
})
export class AppModule { }
