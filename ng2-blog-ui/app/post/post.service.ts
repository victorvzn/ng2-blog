import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { SettingsService } from '../common/settings.service';
import { MediatorService, Message, MessageType } from '../common/mediator.service';
import { UserService } from '../login/user.service';
import { AddPostModel } from './add-post.model';


@Injectable()
export class PostService {
  public searchText: string;

  constructor(
    private _http: Http,
    private _settingsService: SettingsService,
    private _userService: UserService,
    private _mediator: MediatorService) {
  }

  /**
   * Gets the top 10 most recent posts
   */
  public getRecentPosts() {
    let apiUrl = this._settingsService.settings['apiUrl'];
    this._mediator.broadcast(new Message(MessageType.BusyStart));
    return this._http.get(apiUrl + 'post/recent', { headers: this._userService.getHeaders() })
      .toPromise()
      .then((res) => {
        this._mediator.broadcast(new Message(MessageType.BusyEnd));
        return res.json();
      })
      .catch(error => this.handleError(error, 'loading recent posts.'));
  }

  /**
   * Gets a post by id, including its posts
   */
  public getPostById(id: number): Promise<Object> {
    let apiUrl = this._settingsService.settings['apiUrl'];
    this._mediator.broadcast(new Message(MessageType.BusyStart));
    return this._http.get(apiUrl + 'post/' + id.toString, { headers: this._userService.getHeaders() })
      .toPromise()
      .then((res) => {
        this._mediator.broadcast(new Message(MessageType.BusyEnd));
        return res.json();
      })
      .catch(error => this.handleError(error, 'loading the selected post.'));
  }

  /**
   * Creates a new post
   */
  public addNewPost(post: AddPostModel): Promise<void> {
    let apiUrl = this._settingsService.settings['apiUrl'];
    this._mediator.broadcast(new Message(MessageType.BusyStart));
    return this._http.post(apiUrl + 'post', post, { headers: this._userService.getHeaders() })
      .toPromise()
      .then((res) => {
        this._mediator.broadcast(new Message(MessageType.BusyEnd));
      })
      .catch(error => this.handleError(error, 'saving the post.'));
  }

  /**
   * Adds a comment to an existing post
   */
  public addComment(postId: number, text: string): Promise<any> {
    let apiUrl = this._settingsService.settings['apiUrl'];
    this._mediator.broadcast(new Message(MessageType.BusyStart));
    return this._http.post(apiUrl + 'post/comment', 
      { PostID: postId, Text: text}, 
      { headers: this._userService.getHeaders() })
      .toPromise()
      .then((res) => {
        this._mediator.broadcast(new Message(MessageType.BusyEnd));
        return res.json();
      })
      .catch(error => this.handleError(error, 'Adding the comment.'));
  }

  public resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.search();
  } // ???

  /**
   * Searches posts by title, summary and tags
   */
  public search(): Observable<any> {
    let apiUrl = this._settingsService.settings['apiUrl'];
    this._mediator.broadcast(new Message(MessageType.BusyStart));
    return this._http.post(apiUrl + 'post/search', 
      JSON.stringify(this.searchText), 
      { headers: this._userService.getHeaders() })
      .map(res => { // ???
        this._mediator.broadcast(new Message(MessageType.BusyEnd));
        return res.json();
      });
  }

  private handleError(error: any, operation: string): Promise<any> {
    this._mediator.broadcast(new Message(MessageType.BusyEnd));
    this._mediator.broadcast(new Message(MessageType.ShowError, 'An error ocurred while ' + operation));
    console.error('An error ocurred', error);
    return Promise.reject(error.message || error);
  }
}