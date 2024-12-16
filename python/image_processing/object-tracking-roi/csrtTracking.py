import cv2

# Mouse callback function to draw the rectangle
def draw_rectangle(event, x, y, flags, param):
    global frame, roi, drawing, roi_defined, tracker

    if event == cv2.EVENT_LBUTTONDOWN:
        roi = [x, y, 0, 0]
        drawing = True

    elif event == cv2.EVENT_MOUSEMOVE:
        if drawing:
            roi[2] = x - roi[0]
            roi[3] = y - roi[1]

    elif event == cv2.EVENT_LBUTTONUP:
        drawing = False
        if roi[2] > 0 and roi[3] > 0:  # Check if ROI is valid
            roi_defined = True
            # Initialize or reset the tracker with the new ROI
            tracker = cv2.TrackerCSRT_create()
            tracker.init(frame, tuple(roi))

# Initialize variables
drawing = False     # True if the mouse is pressed
roi_defined = False # True if the ROI is defined
roi = [0, 0, 0, 0]  # Initial ROI
tracker = cv2.TrackerCSRT_create()

# Initialize video capture
cap = cv2.VideoCapture(0)

# Set the mouse callback function for the window
cv2.namedWindow("Frame")
cv2.setMouseCallback("Frame", draw_rectangle)

while True:
    # Read a new frame
    ret, frame = cap.read()
    if not ret:
        break

    # Update tracker and draw rectangle if ROI is defined
    if roi_defined and frame is not None:
        success, box = tracker.update(frame)
        if success:
            p1 = (int(box[0]), int(box[1]))
            p2 = (int(box[0] + box[2]), int(box[1] + box[3]))
            cv2.rectangle(frame, p1, p2, (0, 255, 0), 2)

    # Draw the ROI as it's being defined
    if drawing:
        p1 = (roi[0], roi[1])
        p2 = (roi[0] + roi[2], roi[1] + roi[3])
        cv2.rectangle(frame, p1, p2, (255, 0, 0), 1)

    # Display result
    cv2.imshow("Frame", frame)

    # Exit on ESC key
    if cv2.waitKey(1) & 0xFF == 27:  # ESC key
        break

cap.release()
cv2.destroyAllWindows()
