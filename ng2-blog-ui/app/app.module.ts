import { NgModule }          from '@angular/core';
import { BrowserModule }     from '@angular/platform-browser';
import { FormsModule }       from '@angular/forms';
import { HttpModule }        from '@angular/http';

import { routing }           from './app.routing';
import { AppComponent }      from './app.component';
import { SettingsService }   from './common/settings.service';
import { MediatorService }   from './common/mediator.service';
import { AccountComponent }  from './account/account.component';
import { AccountService }    from './account/account.service';
import { LoginComponent }    from './login/login.component';
import { UserService }       from './login/user.service';
import { LoggedInGuard }     from './login/logged-in-guard';
import { AddPostComponent }  from './post/add-post.component';
import { PostListComponent } from './post/post-list.component';
import { PostService }       from './post/post.service';
import { PostViewComponent } from './post/post-view.component';
import { SpinnerComponent }  from './spinner/spinner.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  declarations: [
    AppComponent,
    AccountComponent,
    LoginComponent,
    AddPostComponent,
    PostListComponent,
    PostViewComponent,
    SpinnerComponent
  ],
  providers: [ 
    SettingsService,
    MediatorService,
    UserService,
    LoggedInGuard,
    AccountService,
    PostService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

