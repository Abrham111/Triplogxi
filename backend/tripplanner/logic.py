from datetime import datetime, timedelta

def build_logs(distance_km, hours_used, driver_name, carrier_name, truck_number):
    logs = []
    hours_remaining = 70 - hours_used
    speed_kmph = 80
    max_daily_drive = 11
    current_date = datetime.now()

    while distance_km > 0 and hours_remaining > 0:
        daily_drive = min(max_daily_drive, hours_remaining, distance_km / speed_kmph)
        driving_miles = round(daily_drive * speed_kmph)

        activities = []
        current_time = current_date.replace(hour=6, minute=0, second=0, microsecond=0)

        activities.append({
            "status": "on-duty-not-driving",
            "startTime": current_time.strftime("%H:%M"),
            "endTime": (current_time + timedelta(minutes=30)).strftime("%H:%M"),
            "location": "Start Terminal",
            "duration": 0.5,
            "description": "Pre-trip inspection"
        })
        current_time += timedelta(minutes=30)

        activities.append({
            "status": "driving",
            "startTime": current_time.strftime("%H:%M"),
            "endTime": (current_time + timedelta(hours=daily_drive)).strftime("%H:%M"),
            "location": "En Route",
            "duration": round(daily_drive, 2),
            "description": f"Driving approx {driving_miles} miles"
        })
        current_time += timedelta(hours=daily_drive)

        activities.append({
            "status": "on-duty-not-driving",
            "startTime": current_time.strftime("%H:%M"),
            "endTime": (current_time + timedelta(minutes=15)).strftime("%H:%M"),
            "location": "Drop Terminal",
            "duration": 0.25,
            "description": "Post-trip inspection"
        })
        current_time += timedelta(minutes=15)

        activities.append({
            "status": "sleeper-berth",
            "startTime": current_time.strftime("%H:%M"),
            "endTime": (current_time + timedelta(hours=10)).strftime("%H:%M"),
            "location": "Rest Stop",
            "duration": 10.0,
            "description": "Mandatory 10-hour rest"
        })

        violations = []
        duty_time = sum(a['duration'] for a in activities if a['status'] != 'sleeper-berth')
        if duty_time > 14:
            violations.append("14-hour rule violation")
        if daily_drive > 11:
            violations.append("11-hour driving limit violation")
        if hours_used + duty_time > 70:
            violations.append("70-hour/8-day cycle violation")

        logs.append({
            "date": current_date.strftime("%Y-%m-%d"),
            "driverName": driver_name,
            "carrierName": carrier_name,
            "truckNumber": truck_number,
            "totalMiles": driving_miles,
            "activities": activities,
            "violations": violations
        })

        distance_km -= driving_miles * 1.60934
        hours_used += duty_time
        hours_remaining = 70 - hours_used
        current_date += timedelta(days=1)

    return logs
