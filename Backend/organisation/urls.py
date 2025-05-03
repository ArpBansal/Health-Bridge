from django.urls import path, include
from organisation import views

urlpatterns = [
    path('diagnose-image/', views.DiagnosingImageView.as_view(), name='diagnose-image')
]
