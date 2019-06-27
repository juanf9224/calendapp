import * as moment from 'moment';

export interface IReminder {
  id?: number;
  date?: moment.Moment;
  time?: any;
  color?: string;
  city?: string;
  description?: string
}

export class Reminder implements IReminder {
  constructor(
    public id?: number,
    public date?: moment.Moment,
    public time?: any,
    public color?: string,
    public city?: string,
    public description?: string
  ) {}
}

