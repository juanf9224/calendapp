import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import {CalendarDate} from '../shared/model/calendar-date.model';
import * as fromCalendar from '../store/reducers/calendar.reducer';
import {ICalendar} from '../shared/model/calendar';
import * as calendarActions from '../store/actions/calendar.actions';
import {CalendarState} from '../store/reducers/calendar.reducer';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  currentDate = moment();
  days = moment.weekdays();
  calendar$: Observable<CalendarState>;
  constructor(
    private store: Store<fromCalendar.CalendarState>
  ) { }

  async ngOnInit() {
    this.calendar$ = await this.store.select('calendar');
    // this.calendar$.subscribe(c => console.log(c.entities));
    this.generateCalendar();
  }

  generateCalendar() {
    const dates = this.fillDates(this.currentDate);
    const weeks: CalendarDate[][] = [];
    while (dates.length > 1) {
      weeks.push(dates.splice(0, 7));
    }
    this.store.dispatch(calendarActions.renderCalendar({
      id: 0,
      view: weeks
    }));
  }

  fillDates(currDate: moment.Moment): CalendarDate[] {
    const firstDayOfMonth = moment(currDate).startOf('month').day();
    const firstDayOrfGrid = moment(currDate).startOf('month').subtract(firstDayOfMonth, 'days');
    const start = firstDayOrfGrid.date();
    return _.range(start, start + 42)
      .map((date: number): CalendarDate => {
          const d = moment(firstDayOrfGrid).date(date);
          return {
            id: d.date(),
            date: d
          };
      });
  }
}
