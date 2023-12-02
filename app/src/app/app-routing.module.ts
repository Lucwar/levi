import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginPageModule),
    data: { noUser: true },
    canActivate: [RoleGuard]
  },
  {
    path: 'register/:id',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserPageModule),
    data: { noUser: true },
    canActivate: [RoleGuard]
  },
  {
    path: 'change-password',
    loadChildren: () => import('./modules/change-password/change-password.module').then(m => m.ChangePasswordPageModule),
  },
  {
    path: 'recover-password',
    loadChildren: () => import('./modules/recover-password/recover-password.module').then(m => m.RecoverPasswordPageModule),
    data: { noUser: true },
    canActivate: [RoleGuard]
  },
  {
    path: 'recover-password-success',
    loadChildren: () =>
      import('./modules/recover-password-success/recover-password-success.module').then(m => m.RecoverPasswordSuccessPageModule),
    data: { noUser: true },
    canActivate: [RoleGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./modules/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'service/new',
    loadChildren: () => import('./modules/service/service.module').then( m => m.ServicePageModule)
  },
  {
    path: 'service/:action/:id',
    loadChildren: () => import('./modules/service/service.module').then( m => m.ServicePageModule)
  },
  {
    path: 'song/:action/:id',
    loadChildren: () => import('./modules/song/song.module').then( m => m.SongPageModule)
  },
  {
    path: 'songs',
    loadChildren: () => import('./modules/songs/songs.module').then( m => m.SongsPageModule)
  },
  {
    path: 'list-group/new',
    loadChildren: () => import('./modules/list-group/list-group.module').then( m => m.ListGroupPageModule)
  },
  {
    path: 'list-group/:action/:id',
    loadChildren: () => import('./modules/list-group/list-group.module').then( m => m.ListGroupPageModule)
  },
  {
    path: '**',
    redirectTo: 'login'
  },



];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
