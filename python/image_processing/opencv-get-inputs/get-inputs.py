import cv2

# change path to working dir
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))


# Resim okuma
"""
img = cv2.imread("./res/dog.jpg")
cv2.imshow("Resim", img)
cv2.waitKey(0)
"""

# Resim yazma
"""
img = cv2.imread("./res/dog.jpg")
cv2.imwrite("./res/dog(1).jpg", img)
cv2.waitKey(0)
"""


# Video okuma kaynaktan
"""
video = cv2.VideoCapture("./res/video.mp4")
while 1:
    ret, img = video.read()
    # Resize the frame
    width = 640  # desired width
    height = 480  # desired height
    dim = (width, height)
    resized_img = cv2.resize(img, dim, interpolation = cv2.INTER_AREA)
    cv2.imshow("video", resized_img)
    if cv2.waitKey(1) & 0xFF == ord('q'):
      break
"""

# Video okuma kameradan
cap = cv2.VideoCapture(0)
while 1:
    ret, img = cap.read()
    cv2.imshow("video", img)
    if cv2.waitKey(1) & 0xFF == ord('q'):
      break
cap.release()
cv2.destroyAllWindows()


# IP kameradan okuma
"""
url = "http://192.168.0.14:8080/video"
cap = cv2.VideoCapture(url)
while 1:
    ret, img = cap.read()
    cv2.imshow("video", img)
    if cv2.waitKey(1) & 0xFF == ord('q'):
      break
cap.release()
cv2.destroyAllWindows()
"""