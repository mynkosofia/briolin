import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: any
  user: any

  constructor(
    private http : HttpClient
  ) { }

  registerUser(user: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); 
    return this.http.post('http://localhost:3000/account/reg', user, { headers });
  }
  
authUser(user: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post('http://localhost:3000/account/auth', user, { headers });
  }

  storeUser(token: any, user: any) {
  localStorage.setItem('token', token); // <-- без додаткового 'jwt '
  localStorage.setItem('user', JSON.stringify(user));
  this.token = token;
  this.user = user;
}

  logout() {
    this.token = null
    this.user = null
    localStorage.clear()
  }

   isAuthenticated() {
    const helper = new JwtHelperService();
    const token = localStorage.getItem('token');
    return !!token && !helper.isTokenExpired(token);
    }

      createPost(post) {
  const headers = new HttpHeaders({
    'Authorization': localStorage.getItem('token') || '',
    'Content-Type': 'application/json'
  });
  return this.http.post('http://localhost:3000/account/dashboard', post, { headers });
}

   getAllPosts() {
  return this.http.get<any[]>('http://localhost:3000');
}

getPostById(id: string) {
  return this.http.get<any>(`http://localhost:3000/post/${id}`);
}

deletePost(id: string) {
  const headers = new HttpHeaders({'Authorization': localStorage.getItem('token') || ''});
  return this.http.delete<{ success: boolean; msg: string }>(`http://localhost:3000/post/${id}`,{ headers } );
}


updatePost(id: string, post: any) {
  const headers = new HttpHeaders({
    'Authorization': localStorage.getItem('token') || '',
    'Content-Type': 'application/json'
  });
  return this.http.put(`http://localhost:3000/account/post/${id}`, post, { headers });
}

getAllUsers() {
  const headers = new HttpHeaders({
    'Authorization': localStorage.getItem('token') || ''
  });
  return this.http.get<any[]>('http://localhost:3000/account/users', { headers });
}

getUserPosts(login: string) {
  const headers = new HttpHeaders({
    'Authorization': localStorage.getItem('token') || ''
  });
  return this.http.get<any[]>(`http://localhost:3000/account/user-posts/${login}`, { headers });
}
deleteUser(userId: string) {
  const headers = new HttpHeaders({
    'Authorization': localStorage.getItem('token') || ''
  });
  return this.http.delete<{ success: boolean; msg: string }>(`http://localhost:3000/account/user/${userId}`, { headers });
}

getComments(postId: string) {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': localStorage.getItem('token') || ''
  });
  return this.http.get<any[]>(`http://localhost:3000/account/post/${postId}/comments`, { headers });
}

addComment(postId: string, text: string) {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': localStorage.getItem('token') || ''
  });
  return this.http.post<any>(`http://localhost:3000/account/post/${postId}/comment`, { text }, { headers });
}
deleteComment(postId: string, commentId: string) {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': localStorage.getItem('token') || ''
  });
  return this.http.delete<any>(`http://localhost:3000/account/post/${postId}/comment/${commentId}`, { headers });
}


}

