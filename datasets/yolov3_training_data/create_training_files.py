import os

def remove_file(file):
  if os.path.exists(file):
    os.remove(file)

def remove_images_not_annotated():
  for file in os.listdir():
      if file.endswith('.jpg'):
        annotation_file = os.path.splitext(file)[0] + '.txt'
        if not os.path.exists(annotation_file):
          os.remove(file)
          print(f"removed file {file}")


def create_files_for_training(drive_folder_data, drive_folder_weights):
  remove_file('labelled_data.data')
  remove_file('classes.names')
  remove_file('train.txt')
  remove_file('test.txt')

  c = 0;

  with open('classes.names', 'w') as names, \
    open('classes.txt', 'r') as txt:

    for line in txt:
        names.write(line)
        c += 1

  with open('labelled_data.data', 'w') as data:
    data.write('classes = ' + str(c) + '\n')
    data.write('train = ' + drive_folder_data + '/' + 'train.txt' + '\n')
    data.write('valid = ' + drive_folder_data + '/' + 'test.txt' + '\n')
    data.write('names = ' + drive_folder_data + '/' + 'classes.names' + '\n')
    data.write('backup = ' + drive_folder_weights)

  p = []
  for current_dir, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.jpeg') or f.endswith('.jpg') or f.endswith('.png'):
            path_to_save_into_txt_files = drive_folder_data + '/' + f
            p.append(path_to_save_into_txt_files + '\n')

  p_test = p[:int(len(p) * 0.15)]
  p = p[int(len(p) * 0.15):]

  with open('train.txt', 'w') as train_txt:
    for e in p:
      train_txt.write(e)

  with open('test.txt', 'w') as test_txt:
    for e in p_test:
      test_txt.write(e)


remove_images_not_annotated()
create_files_for_training('training_data', 'trained_weights')