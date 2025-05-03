
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static

# Import the required drf-yasg classes
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Configure the schema view for Swagger
schema_view = get_schema_view(
    openapi.Info(
        title="Healthcare API",
        default_version='v1',
        description="API documentation for Healthcare Platform",
        terms_of_service="https://www.yourapp.com/terms/",
        contact=openapi.Contact(email="contact@yourapp.com"),
        license=openapi.License(name="Your License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    # Swagger documentation URLs
    path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # Your existing URLs
    path('admin/', admin.site.urls),
    path('auth/', include('users.urls')),
    path('ai/', include('chat.urls')),
    path('healthcare/', include('healthform.urls')),
    path('blogs/', include('blogs.urls')),
    path('diagnosing/', include('organisation.urls')),
    path('ckeditor/', include('ckeditor_uploader.urls')),
] 

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)