import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { SelectHeaderComponent, IGridHeaderSelectableContext } from './select-header.component';

describe('SelectHeaderComponent', () => {
  const initialSelected = false;
  let component: SelectHeaderComponent;
  let fixture: ComponentFixture<SelectHeaderComponent>;
  let params: { context: { componentParent: IGridHeaderSelectableContext } };
  let selected$: BehaviorSubject<boolean>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectHeaderComponent ],
    })
    .compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(SelectHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    selected$ = new BehaviorSubject(initialSelected);
    params = { context: { componentParent: {
      onSelectionChange: jasmine.createSpy('onSelectionChange'),
      selected$,
    } } };
    component.agInit(params as any);
    tick(100);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have initial value: ${initialSelected}`, () => {
    expect(component.selected).toEqual(initialSelected);
  });

  it('should react on selected$ context observable emits value', fakeAsync(() => {
    const oppositeSelectedvalue = !initialSelected;
    selected$.next(oppositeSelectedvalue);
    tick(100);
    expect(component.selected).toEqual(oppositeSelectedvalue);
  }));

  it('should toggle the selected value to opposite', () => {
    const oppositeSelectedvalue = !initialSelected;
    component.toggleCheck();
    expect(component.selected).toEqual(oppositeSelectedvalue);
  });

  it('should call onSelectionChange() context method', () => {
    const oppositeSelectedvalue = !initialSelected;
    const spy = params.context.componentParent.onSelectionChange as any;
    component.toggleCheck();
    expect(spy).toHaveBeenCalled();
    expect(spy.calls.count()).toEqual(1);
    expect(spy).toHaveBeenCalledWith(oppositeSelectedvalue);
  });

  it('should provide valid initial class list', () => {
    expect(component.classList).toEqual('ag-icon ag-icon-checkbox-unchecked');
  });

  it('should provide valid class list after toggleCheck()', () => {
    component.toggleCheck();
    expect(component.classList).toEqual('ag-icon ag-icon-checkbox-checked');
  });
});
