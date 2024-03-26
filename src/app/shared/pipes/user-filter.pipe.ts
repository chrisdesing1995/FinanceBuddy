import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userFilter'
})
export class UserFilterPipe implements PipeTransform {

  transform(value: any, arg: any): any[] {
    if (arg === '' || arg?.length < 1 || arg == undefined || arg == null ) return value;
    const resultPosts = [];
    for (const post of value) {
      if (post.name?.toLowerCase().indexOf(arg?.toLowerCase()) > -1 || post.surName?.toLowerCase().indexOf(arg?.toLowerCase()) > -1 ) {
        resultPosts.push(post);
      };
    };
    return resultPosts;
  }
}