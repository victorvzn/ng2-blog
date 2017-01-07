import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { PostService } from './post.service';
import { AddPostModel } from './add-post.model';
import { MediatorService, Message, MessageType } from '../common/mediator.service';

@Component({
  moduleId: module.id,
  selector: 'add-post',
  templateUrl: './add-post.component.html',
})
export class AddPostComponent {
  public title: string;
  public summary: string;
  public body: string;
  public newTag: string;
  public tags: string[] = [];

  constructor(
    private _postService: PostService,
    private _router: Router,
    private _mediator: MediatorService) {
  }

  public publish(): void {
    let post: AddPostModel = new AddPostModel();
    post.Title = this.title;
    post.Summary = this.summary;
    post.Body = this.body;
    post.Tags = this.tags;

    this._postService.addNewPost(post)
      .then(() => {
        this._mediator.broadcast(new Message(MessageType.ShowSuccess, 'Your post has been published.'))
        this._router.navigate(['/posts']);
      });
  }

  public addTag(): void {
    if (this.newTag.trim() != "") {
      this.tags.push(this.newTag);
    }
  }

  public removeTag(tag: string): void {
    this.tags = this.tags.filter((t) => {
      return t != tag;
    });
  }
}
