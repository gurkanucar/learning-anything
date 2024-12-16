import cv2
import numpy as np
import imutils

# Start the camera
cap = cv2.VideoCapture(0)

# Create a kernel for the filters
kernel = np.ones((5,5),np.float32)/25

while True:
    # Capture frame-by-frame
    ret, img = cap.read()

    # Ensure the frame was successfully captured
    assert img is not None, "Frame could not be loaded."

    # Resize the frame for consistency
    img = imutils.resize(img, width=500)

    # Apply different filters and blurs
    dst = cv2.filter2D(img, -1, kernel)  # Filter using cv2.filter2D
    blur = cv2.blur(img, (15,15))  # Blur using cv2.blur
    gblur = cv2.GaussianBlur(img, (15,15), 0)  # Gaussian blur using cv2.GaussianBlur
    blackWhite = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # Black and white filter
    edges = cv2.Canny(blackWhite, 100, 200)  # Edge detection using cv2.Canny
    # Adjusting exposure and luminosity
    # Increase the brightness
    brightness = cv2.convertScaleAbs(img, alpha=1.2, beta=30)
    
    # Decrease the brightness
    darkness = cv2.convertScaleAbs(img, alpha=0.8, beta=-30)

    # Change hue
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    hsv[..., 0] = hsv[..., 0] + 30  # Add 30 to the hue value
    hueChanged = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)

    # Show the images
    cv2.imshow('Original', img)
    cv2.imshow('Filtered', dst)
    cv2.imshow('Blur', blur)
    cv2.imshow('Gaussian Blur', gblur)
    cv2.imshow('Edges', edges)
    cv2.imshow('Black & White', blackWhite)
    cv2.imshow('Brightened', brightness)
    cv2.imshow('Darkened', darkness)
    cv2.imshow('Hue Changed', hueChanged)

    # Break the loop on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the capture and destroy all windows
cap.release()
cv2.destroyAllWindows()
