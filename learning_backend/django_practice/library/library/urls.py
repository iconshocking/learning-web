"""
URL configuration for library project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

import re
from typing import List

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import URLPattern, URLResolver, include, path, re_path
from django.views.generic import RedirectView
from django.views.static import serve

urlpatterns: List[URLResolver | URLPattern] = (
    [
        # put this first to intercept the admin/doc/ URL
        path("admin/doc/", include("django.contrib.admindocs.urls")),
        # default generated
        path("admin/", admin.site.urls),
        path("core/", include("core.urls")),
        path("catalog/", include("catalog.urls")),
        # "" instead of "/" since django always computes urls from the project root
        path("", RedirectView.as_view(url="/catalog/", permanent=True)),
        path("practice/", include("practice.urls")),
        path("__debug__/", include("debug_toolbar.urls")),
    ]
    + [
        # this duplicates the static serving function to be able to serve media files from django in
        # production for now (not ideal, but better than nothing for now)
        re_path(
            r"^%s(?P<path>.*)$" % re.escape(settings.MEDIA_URL.lstrip("/")),
            serve,
            kwargs={"document_root": settings.MEDIA_ROOT},
        )
    ]
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
)  # serve media files in development
# + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# The line above only serves static assets when DEBUG=True in settings.py (production serving is
# handled elsewhere) and ONLY serves the STATIC_ROOT folder (no discovery like the
# django.contrib.staticfiles app).
#
# It is redundant to django.contrib.staticfiles.
