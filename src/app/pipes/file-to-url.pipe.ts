import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toUrl'
})
export class FileToUrlPipe implements PipeTransform {
  transform(file: File): string {
    return URL.createObjectURL(file);
  }
}