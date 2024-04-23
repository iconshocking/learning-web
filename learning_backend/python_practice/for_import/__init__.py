"""Python defines packages as a collection of modules (aka scripts/files), but there are 2 kinds:
1. Standard packages: a directory with an __init__.py file (can be empty) that defines the package
   as a single directory
2. Namespace packages: directories without __init__.py that are imported by modules and can be a
   collection of different dirs with the same top-level paths
    - Ex: 'root/packageA/path/file/moduleA.py' and 'root/packageB/path/file/moduleB.py' allows for
      calling 'from path.file import moduleA, moduleB' (with no name-clash issues) if 'packageA' and
      'packageB' are in sys.path
    - Exists in Python 3.3+ (2012, so supported in all modern versions)"""

# make sure package name is not a keyword or built-in to avoid import issues

# this files will always be run when a module from this package is imported, so can be used for setup
print("package initing")

# __all__ in a sub/package __init__.py file defines what modules are imported when 'from package import *' is used
# (AGAIN generally this isn't useful since 'import *' is not recommended)
__all__ = ["module"]  # doesn't expose explicit_only_module

# NOTE: any import statement within submodules or __init__ files will expose those transitive
# imports (safely via namespace chaining) to importers of the package (this can be useful for tools
# such as  Django that expect a specific module structure)
from .module import importFunction as moduleFunctionMadeTopLevelFunction
