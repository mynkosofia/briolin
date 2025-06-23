import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent implements OnInit {
  postId: string;
  post: any = {
   title: '',
  text: '',
  category: '',
  photo: ''
  };

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService
  ) {}

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id');
    this.authService.getPostById(this.postId).subscribe((post: any) => {
      this.post = post;
    });
  }

 updatePost() {
  this.authService.updatePost(this.postId, this.post).subscribe((res: any) => {
    if (res.success) {
      this.flashMessagesService.show('Post updated!', { cssClass: 'alert-success', timeout: 3000 });
      this.router.navigate(['/post', this.postId]);
    } else {
      this.flashMessagesService.show('Error updating post', { cssClass: 'alert-danger', timeout: 3000 });
    }
  });
}
}