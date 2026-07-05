import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resolveField',
})
export class ResolveFieldPipe implements PipeTransform {
  transform(row: unknown, field: string): unknown {
    if (row == null || !field) return '';

    return field.split('.').reduce<unknown>((acc, key) => {
      if (acc == null || typeof acc !== 'object') return undefined;
      return (acc as Record<string, unknown>)[key];
    }, row);
  }
}
