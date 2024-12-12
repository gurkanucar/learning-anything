import cv2
import numpy as np

# Change path to working dir
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))

cam = cv2.VideoCapture(0)
face_cascade = cv2.CascadeClassifier('res/haarcascade_frontalface_default.xml')

while True:
    ret, frame = cam.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    colored_blurred = cv2.blur(frame, (30, 30))  # Blur the whole frame
    faces = face_cascade.detectMultiScale(gray, 1.3, 4)

    for (x, y, w, h) in faces:
        # Create a black and white version of the face
        face_bw = cv2.resize(gray[y:y+h, x:x+w], (w, h))

        # Replace the face area with the black and white version
        colored_blurred[y:y+h, x:x+w] = cv2.cvtColor(face_bw, cv2.COLOR_GRAY2BGR)

    cv2.imshow("Face Tracking", colored_blurred)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cam.release()
cv2.destroyAllWindows()
