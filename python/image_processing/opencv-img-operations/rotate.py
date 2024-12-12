import cv2
import imutils
import numpy as np

cap = cv2.VideoCapture(0)
while True:
    ret, img = cap.read()


   # Get the dimensions of the image
    height, width = img.shape[:2]
    
    # Define the margins to crop from each side of the image
    left = top = 50
    right = width - 50
    bottom = height - 50
    
    # Crop the image
    cropped_img = img[top:bottom, left:right]
    

    
    # Rotate the image by 180 degrees
    rotated_img = imutils.rotate(img, angle=180)
    
    # Shift the image 50 pixels to the right and 20 pixels down
    translated_img = imutils.translate(img, 50, 20)
    
    # Flip the image horizontally (mirror effect)
    flipped_img = cv2.flip(img, 1)
    
    # Combine all the processed images and the original image
    combined_img1 = np.hstack((img, rotated_img))
    combined_img2 = np.hstack((translated_img, flipped_img))
    fiinalImg = np.vstack((combined_img1,combined_img2))

    cv2.imshow("Image Processing with imutils", fiinalImg)
    cv2.imshow("Image Processing with imutils cropped", cropped_img)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
