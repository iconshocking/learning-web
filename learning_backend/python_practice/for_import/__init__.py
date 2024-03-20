# required to make this directory a package (a collection of modules, aka scripts)

# make sure package name is not a keyword or built-in to avoid import issues

# this files will always be run when a module from this package is imported, so can be used for setup
print("package initing")

# __all__ in a sub/package __init__.py file defines what modules are imported when 'from package import *' is used
# (AGAIN generally this isn't useful since 'import *' is not recommended)
__all__ = ["module"]  # doesn't expose explicit_only_module

# NOTE: any import statement within submodules or __init__ files will expose those
# transitive imports (safely via namespace chaining) to importers of the package
