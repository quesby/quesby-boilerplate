## How to add a route

In order to add a route you need to follow these 3 simple steps:
1. create a Nunjucks template in the /src folder
2. add the route in eleventy.config.js
3. add the navigation item

That's it!

### An example 
Let's suppose we want to add a new page called "Greetings".
We'll create the template /src/greetings.njk.
Then we'll add the following code in eleventy.config.js in the **// Routes** section before return data.permalink;
```js
if (input.includes("/content/greetings/")) {
    // Usa lo slug dal frontmatter, altrimenti fallback su fileSlug
    const slug = data.slug || data.page.fileSlug;
    return `/greetings/${slug}/`;
}
