#https://pythontutorials.eu/deep-learning/image-classification/
import cv2
import numpy as np

from keras.applications.mobilenet_v2 import MobileNetV2
from keras.applications.mobilenet_v2 import preprocess_input
from keras.applications.mobilenet_v2 import decode_predictions

model = MobileNetV2(weights='imagenet')

# Open the webcam
cap = cv2.VideoCapture(0)

while True:
    # Read the frame from the webcam
    ret, frame = cap.read()

    if not ret:
        break

    # Preprocess the image for the model
    image = cv2.resize(frame, (224, 224))

    # Add a batch dimension
    data = np.expand_dims(image, axis=0)
    data = preprocess_input(data)

    predictions = model.predict(data)

    # Get the top prediction and its details
    top_prediction = decode_predictions(predictions, top=1)[0][0]
    class_label = top_prediction[1]  # Description of the most likely class
    confidence = top_prediction[2]  # Confidence score

    # Draw the class name and confidence on the image
    text = "{}: {:.2f}%".format(class_label, confidence * 100)
    cv2.putText(frame, text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    # Show the image
    cv2.imshow('Object Detection', frame)

    # Break the loop if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the webcam and destroy all windows
cap.release()
cv2.destroyAllWindows()
