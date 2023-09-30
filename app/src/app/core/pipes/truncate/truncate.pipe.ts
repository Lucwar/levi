import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: any, args: any): any {
    
    // console.log(args[0]);
    // console.log(parseInt(args[0], 10));
    // let limit = args.length > 0 ? parseInt(args[0], 100) : 100;
    // let trail = args.length > 1 ? args[1] : '...';

    let limit = args;
    let trail = '...';
    return value?.length > limit ? value.substring(0, limit) + trail : value;
  }

}
