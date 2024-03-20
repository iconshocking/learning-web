def importFunction():
    print("I am importFunction")


globalVar = "I am globalVar"

#  underscore prefix is more important as a signal to other programmers/files that this reference is
#  not meant for external use, rather than actually hiding it from 'import *'
_hiddenVarWithUnderscore = "I am hidden from 'import *' by my underscore prefix"
#  __all__ not that useful since no one should use 'import *' anyway
hiddenVar = "I am hidden from 'import *' not being in __all__"
__all__ = ["importFunction", "globalVar"]

# check to see if the module is being run directly, to avoid running on import
if __name__ == "__main__":
    print("what is your name?")
    print("hi, " + input())
