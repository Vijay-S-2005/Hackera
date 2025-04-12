import cv2
import numpy as np
import pickle
import pandas as pd
from ultralytics import YOLO
import cvzone
from pymongo import MongoClient
from datetime import datetime

# ------------------- MongoDB Setup ------------------- #
def check_db_connection(client):
    try:
        client.admin.command('ismaster')
        print("✅ Successfully connected to MongoDB!")
        return True
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        return False

try:
    client = MongoClient("mongodb+srv://manoj:GQe8FoFXvXBloTUH@cluster0.7vsynme.mongodb.net/")
    db = client['data']
    collection = db['current']
    if not check_db_connection(client):
        print("⚠️ Warning: Application will continue without database functionality")
except Exception as e:
    print(f"Error setting up MongoDB connection: {e}")
    client, db, collection = None, None, None

# ------------------- DB Update Function ------------------- #
def update_parking_data(occupied, vacant, total_entries, area_status):
    if collection is None:
        print("⚠️ Database not connected, skipping update")
        return

    try:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        new_data = {
            "timestamp": timestamp,
            "occupied": occupied,
            "vacancy": vacant,
            "total_car_entry_today": total_entries,
            "area_status": area_status
        }
        collection.insert_one(new_data)
        print(f"📥 Database updated: {new_data}")
    except Exception as e:
        print(f"❌ Error updating database: {e}")

# ------------------- Load Area Data ------------------- #
try:
    with open("areas.pkl", "rb") as f:
        data = pickle.load(f)
        polylines, area_names = data['polylines'], data['area_names']
except:
    print("⚠️ No previous data found. Starting fresh.")
    polylines, area_names = [], []

# ------------------- Load Class Names ------------------- #
with open("coco.txt", "r") as my_file:
    class_list = my_file.read().split("\n")

# ------------------- Load YOLO Model ------------------- #
model = YOLO('yolov8s.pt')

# ------------------- Video Source ------------------- #
cap = cv2.VideoCapture('easy1.mp4')

prev_car_count = 0
total_entries_today = 0

# ------------------- Main Loop ------------------- #
while True:
    ret, frame = cap.read()
    if not ret:
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        continue

    frame = cv2.resize(frame, (1020, 500))
    results = model.predict(frame)
    detections = results[0].boxes.data
    px = pd.DataFrame(detections).astype("float")

    car_centers = []
    for _, row in px.iterrows():
        x1, y1, x2, y2, _, class_id = map(int, row[:6])
        if 'car' in class_list[class_id]:
            cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
            car_centers.append((cx, cy))

    counter = []
    area_status = {}

    for i, polyline in enumerate(polylines):
        area_name = area_names[i]
        is_occupied = False

        cv2.polylines(frame, [polyline], True, (0, 255, 0), 2)
        if len(polyline) > 0:
            cv2.putText(frame, area_name, tuple(polyline[0]), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)

        for cx, cy in car_centers:
            if cv2.pointPolygonTest(polyline, (cx, cy), False) >= 0:
                cv2.circle(frame, (cx, cy), 5, (255, 0, 255), -1)
                cv2.polylines(frame, [polyline], True, (0, 0, 255), 2)
                counter.append(cx)
                is_occupied = True

        area_status[area_name] = is_occupied

    car_count = len(set(counter))
    total_areas = len(polylines)
    free_space = total_areas - car_count

    if car_count != prev_car_count:
        if car_count > prev_car_count:
            total_entries_today += (car_count - prev_car_count)

        update_parking_data(car_count, free_space, total_entries_today, area_status)
        prev_car_count = car_count

    # Display info
    cvzone.putTextRect(frame, f'Occupied Count: {car_count}', (100, 100), scale=2, thickness=3,
                       colorR=(0, 200, 0), colorT=(0, 0, 0))
    cvzone.putTextRect(frame, f'Free Space: {free_space}', (100, 200), scale=2, thickness=3,
                       colorR=(0, 200, 0), colorT=(0, 0, 0))

    cv2.imshow('FRAME', frame)
    key = cv2.waitKey(1)
    if key == 27:  # ESC to exit
        break

# ------------------- Cleanup ------------------- #
cap.release()
cv2.destroyAllWindows()
