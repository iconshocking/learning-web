# list comprehension syntax [expression for item in iterable if condition]
from functools import reduce
from operator import ge

list = [x + 10 for x in range(10)]  # syntax is same as single line if statement
print(list)

# can nest loops
list = [
    (x, y)
    for x in [
        1,
        2,
    ]
    for y in [1, 2]
]
print(list)
# equivalent (i.e., loops wrap successive loops)
list2 = []
for x in [1, 2]:
    for y in [1, 2]:
        list2.append((x, y))
print(list == list2)

# should be used in place of map/filter (which are top-level functions in python) to be 'pythonic';
# python doesn't have for-each, so just use a normal loop
list = [(x, y) for x in [1, 2] for y in [1, 2] if x != y]  # filter
print(list)

list = [(x + 10, y - 10) for (x, y) in list]  # map
print(list)

# reduce cannot be written very cleanly in python, due to the lack of parens and only single-line
# lambdas, so prefer normal for-loops

# consider the expression as being run within the final for loop (i.e., single line control flows
# have the initial expression first in the syntax)
list = [
    "list:" + str(numlist) + " elem:" + str(num)
    for numlist in [
        [1],
        [2],
        [3, 4],
    ]
    for num in numlist
]
print(list)

# can nest comprehensions
matrix = [
    [
        1,
        2,
    ],
    [
        3,
        4,
    ],
]
# note the nested brackets here: the nested comprehension is the expression for the root-level comprehension
thing = [[row[i] for row in matrix] for i in range(2)]
print(thing)

# equivalent
thing2 = []
for i in range(2):
    # following is the expanded form of the nested comprehension 'thing2.append([row[i] for row in matrix])'
    thing3 = []
    for row in matrix:
        thing3.append(row[i])
    thing2.append(thing3)

print(thing == thing2)

# sets and dicts also support comprehensions
a = {char for char in "sstringss"}  # set
print(a)
# dict comprehension is often less used vs dict() with key-value pair tuples or keyword arguments
a = {idx: char for idx, char in enumerate("sstringss")}  # dict
print(a)

# generator expressions are like comprehensions, but they don't create the sequence object in memory
# and only are evaluated one item at a time as accessed (i.e. are lazy)

# they are useful when providing an iterable to a function where creation of a list object isn't necessary
val = sum(x * x for x in range(4))
# note: ranges are also lazy, but this avoids the creation of a new list when using comprehension syntax
print(val)
