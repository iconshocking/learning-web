# under-the-hood, python treats classes like a namespace that is stepped into, and a namespace is
# essentially just a dictionary; thus, classes in python are very simliar to classes in JS


def extension_method(self):
    print("I am an extension method")


class Example:
    """An example class."""  # accessible via __doc__ attribute

    value = "class-wide value"  # same as a static in JS, NOT an instance attribute
    # DO NOT do this unless you are SURE that another initializing-style function will
    # assign before access (because the attribute does not exist until assigned)
    unset_value: str

    # python has both a constructor (static and called first) and an initializer (an instance method
    # and called second)
    # - cls is the class object (not an instance)
    # - arguments are passed to the constructor, i.e., __init__(), and so must match its signature
    # - returns the instance, unlike __init__ whose return value is ignored
    # (NOTE: you RARELY need to override __new__ in python)
    def __new__(cls, *args, **kwargs):
        # parameters of (cls, value="instance value") would have worked too - constructor AND
        # initializer must both have any default parameters)
        print("constructor")
        return super().__new__(cls)

    # initializer
    def __init__(self, value="instance value"):
        print("initializer")
        # internal attributes must always be accessed via 'self.'
        self.value = value
        self._private = "private value"
        self.__private = "name-mangled private value"
        self._propertyVariable = "property value"

    # instance methods take first argument 'self' (name is a convention); this is because the class
    # namespace keeps reference to the function and passes the class instance argument to the method
    def returnValue(self):
        return self.value

    @staticmethod
    def __len__():
        return 100

    def getValue(self):
        return self.value

    # property decorator allows for creation of a "property" which is a getter (and optional setter
    # and/or deleter) method that can be accessed like an attribute
    @property  # the getter
    def propertyVariable(
        self,
    ):  # note the lack of underscore prefix to distinguish from the private attribute
        return self._propertyVariable

    @propertyVariable.setter
    def propertyVariable(self, value):
        self._propertyVariable = value

    # can also include deleter, which override del obj.propertyVariable calls

    # code can be run anywhere within a class in python, but it will only be evaluated the first
    # time the class namespace is created (i.e., when the class is parsed in the file)
    print("I run ONCE when the class definition is parsed in the file")
    # this allows for adding extension methods defined elsewhere to the class namespace (this can
    # even be done dynamically, but it is not recommended to reduce errors from referencing
    # non-existent attributes)
    extension = extension_method


# python uses duck-typing, so a class does not need to implement a class/interface to be usable in
# place of that type; the class just has to have the necessary attributes/methods
print(len(Example()))

# all attributes are public in python, but a _ prefix is a signal that the attribute should be
# considered private (double _ prefix actually triggers a name mangling mechanism, so only use if
# you understand the implications OR really need to avoid name collisions in subclasses)
example = Example()
print(example.value)
example.value = "new value"
print(example.value)
print(example._private)  # completely valid
print(
    example._Example__private
)  # name-mangled (according to class name) private attribute
print(Example.value)

# DO NOT DO THIS: attributes can be dynamically added and removed in python, but is not recommended
# since attributes should not generally be dynamic for a class

# example = Example()
# example.x = "thing"
# print(example.x)
# del example.x


# class methods and functions are the same with only 1 notable difference: methods insert the class
# instance as the first argument
method = Example("special value").getValue
# will always print "special value" since the instance is bound to the method (will also prevent garbage collection)
print(method())

print(example.propertyVariable)
example.propertyVariable = "new property value"
print(example.propertyVariable)

Example().extension()

print(
    Example().__class__
)  # <class '__main__.Example'> because the class is a namespace


# Overriding __new__ is rare, but can be useful for a few use cases, such as:
# 1. immutable types
class ReverseStr(str):
    def __new__(cls, string):
        return super().__new__(cls, string[::-1])


reverse = ReverseStr("hello")
print(reverse)
# the class internals are immutable since we are not storing the reversed string in an attribute
try:
    reverse[0] = "j"
except TypeError as e:
    print(e)


# 2. singletons
class Singleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance


# you can still access Singleton._instance, but users of Singleton would understand that is not intended
print(Singleton() is Singleton())


# python also has the concept of data classes which are essentially C-style structs (they do not have
# more advanced features like in Kotlin)
from dataclasses import dataclass


@dataclass
class DataClass:
    # note the required type hint for compilation (due to python syntax having no end-of-line)
    data: str
    value: str
    thing: str


# arguments are only positional, like C structs
data = DataClass("data-value", "value-value", "thing-value")
data.data = "new-data-value"
print(data)
