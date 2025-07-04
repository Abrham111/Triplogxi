from geopy.geocoders import Nominatim

def get_coordinates(location_name):
    geolocator = Nominatim(user_agent="triplogix")
    loc = geolocator.geocode(location_name)
    return [loc.longitude, loc.latitude]
