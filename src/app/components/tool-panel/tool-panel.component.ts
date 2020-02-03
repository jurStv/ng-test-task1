import * as R from 'ramda';
import { Component, OnInit, ChangeDetectionStrategy, InjectionToken, Inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {IToolPanel, IToolPanelParams} from '@ag-grid-community/all-modules';
import { Observable } from 'rxjs';
import { untilComponentDestroyed } from 'ng2-rx-componentdestroyed';
import { debounceTime, tap } from 'rxjs/operators';

export const TOOL_PANEL_CONTEXT_TOKEN = new InjectionToken<IGridToolPanelContext>('GridToolPanelContext');

export interface IToolPanelStats {
  total: number;
  selected: number;
}
export interface IGridToolPanelContext {
  statsChanges$: Observable<IToolPanelStats>;
  initialSelectionModeValue: boolean;
  onSelectionModeChange(isOn: boolean): void;
}

@Component({
  selector: 'app-tool-panel',
  templateUrl: './tool-panel.component.html',
  styleUrls: ['./tool-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolPanelComponent implements OnInit, OnDestroy, IToolPanel {
  public selectedModeOn: boolean;
  public stats: IToolPanelStats;

  get classList(): string {
    return R.compose(
      R.concat('ag-icon '),
      R.ifElse(
        R.identity,
        R.always('ag-icon-checkbox-checked'),
        R.always('ag-icon-checkbox-unchecked'),
      ),
    )(this.selectedModeOn);
  }

  constructor(
    @Inject(TOOL_PANEL_CONTEXT_TOKEN) private readonly ctx: IGridToolPanelContext,
    private readonly cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {}

  agInit(params: IToolPanelParams): void {
    this.selectedModeOn = this.ctx.initialSelectionModeValue;
    this.ctx.statsChanges$.pipe(
      untilComponentDestroyed(this),
      debounceTime(100),
      tap((value) => this.stats = value),
      tap(() => this.cd.detectChanges()),
    ).subscribe();
  }

  refresh(): boolean {
    return false;
  }

  toggleCheck() {
    this.selectedModeOn = !this.selectedModeOn;
    this.ctx.onSelectionModeChange(this.selectedModeOn);
  }
}
