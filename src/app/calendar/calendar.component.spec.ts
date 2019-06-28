import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {Store, StoreModule} from '@ngrx/store';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import * as moment from 'moment';
import { cold } from 'jasmine-marbles';

import { CalendarComponent } from './calendar.component';
import * as fromCalendar from '../store/reducers/calendar.reducer';
import * as calendarActions from '../store/actions/calendar.actions';
import {MatDialogModule} from '@angular/material';
import {ReminderService} from '../shared/service/reminder.service';


describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let store: Store<fromCalendar.CalendarState>;
  let reminderService: ReminderService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
            ...fromCalendar.reducer
          }
        ),
        MatDialogModule
      ],
      providers: [ReminderService],
      declarations: [ CalendarComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    reminderService = fixture.debugElement.injector.get(ReminderService);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate a calendar',  () => {
    component.generateCalendar();
    const calendarState = store.select('calendar');
    calendarState.subscribe(c => {
      expect(c.ids.length).toBe(42);
    });
  });

  it('should add a reminder to a date on calendar', async () => {
    component.ngOnInit();
    const curDate = moment();
    const reminder = {
      id: 0,
      date: curDate,
      time: '11:50',
      description: 'go to bed',
      color: '#fff',
      city: 'Santo Domingo, DO'
    };
    const date = {
      id: 0,
      date: curDate,
      reminder: []
    };
    component.calendar = [date];
    reminderService.reminder = reminder;
    component.addReminderToCalendar();
    expect(store.dispatch).toHaveBeenCalledWith(calendarActions.addReminderToCalendar(date));
  });
});
