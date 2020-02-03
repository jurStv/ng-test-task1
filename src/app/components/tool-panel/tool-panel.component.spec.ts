import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { ToolPanelComponent, IGridToolPanelContext, IToolPanelStats, TOOL_PANEL_CONTEXT_TOKEN } from './tool-panel.component';

describe('ToolPanelComponent', () => {
  const initialStats: IToolPanelStats = { total: 30, selected: 10, };
  const initialSelectionModeValue = false;
  let component: ToolPanelComponent;
  let fixture: ComponentFixture<ToolPanelComponent>;
  let statsChanges$: BehaviorSubject<IToolPanelStats>;
  let context: IGridToolPanelContext;

  beforeEach(async(() => {
    statsChanges$ = new BehaviorSubject(initialStats);
    context = {
      statsChanges$,
      onSelectionModeChange: jasmine.createSpy('onSelectionModeChange'),
      initialSelectionModeValue,
    };
    TestBed.configureTestingModule({
      declarations: [ ToolPanelComponent ],
      providers: [{
        provide: TOOL_PANEL_CONTEXT_TOKEN,
        useValue: context,
      }],
    })
    .compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(ToolPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.agInit({} as any);
    tick(100);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct initial values', () => {
    expect(component.selectedModeOn).toEqual(initialSelectionModeValue);
    expect(component.stats).toEqual(initialStats);
  });

  it('should toggle the selected value to opposite', () => {
    const oppositeSelectedModevalue = !initialSelectionModeValue;
    component.toggleCheck();
    expect(component.selectedModeOn).toEqual(oppositeSelectedModevalue);
  });

  it('should react on statsChanges$ context observable emits value', fakeAsync(() => {
    const nextStats = { total: 10, selected: 15, };
    statsChanges$.next(nextStats);
    tick(100);
    expect(component.stats).toEqual(nextStats);
  }));

  it('should call onSelectionModeChange() context method', () => {
    const oppositeSelectedModevalue = !initialSelectionModeValue;
    const spy = context.onSelectionModeChange as any;
    component.toggleCheck();
    expect(spy).toHaveBeenCalled();
    expect(spy.calls.count()).toEqual(1);
    expect(spy).toHaveBeenCalledWith(oppositeSelectedModevalue);
  });

  it('should provide valid initial class list', () => {
    expect(component.classList).toEqual('ag-icon ag-icon-checkbox-unchecked');
  });

  it('should provide valid class list after toggleCheck()', () => {
    component.toggleCheck();
    expect(component.classList).toEqual('ag-icon ag-icon-checkbox-checked');
  });
});
