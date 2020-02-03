import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ICellRenderer, ICellRendererParams } from '@ag-grid-community/all-modules';

@Component({
  selector: 'app-link-cell',
  templateUrl: './link-cell.component.html',
  styleUrls: ['./link-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkCellComponent implements OnInit, ICellRenderer {
  public link: string;
  constructor() { }

  ngOnInit() {
  }

  agInit(params: ICellRendererParams) {
    this.link = params.data.title;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
