import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  userPosts: { [login: string]: any[] } = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe(users => {
      this.users = users;
      users.forEach(user => {
        this.authService.getUserPosts(user.login).subscribe(posts => {
          this.userPosts[user.login] = posts;
        });
      });
    });
  }

  getShortText(html: string, maxLength = 100): string {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  deleteUser(userId: string) {
    if (confirm('Ви дійсно хочете видалити цього користувача?')) {
      this.authService.deleteUser(userId).subscribe(() => {
        this.users = this.users.filter(u => u._id !== userId);
        delete this.userPosts[userId];
      });
    }
  }

  viewPost(postId: string) {
    this.router.navigate(['/post', postId]);
  }

  editPost(postId: string) {
    this.router.navigate(['/edit-post', postId]);
  }

  deletePost(postId: string, login: string) {
    if (confirm('Ви дійсно хочете видалити цей пост?')) {
      this.authService.deletePost(postId).subscribe(() => {
        this.userPosts[login] = this.userPosts[login].filter((p: any) => p._id !== postId);
      });
    }
  }
  
}