import os
import numpy as np
import cv2

MAX_LABEL = 4
IMAGE_SHAPE = 128, 64, 3

def read_image_directory_to_str(directory):
    image_filenames, ids, cameras = [], [], []
    for filename in sorted(os.listdir(directory)):
        filename_base, ext = os.path.splitext(filename)
        if '.' in filename_base:
            # Some images have double filename extensions.
            filename_base, ext = os.path.splitext(filename_base)
        if ext != ".jpg":
            continue  # Not an image.
        rc_car_id, camera_str, _, _ = filename_base.split('_')
        image_filenames.append(os.path.join(directory, filename))
        ids.append(int(rc_car_id))
        cameras.append(int(camera_str[1:]))
    return image_filenames, ids, cameras


def read_image_directory_to_image(directory):
    image_filenames, ids, cameras = read_image_directory_to_str(directory)

    filenames, ids, camera_indices = (
        read_image_directory_to_str(directory))

    images = np.zeros((len(filenames), ) + IMAGE_SHAPE, np.uint8)
    for i, filename in enumerate(filenames):
        if i % 1000 == 0:
            print("Reading %s, %d / %d" % (directory, i, len(filenames)))
        image = cv2.imread(filename, cv2.IMREAD_COLOR)
        images[i] = cv2.resize(image, IMAGE_SHAPE[:2][::-1])
    ids = np.asarray(ids, dtype=np.int64)
    camera_indices = np.asarray(camera_indices, dtype=np.int64)
    return images, ids, camera_indices


def read_train_split_to_str(dataset_dir):
    image_directory = os.path.join(dataset_dir, "image_train")
    return read_image_directory_to_str(image_directory)


def read_train_split_to_image(dataset_dir):
    image_directory = os.path.join(dataset_dir, "image_train")
    return read_image_directory_to_image(image_directory)


def read_test_split_to_str(dataset_dir):
    image_directory = os.path.join(dataset_dir, "image_test")
    return read_image_directory_to_image(image_directory)


def read_test_split_to_image(dataset_dir):
    image_directory = os.path.join(dataset_dir, "image_test")
    return read_image_directory_to_image(image_directory)