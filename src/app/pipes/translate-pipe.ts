import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translatePipe',
})
export class TranslatePipe implements PipeTransform {
  transform(value: string | null | undefined, dictionary: Record<string, string>): string {
    if (!value) return '';

    return dictionary[value] ?? value;
  }
}
