import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import {select, Store} from '@ngrx/store';

import {CalendarDate} from '../shared/model/calendar-date.model';
import * as fromCalendar from '../store/reducers/calendar.reducer';
import * as calendarActions from '../store/actions/calendar.actions';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  currentDate = moment();
  days = moment.weekdays();
  calendar: CalendarDate[] = [];
  constructor(
    private store: Store<fromCalendar.CalendarState>
  ) { }

  ngOnInit() {
    this.store.pipe(select('calendar')).subscribe((c: fromCalendar.CalendarState) => {
      console.log(c);
      if (c.ids.length > 0 && c) {
        c.ids.forEach( i => this.calendar.push(c.entities[i.toString()]));
      } else {
        this.generateCalendar();
      }
      console.log('calendar: ', this.calendar);
    });
  }

  generateCalendar() {
    const dates = this.fillDates(this.currentDate);
    console.log(dates.slice());
    // const weeks: CalendarDate[][] = [];
    // while (dates.length > 1) {
    //   weeks.push(dates.splice(0, 7));
    // }
    this.store.dispatch(calendarActions.renderCalendar({ dates }));
  }

  fillDates(currDate: moment.Moment): CalendarDate[] {
    const firstDayOfMonth = moment(currDate).startOf('month').day();
    const firstDayOrfGrid = moment(currDate).startOf('month').subtract(firstDayOfMonth, 'days');
    const start = firstDayOrfGrid.date();
    return _.range(start, start + 42)
      .map((date: number, idx: number): CalendarDate => {
          const d = moment(firstDayOrfGrid).date(date);
          return {
            id: idx,
            date: d
          };
      });
  }
}
