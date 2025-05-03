from django.urls import path
from blogs import views

urlpatterns = [
    path('posts/', views.BlogListCreateView.as_view(), name='posts'),
    path('posts/<slug:slug>/', views.BlogDetailView.as_view(), name='post-detail'),
    path('posts/<slug:slug>/comments/', views.CommentListCreateView.as_view(), name='comment_list'),
    path('posts/<slug:slug>/comments/<int:comment_pk>/', views.CommentDetailView.as_view(), name='comment_detail'),
]
