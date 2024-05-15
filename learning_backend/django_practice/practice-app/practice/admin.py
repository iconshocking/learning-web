from typing import override

from django.contrib import admin
from django.http import HttpRequest
from django.utils.text import slugify

from .models import (
    BaseForProxyModel,
    ConcreteOfAbstractModel,
    ExtendedNonAbstractModel,
    ParentNonAbstractModel,
    ProxyModel,
    SimpleModel,
)

# Register your models here.

admin.site.register(BaseForProxyModel)
admin.site.register(ProxyModel)


# decorator is the same as admin.site.register(ConcreteOfAbstractModel, ConcreteOfAbstractModelAdmin)
# (note: a custom admin site can be passed to the decorator as well)
@admin.register(ConcreteOfAbstractModel)
class ConcreteOfAbstractModelAdmin(admin.ModelAdmin):
    # admin.ModelAdmin subclassing allows for customization of the admin pages

    # custom actions accessible on the model's list page (will always include bulk delete action)
    actions = []
    # creates date filtering options on the model's list page
    date_hierarchy = "field3"
    # currently only works for DB NULLs and empty colletions; will work for empty string in a later version of Django
    empty_value_display = "OG EMPTY FOR ALL"

    # decorator can also be set on a non-method function OR a method/property in the model itself
    @admin.display(
        # same as 'verbose_name' in the model field)
        description="Base field",
        # can define empty_value_display on a per-field basis
        empty_value="(--EMPTY--)",
        # this defines which field to sort by when sorting by this field in admin
        ordering="field",
    )
    def view_field(self, obj: ConcreteOfAbstractModel):
        return obj.field if obj.field else None
        # when needing to display HTML, use format_html() to escape fields (default behavior) while
        # still supporting your own HTML.
        # - ex: 'return format_html("<span style="color: #{};">{}</span>", obj.field1, obj.field2)'

    # any field that is either 1) not editable or 2) a callable can be added here to support display
    # in the insert/edit view (otherwise, they will not be displayed)
    readonly_fields = ("id", "view_field", "slug")

    # fields (in order) to be displayed on the model insert/edit view (can use 'exclude'
    # alternatively)
    # - tuples are displayed on the same row (if room available)
    # - note: fields must be editable to be displayed
    # - note: make sure to include required fields if you want to be able to add models via admin
    # fields = (("field", "field2"), "field3", "foreign_key_field")

    # more advanced 'fields' display options (cannot be used with 'fields')
    # - supports same tuple format as 'fields'
    fieldsets = [
        (  # header of the fieldset (or None for no header)
            None,
            {
                # CSS classes to apply to the fieldset (can define custom classes)
                # - 'collapse' hides the fieldset by default
                # - 'wide' makes the field take up more width
                # - 'extrapretty' does something???
                "classes": ("wide"),
                "fields": [
                    "id",
                    (
                        "view_field",
                        "field",
                    ),
                    "field2",
                    "field3",
                    "slug",
                ],
                # supports HTML
                "description": "<h2><strong>This is a description of the fieldset</strong></h2>",
            },
        ),
        (
            "Advanced options",
            {
                "classes": ("collapse",),
                "fields": ("foreign_key_field", "self_friends", "self_enemies"),
            },
        ),
    ]

    # useful for many-to-many relationships with a lot of options (supports filtering and clear
    # un/chosen buckets)
    filter_horizontal = ("self_friends",)
    # 'filter_vertical' also available

    # can pass a custom form class with 'form' attribute, but it will override a lot of the
    # ModelAdmin settings, so it is often preferable to override 'get_form()' instead and add
    # functionality (like custom validation)
    @override
    def get_form(self, request, obj=None, change=False, **kwargs):
        return super().get_form(request, obj, change, **kwargs)

    # 'formfield_overrides' is a mapping of fields to dicts of arguments that will be passed to the
    # form field's __init__()

    # formfield_overrides = {
    #     models.TextField: {"widget": MyCustomEditorWidget},
    # }

    # renders relation fields as raw ids in the model insert/edit view with alookup button popup
    # (good for large DBs)
    raw_id_fields = ("foreign_key_field",)

    # fields (in order) to be displayed on the the model list view
    # - overrides the display via the __str__ method
    # - accepts name for ANY attribute of the model, so callables work too
    list_display = (
        "id",
        "view_field",
        "field2",
        "field3",
        "slug",
        "foreign_key_field",
    )
    # defines which fields are sortable in the model's list view (default is all fields)
    sortable_by = ("id",)

    # defines which fields are clickable links to the model's detail view (default is the first
    # field in 'list_display')
    list_display_links = ("id", "view_field")

    # defines which fields are editable in the model's list view (USE WITH CAUTION)
    list_editable = ("field2",)

    # defines which fields support filters on the model's list view (by default, only filters by
    # exact options, so only useful really for fields with few options (e.g. booleans) unless
    # customizing)
    list_filter = (
        "field",
        "field2",
    )

    # defines max displayable records on the model's list view (button only appears if there are
    # fewer total records that this value)
    list_max_show_all = 200  # default value
    list_per_page = 2  # default value is 100
    # shows number of records matching the current filter in the model's list view (default of ALLOW
    # should be left unchanged or set to NEVER for large DBs - ALWAYS is not recommended.)
    show_facets = admin.ShowFacets.ALLOW

    # - when False (default), the query will fetch any related model objects that are listed by a
    # relation field in 'list_display';
    # - when True, the query will fetch all related model objects regardless of displayed list
    # fields
    # - (NOTE: it is more performant to perform fewer, more complex queries)
    list_select_related = False
    # 'ordering' can override model's ordering

    # 'paginator' can override the default paginator (sounds too advanced for me atm)

    # for the key field in the dict, concatenates fields in the tuple to create a slug on INITIAL
    # CREATION of the record from ADMIN ONLY (technically doesn't have to be a slug, but this aligns
    # most with the use case)
    #
    # NOTE: this is ONLY useful for records created from the admin interface, so the use case for
    # this is minimal (AND it conflicts with non-editable fields, which makes things so difficult as
    # to not be recommended)
    # prepopulated_fields = {"slug": ("field", "field2")}

    # Changes a relation field to have a searchable dropdown instead, which is populated
    # asynchronously, so advisable for performance on large DBs
    #
    # NOTE: requires 'search_fields' to be set on the ModelAdmin of the related model
    autocomplete_fields = ("self_enemies",)
    # fields that can be used to search for records in the model's list view or autocomplete fields
    # - supports '__' for related model fields
    # - more extension customizations can be done via overriding 'get_search_results()'
    #
    # NOTE: if this is a very common operation, make sure that the fields are indexed in the DB
    # using a text-search index (GIN index / FTS5 / whatever for the specific database)
    search_fields = (
        "field__iexact",  # case-insensitive exact match
        "field2__istartswith",  # case-insensitive starts with
        # "slug__search", # full-text search
        "slug",  # case-insensitive contains
    )
    search_help_text = "search field help info under search bar"
    # defaults to True; when False, the total record count is not displayed in the model's list view
    # (this query can be slow for large DBs)
    show_full_result_count = False

    # replaces "save and add another" button with "save as new" button, whicch creates a new record
    save_as = True
    # "save" button redirects to the list view after saving
    save_as_continue = False
    # defaults to True; when False, clears any list view filters when returning to list view after
    # save (when save_as_continue is True) or after record creation/deletion
    preserve_filters = False

    # hides the "view on site" button in the model's detail view when the model has
    # get_absolute_url() defined
    view_on_site = False

    # add_form_template, change_form_template, change_list_template, delete_confirmation_template,
    # object_history_template, delete_selected_confirmation_template, action_confirmation_template,
    # object_history_template, and popup_response_tempalte can be used to customize all the
    # templates used for the respective admin views

    # save/delete_model() can be overridden to perform additional actions on pre/post save/delete
    # (MUST perform the super call always; the override is for additional actions, not vetoing)

    # many other methods can be overridden to customize the admin view further

    class Media:
        # CSS and JS files to include in the admin view
        css = {"all": []}
        js = []

    # 'form' can be used to customize the form used for the model in admin for custom validation


@admin.register(ParentNonAbstractModel)
class ParentNonAbstractModelAdmin(admin.ModelAdmin):
    # 'inlines' allows for viewing/editing of related models on the same page as the parent model
    # (more complex to set up inlines for many-to-many relationships, but not too bad)
    # - NOTE: the RELATED model sets the 'inlines' attribute (here, the parent model is the related)
    class ConcreteOfAbstractModelInline(
        admin.TabularInline
    ):  # also supports 'admin.StackedInline'
        # Inlines have most of the same attributes as ModelAdmin with a few additional ones

        model = ConcreteOfAbstractModel
        # only needs to be set if more than one foreign key field to the same related model
        fk_name = "foreign_key_field"
        # 'formset/form/template' can be used to customize the formset/form/template, which is a
        # little beyond me atm

        # just like 'fieldset' in ModelAdmin
        classes = ("collapse",)
        # 'extra' sets the number of forms to default display AFTER any already-related foreign key
        # model forms (more can be added dynamically via the button on the page)
        #
        # NOTE: extra is always 0 if has_add_permission() returns False
        extra = 1  # override get_extra() to dynamically set
        # 'min/max_num' sets the maximum number of forms to display (0 for no limit)
        max_num = 3  # override get_max_num() to dynamically set
        # override the 'model' attribute to customize the inline form
        verbose_name = "Related Concrete Model"
        # whether the related object can be deleted from the inline form (also can use
        # has_delete_permission())
        can_delete = False
        # whether to show an edit link for the related object in the inline form
        show_change_link = True

        # renders like list view instead of form when False
        @override
        def has_change_permission(self, request: HttpRequest, obj=None) -> bool:
            return False

        # defaults to True; when False, the add button is hidden and no extras are shown
        def has_add_permission(self, request: HttpRequest, obj=None) -> bool:
            return True

    inlines = [
        ConcreteOfAbstractModelInline,
    ]


admin.site.register(ExtendedNonAbstractModel)


@admin.register(SimpleModel)
class SimpleModelAdmin(admin.ModelAdmin):
    # replaces drop down menu with radio buttons for choice or foreign key fields
    radio_fields = {"field_name": admin.HORIZONTAL}
