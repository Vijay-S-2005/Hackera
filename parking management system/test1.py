import cv2
import numpy as np
import pickle

# Initialize video
cap = cv2.VideoCapture('easy.mp4')

drawing = False
points = []
polylines = []
area_names = []
try:
    with open("areas2.pkl", "rb") as f:
        data = pickle.load(f)
        polylines,area_names = data['polylines'],data['area_names']
except :
    polylines = []
    print("No previous data found, starting fresh.")
# Mouse callback function
def draw(event, x, y, flags, param):
    global drawing, points

    if event == cv2.EVENT_LBUTTONDOWN:
        drawing = True
        points = [(x, y)]
    elif event == cv2.EVENT_MOUSEMOVE and drawing:
        points.append((x, y))
    elif event == cv2.EVENT_LBUTTONUP:
        drawing = False
        points.append((x, y))
        poly = np.array(points, np.int32)
        polylines.append(poly)
        area_names.append(f"Area {len(polylines)}")
        points.clear()

# Set up the window and mouse callback
cv2.namedWindow('FRAME')
cv2.setMouseCallback('FRAME', draw)

while True:
    ret, frame = cap.read()
    if not ret:
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        continue

    frame = cv2.resize(frame, (1020, 500))

    # Draw all saved polylines and area names
    for i, polyline in enumerate(polylines):
        cv2.polylines(frame, [polyline], True, (0, 0, 255), 2)
        if len(polyline) > 0:
            cv2.putText(frame, area_names[i], tuple(polyline[0]), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)

    cv2.imshow('FRAME', frame)

    # Wait for key input
    key = cv2.waitKey(1) & 0xFF

    if key == ord('s'):
        # Save polylines and names to file
        with open("areas2.pkl", "wb") as f:
            data = {'polylines': polylines, 'area_names': area_names}
            pickle.dump(data, f)
            print("Polylines and area names saved to 'areas.pkl'")

    elif key == ord('q'):
        break

# Cleanup
cap.release()
cv2.destroyAllWindows()
