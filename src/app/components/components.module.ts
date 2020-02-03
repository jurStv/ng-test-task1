import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCellComponent } from './image-cell/image-cell.component';
import { DateCellComponent } from './date-cell/date-cell.component';
import { ToolPanelComponent } from './tool-panel/tool-panel.component';
import { SelectHeaderComponent } from './select-header/select-header.component';

@NgModule({
  declarations: [ImageCellComponent, DateCellComponent, ToolPanelComponent, SelectHeaderComponent],
  imports: [
    CommonModule,
  ],
  exports: [ImageCellComponent, DateCellComponent, ToolPanelComponent, SelectHeaderComponent]
})
export class ComponentsModule { }
