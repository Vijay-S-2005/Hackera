import cv2
import requests
import qrcode
from datetime import datetime
import os

ROBOFLOW_API_KEY = "k9k8mgdwcYZvFm4o8otw"
PROJECT_NAME = "vehicle-detection-1"  # Replace spaces with hyphens if needed
MODEL_VERSION = "1"
MODEL_ENDPOINT = f"https://infer.roboflow.com/{PROJECT_NAME}/{MODEL_VERSION}?api_key={ROBOFLOW_API_KEY}"

# === USER INPUT ===
file_path = "download.jpg"  # or "image.jpg"

def send_to_roboflow(image):
    resized = cv2.resize(image, (416, 416))
    cv2.imwrite("temp.jpg", resized)
    with open("temp.jpg", "rb") as f:
        response = requests.post(MODEL_ENDPOINT, files={"file": f})
    try:
        return response.json().get("predictions", [])
    except:
        return []

def draw_and_generate_qr(frame, predictions):
    for pred in predictions:
        label = pred["class"]
        x, y, w, h = int(pred["x"]), int(pred["y"]), int(pred["width"]), int(pred["height"])
        x1, y1 = x - w // 2, y - h // 2
        x2, y2 = x + w // 2, y + h // 2

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(frame, label, (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        # Generate QR
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        qr_data = f"Vehicle: {label}, Time: {current_time}"
        qr = qrcode.make(qr_data)
        qr.save("vehicle_qr.png")
        print(f"[INFO] QR Generated: {qr_data}")
        break  # Process only one detection

    return frame

if file_path.endswith(('.jpg', '.png', '.jpeg')):
    img = cv2.imread(file_path)
    predictions = send_to_roboflow(img)
    result = draw_and_generate_qr(img, predictions)
    cv2.imshow("Image Detection", result)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

elif file_path.endswith(('.mp4', '.avi', '.mov')):
    cap = cv2.VideoCapture(file_path)
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        predictions = send_to_roboflow(frame)
        frame = draw_and_generate_qr(frame, predictions)
        cv2.imshow("Video Detection", frame)

        if cv2.waitKey(1) == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()

else:
    print("Unsupported file format. Please provide an image or video file.")

# Cleanup temp file
if os.path.exists("temp.jpg"):
    os.remove("temp.jpg")