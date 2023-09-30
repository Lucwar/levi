import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { GlobalService } from '../services/global.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private global: GlobalService,
    private router: Router
  ) { }

  /**
   * Can activate
   */
  canActivate(route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> {
    return new Promise(async resolve => {

      const user = this.global.checkUser();
      const data = route.data as GuardRouteData;

      if (user) {

        const redirect = [data.redirect || 'tabs/home'];

        if (data.noUser) return resolve(this.router.createUrlTree(redirect));

        const userRoles = user.roles || [];

        if (data.roles.some(role => userRoles.includes(role))) {

          const additionalCheckRedirect = data.additionalCheck?.(user);

          additionalCheckRedirect
            ? resolve(this.router.createUrlTree([additionalCheckRedirect]))
            : resolve(true)

        } else resolve(this.router.createUrlTree(redirect));

      } else data.noUser
        ? resolve(true)
        : resolve(this.router.createUrlTree([data.redirect || 'login']));

    });
  }
}