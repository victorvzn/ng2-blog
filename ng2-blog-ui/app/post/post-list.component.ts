import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PostService } from './post.service';

@Component({
  moduleId: module.id,
  selector: 'post-list',
  templateUrl: './post-list.component.html',
})
export class PostListComponent implements OnInit {
  public title: string;
  public posts: any;

  constructor(
    private _postService: PostService,
    private _router: Router,
    private _route: ActivatedRoute) {
  }

  public ngOnInit(): void {
    this.title = this._route.snapshot.data['title'];

    if (this._route.snapshot.data['searchResults'] != null) {
      this.posts = this._route.snapshot.data['searchResults'];
    } else {
      this._postService.getRecentPosts()
        .then((p) => {
          this.posts = p;
        });
    }
  }
}
