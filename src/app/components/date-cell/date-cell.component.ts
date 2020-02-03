import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ICellRenderer, ICellRendererParams } from '@ag-grid-community/all-modules';

@Component({
  selector: 'app-date-cell',
  templateUrl: './date-cell.component.html',
  styleUrls: ['./date-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateCellComponent implements OnInit, ICellRenderer {
  public date: string;

  constructor() { }

  ngOnInit() {
  }

  agInit(params: ICellRendererParams) {
    this.date = params.data.publishedAt;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

}
