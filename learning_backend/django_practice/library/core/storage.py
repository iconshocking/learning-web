import os

from django.contrib.staticfiles.storage import ManifestStaticFilesStorage as Base


class HashOnlyManifestStaticFilesStorage(Base):
    # remove the original file after creating cache-busting hashed version
    def post_process(self, *args, **kwargs):
        process = super().post_process(*args, **kwargs)
        for name, hashed_name, processed in process:
            yield name, hashed_name, processed
            # do not remove files that were not hashed, such as debug-toolbar statics
            if processed and name != hashed_name:
                os.remove(self.path(name))
            else:
                print(name, hashed_name)
