from django.urls import path
from organisation.views import DiagnoseImageAndGetResultView

urlpatterns = [
    path('diagnose/', DiagnoseImageAndGetResultView.as_view(), name='diagnose'),
]
