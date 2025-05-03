from django.urls import path
from .views import (
    GeneralHealthFormCreateView,
    GeneralHealthFormListView,
    GeneralHealthFormDetailView,
    GeneralHealthFormUpdateView,
    GenerateHealthSummaryView
)

urlpatterns = [
    path('form/submit/', GeneralHealthFormCreateView.as_view(), name='submit-form'),
    path('form/list/', GeneralHealthFormListView.as_view(), name='list-form'),
    path('form/me/', GeneralHealthFormDetailView.as_view(), name='user-form'),
    path('form/me/update/', GeneralHealthFormUpdateView.as_view(), name='update-user-form'),

    path('generate-pdf/', GenerateHealthSummaryView.as_view(), name='generate-pdf'),

]
