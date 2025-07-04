from rest_framework.decorators import api_view
from rest_framework.response import Response
import openrouteservice
from django.conf import settings

from .utils import get_coordinates
from .logic import build_logs
from .logsheet import generate_logsheet_image

@api_view(['POST'])
def plan_trip(request):
    data = request.data

    client = openrouteservice.Client(key=settings.ORS_API_KEY)

    locations = [data['current_location'], data['pickup_location'], data['dropoff_location']]
    coordinates = [get_coordinates(loc) for loc in locations]

    route = client.directions(coordinates, profile='driving-car', format='geojson')
    distance_km = route['features'][0]['properties']['segments'][0]['distance'] / 1000

    logs = build_logs(
        distance_km,
        float(data['current_cycle']),
        driver_name=data.get('driver_name', 'N/A'),
        carrier_name=data.get('carrier_name', 'N/A'),
        truck_number=data.get('truck_number', 'N/A')
    )

    image_url = generate_logsheet_image(logs)

    return Response({
        'route': route,
        'logs': logs,
        'image_url': image_url
    })
