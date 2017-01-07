import { Component, OnInit } from '@angular/core';
import { Router, 
  NavigationEnd, 
  NavigationError, 
  Event as NavigationEvent } from '@angular/router';

import { UserService } from './login/user.service';
import { MediatorService, Message, MessageType } from './common/mediator.service';
import { PostService } from './post/post.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  name = 'Angular';
  public loggedUser: string;
  public isBusy: boolean = false;
  public searchText: string;
  public messages: any[] = [];

  constructor(private _userService: UserService,
    private _router: Router,
    private _mediator: MediatorService,
    private _postService: PostService) {
  }

  public ngOnInit(): void {
    this._router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationEnd && event.url != "/login") {
        this.loggedUser = this._userService.getLoggedUser();
      }
      if (event instanceof NavigationEnd) {
        console.log(event.toString());
      }
    });

    this._mediator.messages.subscribe(message => {
      switch (message.type) {
        case MessageType.BusyStart:
          this.isBusy = true;
          break;
        case MessageType.BusyEnd:
          this.isBusy = false;
          break;
        case MessageType.ShowSuccess:
          this.messages.push({ "type": "alert-success", text: message.value });
          break;
        case MessageType.ShowError:
          this.messages.push({ "type": "alert-danger", text: message.value });
          break;
      }
    });
  }

  public closeMessage(i: number): void {
    this.messages.splice(i, 1);0
  }

  public search(): void {
    this._postService.searchText = this.searchText;
    this._router.navigate(['/search']);
  }

  public logout(): void {
    this._userService.logout();
    this.loggedUser = null;
  }
}