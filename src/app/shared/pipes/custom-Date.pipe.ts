import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'customDate',
})
export class CustomDatePipe implements PipeTransform {
  transform(date: any, lang: string): string {
    const format = lang === 'es' ? 'longDate' : 'longDate';
    return formatDate(date, format, lang);
  }
}
