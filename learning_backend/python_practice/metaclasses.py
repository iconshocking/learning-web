# Metaclasses are the constructors of class objects (not instances) in python
class Foo(object):
    bar = "bar val"


print(Foo.bar)
# 'type' should be the parent class of all metaclasses (which can also be functions but classes are
# more common and clear for OOP)
print(type("Foo", (), {"bar": "bar val"}).bar)  # type: ignore


# the main purpose of metaclasses is to modify the class object before it is created, generally to
# provide a simple API over a more complex implementation (ex.: django fields)
class UpperAttrLowerValueMetaclass(type):
    # cls is the metaclass, clsname is the name of the class, bases are the parent classes, and
    # attrs are the defined attributes
    def __new__(cls, clsname, bases, attrs):
        # dict comprehension
        uppercase_attrs = {
            (attr if attr.startswith("__") else attr.upper()): (
                v.lower() if isinstance(v, str) else v
            )
            for attr, v in attrs.items()
        }
        return super().__new__(cls, clsname, bases, uppercase_attrs)


class Foo2(object, metaclass=UpperAttrLowerValueMetaclass):
    lower = "VAL"


print(Foo2().LOWER)  # type: ignore
