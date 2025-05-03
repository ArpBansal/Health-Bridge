from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('grappelli/', include('grappelli.urls')),  # Django JET URLS
    path('admin/', admin.site.urls),
    path('auth/', include('users.urls')),
    path('ai/', include('chat.urls')),
    path('healthcare/', include('healthform.urls')),
    path('blogs/', include('blogs.urls')),
    path('ckeditor/', include('ckeditor_uploader.urls')),  # optional if enabling image uploads

    
] 


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
