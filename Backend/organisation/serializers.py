from rest_framework import serializers
from organisation.models import DiagnosingImage


class DiagnosingImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()  # This is key

    class Meta:
        model = DiagnosingImage
        fields = ('__all__')
