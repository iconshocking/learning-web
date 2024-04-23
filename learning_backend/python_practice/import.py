# import syntax is similar to JS, but a bit more limited

import for_import.module as alias
from for_import import module
from for_import.module import importFunction
from for_import.module import importFunction as subalias

# 'from module import *' not recommended since it pollutes namespace (possibly shadowing other
# imports higher in the file) and static linters can't tell if called functions actually exist

# moduleFunctionMadeTopLevelFunction()
module.importFunction()
print(module.globalVar)
alias.importFunction()
importFunction()
subalias()

# modules are searched by name for import in the following order:
# 1. built-in modules
# 2. sys.path (includes current directory, PYTHONPATH, and user-installed packages in 'site-packages' dir)

# Python modules (aka files) compile to .pyc files (implementation-dependent bytecode), which are cached (in
# __pycache__ dir) and used if the source has not been modified since the last compilation. A few
# notes:
# 1. .pyc files should not be in version control because they are not necessarily cross-platform
#    since they are built only to be run on particular python versions and implementations of python
# 2. .pyc files are not faster than .py files (since all .py files are compiled to .pyc files before
#    being run); they are just faster to load

# returns a list of all the names in the module's namespace
print(dir(module))


def anotherFunction():
    pass


# returns a list of all the names currently defined in the LOCAL namespace, not any imported modules under provided namespaces
print(dir())


# sys.path determines the search path for modules (it is initialized from PYTHONPATH env var, but
# can be added to in code)
import sys

print("PATH:", sys.path)
try:
    import for_sys_import  # we could import via sys_import_module.for_sys_import, but this is for demonstration
except ModuleNotFoundError:
    print("for_sys_import not found")

sys.path.append("sys_import_module")

from for_sys_import import functionForExport

functionForExport()

# Can also add .pth files in 'site-packages' dir to add directories to sys.path (one dir per line),
# but this is awkward when working with version control since you likely aren't checking in your
# dependencies (can also use 'sitecustomize.py' to execute code on python startup, but it must also
# be in site-packages)
#
# Note: there may be ways to work around this, but I don't know atm whether it is something I should
# bother knowing just for Django development.
