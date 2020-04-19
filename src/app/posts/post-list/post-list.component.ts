import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { JwtHelperService } from '@auth0/angular-jwt';


import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { AuthService } from "../../auth/auth.service";
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 8;
  currentPage = 1;
  pageSizeOptions = [1, 10, 11, 12];
  userIsAuthenticated = false;
  userId: string;
  comment:any;
  userName:any;
  requestedList:any=[];
  sharedList:any=[];
  myPosts:any=[];
  decodedToken:any;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const helper = new JwtHelperService();
    let token = localStorage.getItem("token");
   if(token!=null && token !='' && token !=undefined){
    this.decodedToken = helper.decodeToken(token);
    this.userName = this.decodedToken.fullname;
      }
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: any; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
        for(var i=0;i<this.posts.length;i++){
          if(this.userId==this.posts[i].creator){
            this.myPosts.push(this.posts[i])
          }
        }
        if(this.myPosts.length>0){
          for(var i=0;i<this.myPosts.length;i++){
            if(this.myPosts[i].postType == "Share a Bit"){
              this.sharedList.push(this.myPosts[i]);
            }else{
              this.requestedList.push(this.myPosts[i]);
            }
          }
        }

        
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  omit_number(e) {
    var allowedCode = [8, 13, 32, 44, 45, 46, 95,187];
    var charCode = (e.charCode) ? e.charCode : ((e.keyCode) ? e.keyCode :
        ((e.which) ? e.which : 0));
     if (charCode > 31 && (charCode < 64 || charCode > 90) &&
      (charCode < 97 || charCode > 122) &&
      (charCode < 48 || charCode > 57) &&
      (allowedCode.indexOf(charCode) == -1)) {
      e.preventDefault();  
      return false;
     }
}

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  onComment(postId:string){
  if(this.comment!==null && this.comment){
    this.postsService.addcomments(postId,this.comment,1).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
      this.comment='';
    }, () => {
      this.isLoading = false;
    });
  }
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
