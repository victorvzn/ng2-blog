import { Component, OnInit }        from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';

import { PostService }                              from './post.service';
import { MediatorService, Message, MessageType }    from '../common/mediator.service';

@Component({
    moduleId: module.id,
    selector: 'post-view',
    templateUrl: './post-view.component.html'
})
export class PostViewComponent implements OnInit {
    public post;
    public commentText: string;

    constructor(
        private _postService: PostService,
        private _currentRoute: ActivatedRoute,
        private _mediator: MediatorService) {
    }

    public ngOnInit(): void {
        let postId: number = +this._currentRoute.snapshot.params['id'];

        this._postService.getPostById(postId).then((post) => {
            this.post = post;
            });
    }

    public addComment(): void {
        this._postService.addComment(this.post.PostID, this.commentText)
            .then((comment) => {
                (this.post.Comments as Array<any>).push(comment);
                this.commentText = "";
                this._mediator.broadcast(new Message(MessageType.ShowSuccess, "Your comment has been added."));
            });
    }
}