import sys

# useful for simple command line style utilities
print(sys.argv)  # 0 index is the script name
sys.stderr.write("random error")

# better for more complex command line arguments
import argparse

parser = argparse.ArgumentParser(description="show top lines from file")
parser.add_argument("filename", nargs=1)
parser.add_argument("-l", "--lines", type=int, default=10)
args = parser.parse_args()
print(args)
print(args.filename)
print(args.lines)

sys.exit(0)  # 0 is the standard success exit code
