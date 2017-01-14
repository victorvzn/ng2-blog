import { ModuleWithProviders } from '@angular/core'
import { Routes, RouterModule } from '@angular/router';

import { AccountComponent }  from './account/account.component';
import { LoginComponent }    from './login/login.component';
import { LoggedInGuard }     from './login/logged-in-guard';
import { AddPostComponent }  from './post/add-post.component';
import { PostListComponent } from './post/post-list.component';
import { PostViewComponent } from './post/post-view.component';
import { PostService }       from './post/post.service';
import { SettingsService }   from './common/settings.service';

const appRoutes: Routes = [
  {
    path: 'post/:id',
    pathMatch: 'full',
    component: PostViewComponent,
    canActivate: [LoggedInGuard],
    resolve: {
      config: SettingsService
    }
  },
  {
    path: 'new/post',
    pathMatch: 'full',
    component: AddPostComponent,
    canActivate: [LoggedInGuard],
    resolve: {
      config: SettingsService
    }
  },
  {
    path: 'posts',
    pathMatch: 'full',
    component: PostListComponent,
    canActivate: [LoggedInGuard],
    resolve: {
      config: SettingsService
    },
    data: {
      title: 'Recent Posts'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    resolve: {
      config: SettingsService
    }
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [LoggedInGuard],
    resolve: {
      config: SettingsService,
    },
    data: {
      title: 'Account',
      newAccount: false
    }
  },
  {
    path: 'register',
    component: AccountComponent,
    resolve: {
      config: SettingsService,
    },
    data: {
      title: 'Register',
      newAccount: true
    }
  },
  {
    path: 'search',
    component: PostListComponent,
    canActivate: [LoggedInGuard],
    resolve: {
      config: SettingsService,
      searchResults: PostService
    },
    data: {
      title: 'Search'
    }
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

/**
 * Defines all the routes of the application.
 */
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);