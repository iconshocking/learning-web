self.addEventListener("install", (e) => {
  console.log("Installed");
});

// fetch fires for any HTTP request made by the page, regardless of the API used - .fetch()/XMLHTTPRequest/etc.
self.addEventListener("fetch", (e) => {
  if (e.request.url.endsWith("non-existent")) {
    e.request.text().then((formData) => {
      console.log(formData);
    });
    // default form submission is a navigation request (can only be prevented via event.preventDefault() on the submit input/button)
    e.respondWith(
      Response.redirect(
        "http://localhost:8000/pages/forms/first-form.html",
        302,
      ),
    );
  }
});
