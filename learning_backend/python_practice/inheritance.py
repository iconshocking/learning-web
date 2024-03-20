from abc import ABC, abstractmethod, abstractproperty
from functools import singledispatch, singledispatchmethod
from typing import LiteralString, overload, override

from classes import Example

# inheritance works essentially the same as in Java, but multiple class inheritance is allowed since
# there is no class-interface divide in python


# inheritance (looks like a constructor call kind of)
class SubExample(Example):
    def __init__(self, value=None):
        if value is None:
            # super() function works the same as super variable in Java/JS when inheriting from
            # classes that have no multiple inheritance in their hierarchy
            super().__init__()
        else:
            super().__init__(value)

    @override  # mainly for typing assistance at compile time (not required, but recommended)
    def returnValue(self):
        return "sub " + super().value


# all true
print(isinstance(SubExample(), Example))  # takes an instance as first argument
print(issubclass(SubExample, Example))  # takes a class as first argument
print(issubclass(Example, Example))  # is also true if same class


# In cases of multiple inheritance in python, super() doesn't return the parent class of the caller;
# it returns an object that adheres to MRO (Multiple Resolution Order) for traversing the remaining
# inheritance hierarchy to find the next class with the relevant attribute.

# The rules for MRO are as follows:
# - preserve left-to-right order of classes in all inheritance tuples in the hierarchy
# - each class is visited only once


# The more explicit algorithm for MRO is as follows (using the following classes to illustrate):
# 1. Create the linearization of the class, which is the class + the merge of the linearization of
# each parents and the list of parents (in tuple order).
#   - For our example (ignoring root object parent class): L[D] = [D] + merge(L[B], L[C], [B, C]) =
#       [D] + merge([B, A], [C, A], [B, C])
# 2. Take the head of the first list in the merge, and if this head is not in the tail of any of the
# other lists (excluding lists that are only of size 1), add it to the linearization and remove it
# from the other lists in the merge.
#   - [D] + merge([B, A], [C, A], [B, C]) = [D, B] + merge([A], [C, A], [C])
# 3. Otherwise look at the head of the next list and attempt again.
# 4. If no good head can be found before the merge is complete, the class will throw a compile-time
#    error.
# 5. Else, repeat until linearization is complete.
#  - [D, B] + merge([A], [C, A], [C]) = [D, B, C] + merge([A], [A]) = [D, B, C, A]
#       - (note how we don't choose A first because it is the tail of the second list)


class A:
    def foo(self):
        print("A's foo")


class B(A):
    def foo(self):
        print("B's foo")
        super().foo()


class C(A):
    def foo(self):
        print("C's foo")
        super().foo()


class D(B, C):
    def foo(self):
        print("D's foo")
        super().foo()


d = D()
# note how each call to super() returns the next object in the MRO relative to the class namespace
# making the super() call
d.foo()  # D's foo, B's foo, C's foo, A's foo
print(D.__mro__)  #  __mro__ is a tuple of the MRO for the class


class StrWithIntSupport(str):
    def __new__(cls, string=""):
        return super().__new__(cls, string)

    # here we will overload the + operator to also accept int

    @overload
    # can use pass instead of ... since these implementations are never run, but ... is customary
    # (... is a token for the singleton Ellipsis, similar to None, and can be used to check for
    # certain arguments in functions)
    def __add__(self, summee: int) -> str: ...

    @overload
    # overload ordering matters, so overloads of subtypes should be listed first
    def __add__(self, summee: LiteralString) -> str: ...

    @overload
    def __add__(self, summee: str) -> str: ...

    @override
    # ignore the error here
    def __add__(self, summee: str | int | LiteralString) -> str:
        return super().__add__(str(summee))

    # The @singledispatch decorator similarly can be used to similarly overload methods with
    # different types (but doesn't seem to play well with inheritance).
    #
    # (NOTE: the dynamic type is that of the first argument, so use @singledispatchmethod when
    # working with class methods, which moves the dynamic type to the first non-self/cls argument)

    @singledispatchmethod
    def custom(self, arg):
        return f"not implemented yet for type: {type(arg)}"

    @custom.register
    def _(self, arg: int):  # the function name doesn't matter here
        return f"i got an int: {arg}"

    @custom.register
    def _(self, arg: str):
        return f"i got a string: {arg}"


print(StrWithIntSupport("hi") + "hi")
print(StrWithIntSupport("hi") + 1)
print(StrWithIntSupport().custom(1))
print(StrWithIntSupport().custom("1"))
print(StrWithIntSupport().custom([]))


# The only way to provide interface-like behavior for unimplemented methods in python is via
# abstract classes. They can be created by extending the ABC class from the abc module.
class Abstract(ABC):
    @abstractmethod
    def abstractFunction(self): ...

    def concreteFunction(self):  # can also have concrete methods
        pass

    # use this combination instead of deprecated @abstractproperty decorator
    @property
    @abstractmethod
    def abstractProperty(self): ...


try:
    Abstract()  # can't instantiate abstract class
except TypeError as e:
    print(e)


class Concrete(Abstract):
    def abstractFunction(self):
        print("implemented function")

    @property
    def abstractProperty(self):
        print("implemented property")


Concrete().abstractFunction()
Concrete().abstractProperty
