print("\nDEL OPERATOR")
# python uses reference counting for memory management and has a garbage collector to catch
# unreachable cyclic references (so don't worry about those)

# Python has a 'del' operator that removes a reference (does not free up the memory), but it should
# VERY RARELY be used.

# 1. PROPER USE CASE: remove a key from a dictionary
d = {"a": 1, "b": 2}
del d["a"]
print(d)

# 2. OKAY USE CASE: remove an item/slice from a list (usually prefer slice assignment)
lst = [1, 2, 3]
del lst[0:2]
print(lst)

# 3. RARE USE CASE: remove a variable (not necessary unless something was created in a global scope
#    and will never be garbage collected)
a = 1
del a
try:
    print(a)
except NameError as e:
    print(e)

# 4. BAD USE CASE: remove a class attribute - do NOT generally need to do this (just ignore or override)

print("\nWEAK REFERENCES")
# python supports weak references through the 'weakref' module
import gc
import weakref


# cannot use weak references with some built-ins (list, dict, etc.) so can't use them as targets
class A:
    pass


a = A()
ref = weakref.ref(a)
print(ref())
del a
gc.collect() # force garbage collection (do NOT do this normally unless there is a VERY good reason)
print(ref())

# also supports weak dictionaries and sets
d = weakref.WeakValueDictionary()
e = weakref.WeakKeyDictionary()
f = weakref.WeakSet()
