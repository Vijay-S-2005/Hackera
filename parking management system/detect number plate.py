import cv2
import requests
import numpy as np
import easyocr
import base64
import json

# Roboflow model details
ROBOFLOW_API_KEY = "k9k8mgdwcYZvFm4o8otw"
PROJECT_NAME = "vehicle-detection-1"
MODEL_VERSION = "1"
MODEL_ENDPOINT = f"https://infer.roboflow.com/{PROJECT_NAME}/{MODEL_VERSION}?api_key={ROBOFLOW_API_KEY}"

# OCR reader
reader = easyocr.Reader(['en'])

# Video path
video_path = 'car.mp4'  # Replace with your video
cap = cv2.VideoCapture(video_path)

# Set to track seen plates
seen_plates = set()

def get_predictions_from_roboflow(image_np):
    _, img_encoded = cv2.imencode('.jpg', image_np)
    img_base64 = base64.b64encode(img_encoded).decode('utf-8')

    response = requests.post(
        MODEL_ENDPOINT,
        json={"image": img_base64}
    )

    predictions = response.json()
    return predictions

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Resize for Roboflow if needed (Roboflow models are usually trained on 416x416 or 640x640)
    resized_frame = cv2.resize(frame, (640, 640))

    # Get predictions
    prediction_data = get_predictions_from_roboflow(resized_frame)

    if 'predictions' in prediction_data:
        for pred in prediction_data['predictions']:
            class_name = pred['class']
            if class_name.lower() == 'license-plate':  # adjust if your model uses a different name
                x = int(pred['x'] - pred['width'] / 2)
                y = int(pred['y'] - pred['height'] / 2)
                w = int(pred['width'])
                h = int(pred['height'])

                # Crop plate
                plate_img = resized_frame[y:y+h, x:x+w]
                if plate_img.size == 0:
                    continue

                # OCR
                result = reader.readtext(plate_img, detail=0)
                for text in result:
                    plate_number = text.strip()
                    if plate_number and plate_number not in seen_plates:
                        seen_plates.add(plate_number)
                        print(f"Detected Plate: {plate_number}")

cap.release()
cv2.destroyAllWindows()
