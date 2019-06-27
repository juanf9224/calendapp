import * as moment from 'moment';

export interface IReminder {
  id?: number;
  date?: moment.Moment;
  time?: string;
  color?: string;
  city?: string;
  description?: string;
}

export class Reminder implements IReminder {
  constructor(
    public id?: number,
    public date?: moment.Moment,
    public time?: string,
    public color?: string,
    public city?: string,
    public description?: string
  ) {}
}

