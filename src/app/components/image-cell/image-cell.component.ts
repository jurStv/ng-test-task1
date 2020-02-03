import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ICellRenderer, ICellRendererParams } from '@ag-grid-community/all-modules';

@Component({
  selector: 'app-image-cell',
  templateUrl: './image-cell.component.html',
  styleUrls: ['./image-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageCellComponent implements OnInit, ICellRenderer {
  public imageUrl: string;

  constructor() {}

  ngOnInit() {
  }

  agInit(params: ICellRendererParams) {
    this.imageUrl = params.data.thumbnailUrl;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

}
