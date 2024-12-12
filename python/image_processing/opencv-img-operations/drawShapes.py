import cv2
import numpy as np

cap = cv2.VideoCapture(0)

# Define colors in BGR format
red = (0, 0, 255)
green = (0, 255, 0)
blue = (255, 0, 0)

while 1:
    ret, img = cap.read()

    # Check if the frame is successfully captured
    if not ret:
        print("Failed to capture frame")
        break

    # Adding text with different fonts and sizes
    cv2.putText(img, 'OpenCV Demo', (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, red, 2)
    cv2.putText(img, 'Text Example', (50, 100), cv2.FONT_HERSHEY_COMPLEX, 0.5, green, 1)

    # Drawing shapes
    cv2.rectangle(img, (200, 100), (300, 200), blue, 3)  # Rectangle
    cv2.circle(img, (550, 80), 50, green, -1)  # Filled circle
    cv2.circle(img, (560, 250), 50, blue, 0)  #  circle
    cv2.circle(img, (300, 260), 30, red, 10)  #  circle bold
    cv2.line(img, (400, 150), (500, 250), red, 2)  # Line

    # Drawing a triangle
    pts = np.array([[150, 150], [100, 250], [200, 250]], np.int32)
    pts = pts.reshape((-1, 1, 2))
    cv2.polylines(img, [pts], True, (0, 255, 255), 3)

    # Drawing a polygon
    poly_pts = np.array([[350, 100], [320, 150], [370, 150], [340, 200], [380, 200]], np.int32)
    poly_pts = poly_pts.reshape((-1, 1, 2))
    cv2.fillPoly(img, [poly_pts], (255, 0, 255))

    cv2.imshow("video", img)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
