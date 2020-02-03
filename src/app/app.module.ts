import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AgGridModule } from '@ag-grid-community/angular';

import { environment, Environment } from '@app/env';

import { YoutubeService } from './services';
import { AppComponent } from './app.component';
import { ComponentsModule, ImageCellComponent, DateCellComponent, ToolPanelComponent, SelectHeaderComponent } from './components';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([ImageCellComponent, DateCellComponent, ToolPanelComponent, SelectHeaderComponent]),
    ComponentsModule,
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    YoutubeService,
    {
      provide: Environment,
      useValue: environment,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
