import datetime
import uuid
from typing import override

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import UniqueConstraint
from django.db.models.functions import Lower
from django.urls import reverse


class Genre(models.Model):
    """Model representing a book genre."""

    name = models.CharField(
        max_length=200,
        # do not want duplicate genres
        unique=True,
        help_text="Enter a book genre (e.g. Science Fiction, French Poetry etc.)",
    )

    def __str__(self):
        """String for representing the Model object."""
        return self.name

    def get_absolute_url(self):
        """Returns the url to access a particular genre instance."""
        return reverse("catalog:book_detail", args=[str(self.id)])  # type: ignore

    class Meta:
        constraints = [
            # uniqueness constraint for provided expression
            UniqueConstraint(
                Lower(
                    "name"
                ),  # expression to apply (making lower case for case-insensitive comparison)
                name="genre_name_case_insensitive_unique",
                violation_error_message="Genre already exists (case insensitive match)",
            ),
        ]


class Book(models.Model):
    """Model representing a book (but not a specific copy of a book)."""

    title = models.CharField(max_length=200)
    author = models.ForeignKey("Author", on_delete=models.RESTRICT, null=True)

    summary = models.TextField(
        max_length=1000, help_text="Enter a brief description of the book"
    )
    isbn = models.CharField(
        "ISBN",  # verbose name
        max_length=13,
        unique=True,
        # 'help_text' supports HTML
        help_text='13 Character <a href="https://www.isbn-international.org/content/what-isbn'
        '">ISBN number</a>',
    )

    genre = models.ManyToManyField(Genre, help_text="Select a genre for this book")

    language = models.ForeignKey("Language", on_delete=models.SET_NULL, null=True)

    cover_image = models.ImageField(
        "Cover Image", upload_to="cover-images/", null=True, blank=True
    )

    def __str__(self):
        """String for representing the Model object."""
        return self.title

    def get_absolute_url(self):
        """Returns the URL to access a detail record for this book."""
        return reverse("catalog:book_detail", args=[str(self.id)])  # type: ignore

    @override
    def clean(self) -> None:
        if self.cover_image and self.cover_image.size > 1024 * 1024:
            raise ValidationError(
                "Image file too large: must be less than 1MB",
                code="cover_image_too_large",
            )


class BookInstance(models.Model):
    """Model representing a specific copy of a book (i.e. that can be borrowed from the library)."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        help_text="Unique ID for this particular book across whole library",
    )
    book = models.ForeignKey(Book, on_delete=models.RESTRICT, null=True)
    imprint = models.CharField(max_length=200)
    due_back = models.DateField(null=True, blank=True)

    class LOAN_STATUS(models.TextChoices):
        Maintenance = ("m", "Maintenance")
        OnLoan = ("o", "On loan")
        Available = ("a", "Available")
        Reserved = ("r", "Reserved")

    status = models.CharField(
        max_length=1,
        choices=LOAN_STATUS,  # type: ignore
        blank=True,
        default=LOAN_STATUS.Maintenance[0],
        help_text="Book availability",
    )

    borrower = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )

    def is_overdue(self):
        return bool(self.due_back and self.due_back < datetime.date.today())

    def __str__(self):
        """String for representing the Model object."""
        return f"{self.id} ({self.book.title if self.book is not None else "no title"})"

    class Meta:
        ordering = ["due_back"]
        permissions = (("can_mark_returned", "Set book as returned"),)


class Author(models.Model):
    """Model representing an author."""

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField(null=True, blank=True)
    date_of_death = models.DateField("died", null=True, blank=True)

    class Meta:
        ordering = ["last_name", "first_name"]

    def get_absolute_url(self):
        """Returns the URL to access a particular author instance."""
        return reverse("catalog:author_detail", args=[str(self.id)])  # type: ignore

    def __str__(self):
        """String for representing the Model object."""
        return f"{self.last_name}, {self.first_name}"


class Language(models.Model):
    """Model representing a Language (e.g. English, French, Japanese, etc.)"""

    name = models.CharField(
        max_length=200,
        unique=True,
        help_text="Enter the book's natural language (e.g. English, French, Japanese etc.)",
    )

    def get_absolute_url(self):
        """Returns the url to access a particular language instance."""
        return reverse("catalog:language_detail", args=[str(self.id)])  # type: ignore

    def __str__(self):
        """String for representing the Model object (in Admin site etc.)"""
        return self.name
