import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { FlashMessagesService } from 'angular2-flash-messages';


interface PostResponse {
  success: boolean;
  msg: string;
  
}


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  post$
  login
  user: any;
  comments: any[] = [];
commentText: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private _flashMessagesService: FlashMessagesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.login = JSON.parse(localStorage.getItem("user")).login
    }
    this.post$ = this.route.params
    .pipe(switchMap( (params : Params) => {
      return this.authService.getPostById(params['id'])
    }))
     this.user = JSON.parse(localStorage.getItem('user'));
     this.loadComments();
  }
loadComments() {
  const postId = this.route.snapshot.paramMap.get('id');
  this.authService.getComments(postId).subscribe(comments => {
    this.comments = comments;
  });
  
}
addComment() {
  const postId = this.route.snapshot.paramMap.get('id');
  this.authService.addComment(postId, this.commentText).subscribe(res => {
    if (res.success) {
      this.commentText = '';
      this.loadComments();
    }
  });
}
  deletePost(id) {
    this.authService.deletePost(id).subscribe( (data: PostResponse ) => {
      if (!data.success) {
        this._flashMessagesService.show("Post not deleted!", 
        { cssClass: 'alert-danger', timeout: 3000 });
      } else {
        this._flashMessagesService.show("Post deleted!", 
          { cssClass: 'alert-success', timeout: 3000 });
          this.router.navigate(['/'])
      }
    })
  }
   editPost(postId: string) {
    this.router.navigate(['/edit-post', postId]);
  }
goToProfile() {
  this.router.navigate(['/profile']);
}
goToAdmin() {
  this.router.navigate(['/admin']);
}
deleteComment(postId: string, commentId: string) {
  this.authService.deleteComment(postId, commentId).subscribe(res => {
    if (res.success) {
      this.loadComments(); // Оновити список коментарів
    } else {
      this._flashMessagesService.show(res.msg || "Comment not deleted!", 
        { cssClass: 'alert-danger', timeout: 3000 });
    }
  }, err => {
    this._flashMessagesService.show("Error deleting comment!", 
      { cssClass: 'alert-danger', timeout: 3000 });
  });
}
}
