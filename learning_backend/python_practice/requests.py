from urllib.request import urlopen

with urlopen("https://worldtimeapi.org/api/timezone/etc/UTC.txt") as response:
    for line in response:
        line = line.decode()  # Convert bytes to a str
        if line.startswith("datetime"):
            print(line.rstrip())

# data compression
import gzip

data = "Hello, world!"
compress = gzip.compress(data.encode("utf-8")) # have to encode to bytes
print(compress)
print(gzip.decompress(compress).decode("utf-8")) # have to decode to str
