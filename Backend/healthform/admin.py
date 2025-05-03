from django.contrib import admin
from .models import GeneralHealthForm

@admin.register(GeneralHealthForm)
class GeneralHealthFormAdmin(admin.ModelAdmin):
    list_display = ("name", "age", "gender", "contact_details", "created_at")
    search_fields = ("name", "contact_details")
    list_filter = ("gender", "created_at")
