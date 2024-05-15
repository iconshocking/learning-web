from collections import (
    deque,
)
from functools import cmp_to_key

# default sequences (list, tuple, range), sets, and dicts in python support the 'in' operator
# (note: 'in' is also used for substring checks in strings)
print(1 in set([1]))
print(1 in [1])
print(1 in (1, 2))
print(1 in range(2))
print(1 in {1: 2})
print("ing" in "string")

# can iterate over dictionary keys and values via items()
for key, value in {"a": 1, "b": 2}.items():
    print(key, value, end=", ")
print()

# default sequences (list, tuple, range) in python are indexable, slice-able, and iterable;
# BUT ONLY lists are mutable
print(range(10)[5])
# To be indexable, a class must implement __getitem__ method

# lists can contain any type of value (like JS arrays)
lst = [0, "1", "two", 3.0]
# retrieval
print("retrieval", lst[0])
# retrieval of slice
print("slice", lst[0:2:1])  # start, end (exclusive), step
print("slice defaults", lst[::])  # use default start, end, step (0, len(lst), 1)
print(
    "slice reverse", lst[::-1]
)  # only including step (when step is negative, start and end defaults are reversed)
lst = list((0, 1, 2))  # list() constructor accepts any iterable
print(lst)
lst = [0]
lst.append(1)  # to end
print(lst)
lst.pop(0)  # index of removal
print(lst)
lst.remove(1)  # first occurence of value
print(lst)
lst.extend([0, 1])  # to end
print(lst)
lst.insert(1, -1)  # index, value
print(lst)
# throws ValueError if not found, not -1 like in JS
print(lst.index(1, 2, 3))  # value, start, end (exclusive)
(lst := [0, 1, 2, 3]).sort(key=cmp_to_key(lambda a, b: b - a))  # in place
print(lst)
(lst := [0, 1, 2, 3]).reverse()  # in place
print(lst)
list2 = (lst := [0, 1, 2]).copy()  # shallow copy
print(list2)
# python, unlike JS, supports list concatenation with +
print([1, 2, 3] + [4, 5, 6] == [1, 2, 3, 4, 5, 6])
# can replace parts of a list with slice assignment (this mutates the original list)
a = [1, 2, 3, 4, 5, 6]
a[0:2] = [8, 9]
print(a)
a[3:6] = []  # remove elements
print(a)

# use deque ("deck") if you need efficient appends and pops from both ends
queue = deque([1, 2, 3])
queue.popleft()
print(queue)
queue.appendleft(1)
print(queue)

# some more advanced list operations
# zip creates a tuple from the nth elements of each iterable
print(
    *zip([1, 2], [3, 4])
)  # returns an iterator so we have to unpack it or make it a list

# tuples are immutable, but can be used to return multiple values from a function
tuple = (1, 2)  # parens are optional, but encouraged for readability IMO
print(tuple)
# uncommon use cases:
# 1. single element tuple - requires trailing comma (otherwise it's just a parenthesized expression)
tuple = (1,)
print(tuple)
# 2. empty tuple
tuple = ()
print(tuple)

# dictionaries function like JS objects EXCEPT that the keys must be immutable (tuples are supported
# if all elements are immutable)
a = {"a": 1, "b": 2}
a["c"] = 3 # single key-value assignment
print(a)
a.update({"c": 4, "cc": 5}) # multiple key-value assignment
print(a)
a = dict(c=-1, d=-2)  # keyword arguments
print(a)
a = dict([("e", 10), ("f", 11)])  # list of key-value tuples
print(a)
print({} == dict())  # empty dict
print(a["e"])  # retrieval
# retrieval will throw KeyError if not found
try:
    print(a["g"]) # type: ignore
except KeyError as e:
    print(e)
# use get(key, optional_default) to avoid KeyError when key is not guaranteed (default is None)
print(a.get("g", "default")) # type: ignore
# can delete a key with del or pop()
a= {"a": 1, "b": 2, "c": 3}
del a["a"]
a.pop("b") # useful for getting the value at the same time
print(a.pop("b", "Not found")) # also useful to avoid KeyError if key doesn't exist
print(a)


# sets use the same synatx as dicts, but without key-pairs
a = {1, 2}
a.add(3)
a.add(3)  # no effect
print(a)
a.remove(3)
print(a)
a = set()  # empty set must be created with set() constructor since {} is an empty dict
print(a)

# arrays are supported when storing a single type of value (like JS typed arrays)
import array

a = array.array("I", [1, 2, 3])  # type code "I" is for unsigned int
print(a)
try:
    # must be same type, unlike list
    a.append("hi")
except TypeError as e:
    print(e)
