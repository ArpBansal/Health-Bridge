from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import generics, status, permissions
from organisation.models import DiagnosingImage
from organisation.serializers import DiagnosingImageSerializer
from drf_yasg.utils import swagger_auto_schema
import requests
import mimetypes

EMBEDDING_API_URL = "https://arpit-bansal-EmbeddingGenerator-Medical.hf.space/embeddings"
RESULT_API_URL = "https://arpit-bansal-Diagnosing-API.hf.space/classify"


class DiagnoseImageAndGetResultView(generics.CreateAPIView):
    queryset = DiagnosingImage.objects.all()
    serializer_class = DiagnosingImageSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    @swagger_auto_schema(request_body=DiagnosingImageSerializer)
    def post(self, request, *args, **kwargs):
        if 'image' not in request.FILES:
            return Response({'error': 'No image file uploaded.'}, status=400)

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            image_path = serializer.instance.image.path

            try:
                # Step 1: Get embedding
                with open(image_path, 'rb') as f:
                    mime_type, _ = mimetypes.guess_type(image_path)
                    files = {'file': (f.name, f, mime_type or 'application/octet-stream')}
                    embedding_response = requests.post(EMBEDDING_API_URL, files=files)
                    print(embedding_response)

                if embedding_response.status_code != 200:
                    return Response({'error': 'Failed to get embedding.', 'details': embedding_response.text},
                                    status=embedding_response.status_code)

                embedding = embedding_response.json().get('embedding')
                print(embedding)
                if not embedding:
                    return Response({'error': 'No embedding found in response from embedding API.'}, status=500)

                # Step 2: Send to result API
                result_payload = {"features": embedding}
                result_response = requests.post(RESULT_API_URL, json=result_payload)

                if result_response.status_code != 200:
                    return Response({'error': 'Failed to get result from result API.', 'details': result_response.text},
                                    status=result_response.status_code)

                result = result_response.json()
                return Response({'result': result}, status=200)

            except Exception as e:
                return Response({'error': 'Internal server error.', 'details': str(e)}, status=500)

        return Response(serializer.errors, status=400)
