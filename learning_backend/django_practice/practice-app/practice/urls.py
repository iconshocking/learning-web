from django.urls import path
from django.views.generic import DetailView

from .models import SimpleModel
from .views import ConcreteOfAbstractModelFormView, CrispyFormView, ExampleFormView, ExampleFormViewAlt, ExampleFormViewSimple, ExampleQueriesView

# app_name is used to namespace the URL names, which allows for reverse URL matching without name
# collision via changing the URL path name to "app_name:url_name"
app_name = __package__

urlpatterns = [
    # Generic Views are DetailView and ListView, which can be useful for admin pages (and
    # user-facing pages, but the URL option constraints can undesirable)
    path(
        # DetailView requires a primary key (i.e., 'pk') or 'slug' ending parameter
        f"admin/{app_name}/simplemodel_detail/<int:pk>",
        # class-based views need to be converted to a function with .as_view()
        DetailView.as_view(model=SimpleModel),
        # name to reference this url mapper in templates/code (such as using reverse())
        name="detailview_simplemodel",
    ),
    path("example-form/", ExampleFormView.as_view(), name="example_form"),
    path("example-form-alt/", ExampleFormViewAlt.as_view(), name="example_form_alt"),
    path(
        "example-form-simple/",
        ExampleFormViewSimple.as_view(),
        name="example_form_simple",
    ),
    path(
        "crispy-form/",
        CrispyFormView.as_view(),
        name="crispy_form",
    ),
    path(
        "concrete-of-abstract-model-form/<int:pk>/",
        ConcreteOfAbstractModelFormView.as_view(),
        name="concrete_of_abstract_model_form",
    ),
    path(
        "example-queries/",
        ExampleQueriesView.as_view(),
        name="example_queries",
    ),
]
