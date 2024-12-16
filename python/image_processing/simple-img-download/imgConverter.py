import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))

from PIL import Image
import os
import shutil

source_directory = './dataset-android/phoneBack'

output_directory = './dataset2'

os.makedirs(output_directory, exist_ok=True)

# Get a list of all files in the source directory
file_list = os.listdir(source_directory)

# Sort the files to ensure proper ordering
file_list.sort()

# Initialize a counter for numbering the files
counter = 1

# Iterate through the files
for filename in file_list:
    # Build the full path for the file in the source directory
    source_file_path = os.path.join(source_directory, filename)

    # Check if the file is a PNG image (ends with .png)
    if filename.lower().endswith('.png'):
        # Open the PNG image
        with Image.open(source_file_path) as img:
            # Convert the image to JPG format
            img = img.convert('RGB')
            
            # Create the new filename with "img_" prefix and a number
            new_filename = f'img_{counter}.jpg'
            new_file_path = os.path.join(output_directory, new_filename)

            # Save the image in JPG format with the new name in the output directory
            img.save(new_file_path)
            
            # Increment the counter for the next file
            counter += 1

    # If the file is already a JPG, just rename it and move it to the output directory
    elif filename.lower().endswith('.jpg'):
        new_filename = f'img_{counter}.jpg'
        new_file_path = os.path.join(output_directory, new_filename)
        
        # Rename the file
        os.rename(source_file_path, new_file_path)
        
        # Increment the counter for the next file
        counter += 1

print("Conversion and renaming completed.")
