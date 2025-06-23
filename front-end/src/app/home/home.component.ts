import { Component, AfterViewInit, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../auth.service';
import { CategoryService } from '../category.service';
import { NavigationEnd, Router } from '@angular/router'; // ДОДАТИ

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  posts: any[] = [];
  filteredPosts: any[] = [];
  category: string = '';
  search: string = '';
  searchQuery: string = '';

  constructor(
    private authService: AuthService,
    private renderer: Renderer2,
    private categoryService: CategoryService,
    public router: Router // ДОДАТИ
  ) { 
     this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects === '/') {
        this.resetCategory();
      }
    });
  }

  ngOnInit(): void {
    this.categoryService.category$.subscribe(category => {
      this.category = category;
      this.applyFilter();
    });
 this.categoryService.resetSearch$.subscribe(() => {
    this.search = '';
    this.searchQuery = '';
    this.applyFilter();
  });
    this.authService.getAllPosts().subscribe(
      posts => {
        this.posts = posts;
        for (let i = 0; i < this.posts.length; i++) {
          this.posts[i].text = this.posts[i].text.substring(0, 150);
        }
        this.applyFilter();
      }
    );
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const imgs = document.querySelectorAll('quill-view img');
      imgs.forEach(img => {
        this.renderer.setStyle(img, 'width', '100%');
        this.renderer.setStyle(img, 'height', '200px');
        this.renderer.setStyle(img, 'object-fit', 'cover');
        this.renderer.setStyle(img, 'border-radius', '8px');
        this.renderer.setStyle(img, 'display', 'block');
      });
    }, 0);
  }

  setCategory(category: string) {
    this.categoryService.setCategory(category);
  }

  applyFilter() {
    this.filteredPosts = this.posts.filter(post => {
      const matchesCategory = this.category ? post.category === this.category : true;
      const matchesSearch = this.search
        ? (post.title?.toLowerCase().includes(this.search.toLowerCase()) ||
           post.text?.toLowerCase().includes(this.search.toLowerCase()))
        : true;
      return matchesCategory && matchesSearch;
    });
  }

  resetCategory() {
     this.categoryService.setCategory('');
  this.category = '';
  this.search = '';
  this.searchQuery = '';
  this.applyFilter();
  }

  onSearch() {
    this.search = this.searchQuery.trim();
    this.applyFilter();
  }
}