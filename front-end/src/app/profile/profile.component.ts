import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any;
  userPosts: any[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    if (this.user?.login) {
      this.authService.getUserPosts(this.user.login).subscribe(posts => {
        this.userPosts = posts;
      });
    }
  }
 viewPost(postId: string) {
    this.router.navigate(['/post', postId]);
  }

  editPost(postId: string) {
    this.router.navigate(['/edit-post', postId]);
  }

  deletePost(postId: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.authService.deletePost(postId).subscribe(() => {
        this.userPosts = this.userPosts.filter(post => post._id !== postId);
      });
    }
  }
  getShortText(html: string, maxLength = 100): string {
  const div = document.createElement('div');
  div.innerHTML = html || '';
  const text = div.textContent || div.innerText || '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}
}