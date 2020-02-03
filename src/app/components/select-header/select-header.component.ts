import * as R from 'ramda';
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, debounceTime } from 'rxjs/operators';
import { untilComponentDestroyed } from 'ng2-rx-componentdestroyed';
import { ICellRenderer, ICellRendererParams } from '@ag-grid-community/all-modules';

export interface IGridHeaderSelectableContext {
  selected$: Observable<boolean>;
  onSelectionChange(isSelected: boolean): void;
}

@Component({
  selector: 'app-select-header',
  templateUrl: './select-header.component.html',
  styleUrls: ['./select-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectHeaderComponent implements OnInit, OnDestroy, ICellRenderer {
  private context: IGridHeaderSelectableContext;
  private selected: boolean;

  get classList(): string {
    return R.compose(
      R.concat('ag-icon '),
      R.ifElse(
        R.identity,
        R.always('ag-icon-checkbox-checked'),
        R.always('ag-icon-checkbox-unchecked'),
      ),
    )(this.selected);
  }

  constructor(private readonly cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngOnDestroy() {}

  agInit(params: ICellRendererParams): void {
    this.context = params.context.componentParent;
    this.context.selected$.pipe(
      untilComponentDestroyed(this),
      debounceTime(100),
      tap((value) => this.selected = value),
      tap(() => this.cd.detectChanges()),
    ).subscribe();
  }

  refresh() {
    return false;
  }

  toggleCheck() {
    this.selected = !this.selected;
    this.context.onSelectionChange(this.selected);
  }
}
