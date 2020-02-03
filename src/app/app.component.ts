import * as R from 'ramda';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AgGridAngular } from '@ag-grid-community/angular';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { Observable, BehaviorSubject } from 'rxjs';
import { startWith, switchMap, debounceTime, distinctUntilChanged, pluck, map } from 'rxjs/operators';

import { YoutubeService } from './services';
import { INITIAL_SEARCH_VALUE, YOUTUBE_WATCH_URL, INITIAL_SELCTION_VALUE, INITIAL_SELCTION_MODE_ON_VALUE } from './app.constants';
import { SearchResult } from './interfaces';
import {
  ImageCellComponent, DateCellComponent, ToolPanelComponent,
  SelectHeaderComponent, IGridHeaderSelectableContext, IGridToolPanelContext,
  TOOL_PANEL_CONTEXT_TOKEN,
} from './components';

const SEARCH_VALUE_DEBOUNCE_TIME = 300; // ms

interface IVideoGridRowItem {
  videoId: string;
  thumbnailUrl: string;
  publishedAt: string;
  title: string;
  description: string;
}

const toVideoGridRowItem = (item: SearchResult): IVideoGridRowItem => ({
  videoId: R.path(['id', 'videoId'], item),
  thumbnailUrl: R.path(['snippet', 'thumbnails', 'default', 'url'], item),
  publishedAt: R.path(['snippet', 'publishedAt'], item),
  //  “Video Title” column content should be the link to the video on YouTube
  title: R.compose(
    R.concat(YOUTUBE_WATCH_URL),
    R.path(['id', 'videoId']),
  )(item),
  description: R.path(['snippet', 'description'], item),
});

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [{ provide: TOOL_PANEL_CONTEXT_TOKEN, useExisting: AppComponent }],
})
export class AppComponent implements OnInit, IGridHeaderSelectableContext, IGridToolPanelContext {
  @ViewChild('agGrid', { static: true }) private agGrid: AgGridAngular;

  public searchControl = new FormControl(INITIAL_SEARCH_VALUE);
  public columnDefs = [
    {
      headerName: '',
      colId: 'selected',
      headerComponent: 'selectHeaderRenderer',
      checkboxSelection: true,
      width: 30,
      hide: !INITIAL_SELCTION_MODE_ON_VALUE,
      suppressMenu: true,
    },
    { headerName: 'Video Title', field: 'title', colId: 'title' },
    { headerName: 'Description', field: 'description', colId: 'description', suppressMenu: true, },
    { headerName: '', field: 'thumbnailUrl', cellRenderer: 'imageRenderer', colId: 'thumbnail', suppressMenu: true,},
    {
      headerName: 'Published on',
      field: 'publishedAt',
      sortable: true,
      cellRenderer: 'dateRenderer',
      colId: 'publishedAt',
      suppressMenu: true,
    },
  ];
  public rowData: Observable<IVideoGridRowItem[]>;
  public frameworkComponents;
  public context;
  public sideBar;
  public rowSelection;
  public modules = AllModules;
  public selected$ = new BehaviorSubject<boolean>(INITIAL_SELCTION_VALUE);
  public statsChanges$ = new BehaviorSubject({ total: 0, selected: 0 });
  public initialSelectionModeValue = INITIAL_SELCTION_MODE_ON_VALUE;
  public icons = { 'custom-tools': '<span class="ag-icon ag-icon-custom-tools"></span>' };

  constructor(
    private readonly youtube: YoutubeService,
  ) {}

  ngOnInit() {
    this.rowData = this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
      debounceTime(SEARCH_VALUE_DEBOUNCE_TIME),
      distinctUntilChanged(),
      switchMap((query) => this.youtube.searchVideos(query)),
      pluck('items'),
      map<SearchResult[], IVideoGridRowItem[]>(R.map(toVideoGridRowItem)),
    );
    this.frameworkComponents = {
      imageRenderer: ImageCellComponent,
      dateRenderer: DateCellComponent,
      toolPanel: ToolPanelComponent,
      selectHeaderRenderer: SelectHeaderComponent,
    };
    this.context = { componentParent: this };
    this.sideBar = {
      toolPanels: [
        {
          id: 'customTools',
          labelDefault: 'Custom Tools',
          labelKey: 'customTools',
          iconKey: 'custom-tools',
          toolPanel: 'toolPanel'
        }
      ],
      defaultToolPanel: 'toolPanel'
    };
    this.rowSelection = 'multiple';
  }

  getContextMenuItems(params) {
    const colId = R.path(['column', 'colId'], params);
    const defaultMenu: any[] = [
      'copy',
      'copyWithHeaders',
      'paste',
    ];
    const openNewTabOption = {
      name: 'Open in new tab',
      action() {
        const link = document.createElement('a');
        link.href = params.value;
        link.target = '_blank';
        link.click();
      }
    };
    return R.ifElse(
      R.equals('title'),
      R.always(defaultMenu.concat([openNewTabOption])),
      R.always(defaultMenu),
    )(colId);
  }

  onGridReady(props) {
    this.agGrid.api.sizeColumnsToFit();
  }

  // TODO: refactor method fires for each row change,
  // for agGrid.api.selectAll() call it will call 50 times if grid has 50 rows
  onRowSelected(event: any) {
    this.updateSelectionCheck();
    this.updateRowsStats();
  }

  onSelectionChange(isSelected: boolean) {
    if (isSelected) {
      this.agGrid.api.selectAll();
    } else {
      this.agGrid.api.deselectAll();
    }
    this.updateRowsStats();
  }

  onSelectionModeChange(isOn: boolean) {
    this.agGrid.columnApi.setColumnVisible('selected', isOn);
    if (!isOn) {
      this.agGrid.api.deselectAll();
      this.updateRowsStats();
    }
  }

  onModelUpdated() {
    this.updateSelectionCheck();
    this.updateRowsStats();
  }

  private updateRowsStats() {
    const { total, selected } = this.getRowStats();
    this.statsChanges$.next({ total, selected });
  }

  private updateSelectionCheck() {
    const { total, selected } = this.getRowStats();
    const allSelected = total === selected;
    this.selected$.next(allSelected);
  }

  private getRowStats() {
    const { length: selected } = this.agGrid.api.getSelectedRows();
    const total = this.agGrid.api.getModel().getRowCount();

    return { selected, total };
  }
}
