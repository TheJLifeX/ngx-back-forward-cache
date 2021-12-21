import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'page-a'
  },
  { path: 'page-a', loadChildren: () => import('./page-a/page-a.module').then(m => m.PageAModule) },
  { path: 'page-b', loadChildren: () => import('./page-b/page-b.module').then(m => m.PageBModule) },
  { path: 'page-c', loadChildren: () => import('./page-c/page-c.module').then(m => m.PageCModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
