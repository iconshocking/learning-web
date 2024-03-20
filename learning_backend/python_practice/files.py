"""read/write files with open():
- encoding: generally a good idea to specifiy encoding since otherwise it is platform dependent
- mode:
  - 'r' read (default) - position at start of file
  - 'w' write (i.e., overwrite - truncates any exisitng file to 0 bytes)
  - 'a' append (write w/o overwrite - postion at end of file and moves po)
  - '+' read and write
  - 'x' exclusive creation (fail if file already exists - good to use in combination with 'w')
  - 't' (default) or 'b': text or binary - encoding argument ignored in binary mode"""

# 'with' works like Java try-with-resources or Kotlin 'use', where the resource is automatically
# closed at the end of the block (defined by __exit__ method in python)
# (NOTE: in python, any defined __enter__ method is called before assignment, i.e., 'expression.__enter__() as var')
with open("test_files/test_file_for_IO.txt", mode="w+", encoding="utf-8") as f:
    f.write("Hello, world!\nHello, squirrel!")
    f.seek(0)  # move position to start of file
    print(
        f.read(5)
    )  # optional size argument - read 5 characters (at most, if EOF is reached first)
    f.seek(0)
    print(f.readline(), end="")
    print(f.readline())
    # second argument (whence) can be 0 (default - start of file), 1 (current position), or 2 (end of file);
    # BUT this only works in binary mode, except for seek(0, 2) which moves to end of file in text mode
    f.seek(-5 + f.tell())  # move 5 characters before current position
    print(f.read())

# call close() explicitly if not using 'with'

# JSON can be used to serialize/deserialize objects to/from strings
import json

# array is a valid top-level JSON object
x = [1, "simple", "list", {"a": "value"}]
print(json.dumps(x))  # evaluate JSON to string

with open("test_files/test_file_for_IO.json", mode="w+") as f:
    json.dump(x, f)  # write JSON to file

# module for moving files/dirs and making archives (uses zip/tarfile modules transitively)
import shutil

shutil.copy("files.py", "test_files/files_copy.py")
shutil.make_archive(
    "test_files_archive", format="zip", root_dir="test_files"
)
shutil.move("test_files_archive.zip", "test_files/test_files_archive.zip")

# module for listing files/directories matching a pattern
import glob

print(glob.glob("*.py"))
