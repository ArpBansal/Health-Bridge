from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import generics, permissions, status
from organisation.models import DiagnosingImage
from organisation.serializers import DiagnosingImageSerializer
from drf_yasg.utils import swagger_auto_schema
import requests
from organisation.permissions import IsOrganisation
import mimetypes

API_URL = "https://arpit-bansal-EmbeddingGenerator-Medical.hf.space/embeddings"

class DiagnosingImageView(generics.CreateAPIView):
    queryset = DiagnosingImage.objects.all()
    serializer_class = DiagnosingImageSerializer
    permission_classes = [IsOrganisation]
    parser_classes = [MultiPartParser, FormParser]

    @swagger_auto_schema(request_body=DiagnosingImageSerializer)
    def post(self, request, *args, **kwargs):
        if 'image' not in request.FILES:
            return Response({'error': 'No image file uploaded.'}, status=400)

        image_serializer = self.serializer_class(data=request.data)
        if image_serializer.is_valid():
            image_serializer.save()
            image_path = image_serializer.instance.image.path

            try:
                with open(image_path, 'rb') as f:
                    mime_type, _ = mimetypes.guess_type(image_path)
                    files = {'file': (f.name, f, mime_type or 'application/octet-stream')}
                    response = requests.post(API_URL, files=files)

                if response.status_code == 200:
                    return Response({'message': 'Image uploaded and sent to API successfully.'}, status=200)
                else:
                    return Response({'error': 'Failed to send image to API.', 'details': response.text}, status=response.status_code)

            except Exception as e:
                return Response({'error': 'Exception during file upload or API call.', 'details': str(e)}, status=500)

        return Response(image_serializer.errors, status=400)
