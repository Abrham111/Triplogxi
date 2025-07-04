from PIL import Image, ImageDraw, ImageFont
import os

def generate_logsheet_image(logs):
    os.makedirs("backend/media", exist_ok=True)

    try:
        font = ImageFont.truetype("arial.ttf", 14)
    except:
        font = ImageFont.load_default()

    # Layout config
    img_width = 1300
    row_height = 40
    log_height = 300
    time_label_offset = 50
    block_width = (img_width - 100) / 24  # one hour block

    total_height = len(logs) * (log_height + 80) + 100
    img = Image.new("RGB", (img_width, total_height), color="white")
    draw = ImageDraw.Draw(img)

    def draw_day_log(y_offset, day):
        # Labels
        draw.text((20, y_offset), f"Date: {day['date']}", fill='black', font=font)
        draw.text((300, y_offset), f"Driver: {day['driverName']}", fill='black', font=font)
        draw.text((650, y_offset), f"Truck: {day['truckNumber']}", fill='black', font=font)
        draw.text((950, y_offset), f"Carrier: {day['carrierName']}", fill='black', font=font)

        y_grid = y_offset + 30
        status_rows = {
            'off-duty': 0,
            'sleeper-berth': 1,
            'driving': 2,
            'on-duty-not-driving': 3
        }

        # Draw horizontal rows
        for i, label in enumerate(["Off Duty", "Sleeper Berth", "Driving", "On Duty"]):
            y = y_grid + i * row_height
            draw.line([(50, y), (1250, y)], fill='black')
            draw.text((10, y + 10), label, fill='black', font=font)

        # Draw vertical lines for each hour
        for i in range(25):
            x = 50 + i * block_width
            draw.line([(x, y_grid), (x, y_grid + row_height * 4)], fill='gray')
            if i % 2 == 0:
                draw.text((x - 10, y_grid + row_height * 4 + 5), f"{i:02d}:00", fill='black', font=font)

        # Draw activity bars
        for a in day['activities']:
            row = status_rows.get(a['status'].lower(), 0)
            start_hr = convert_to_decimal(a['startTime'])
            end_hr = convert_to_decimal(a['endTime'])
            x1 = 50 + start_hr * block_width
            x2 = 50 + end_hr * block_width
            y1 = y_grid + row * row_height + 5
            y2 = y1 + row_height - 10
            draw.rectangle([x1, y1, x2, y2], fill=get_color(a['status']))

        # Violations
        if day['violations']:
            draw.text((60, y_grid + row_height * 4 + 35), "Violations:", fill='red', font=font)
            for i, v in enumerate(day['violations']):
                draw.text((160, y_grid + row_height * 4 + 35 + i * 20), f"• {v}", fill='red', font=font)

        return y_grid + row_height * 4 + 60 + len(day['violations']) * 20

    # Draw each day's log
    y = 20
    for day in logs:
        y = draw_day_log(y, day)

    out_path = "media/logsheet_output.png"
    img.save(out_path)
    return "media/logsheet_output.png"

def get_color(status):
    return {
        'driving': "blue",
        'on-duty-not-driving': "orange",
        'sleeper-berth': "green",
        'off-duty': "gray"
    }.get(status.lower(), "black")

def convert_to_decimal(tstr):
    h, m = map(int, tstr.split(":"))
    return h + m / 60
