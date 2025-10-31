export function registerTaxonomies(eleventyConfig) {
  const getSlugify = () => eleventyConfig.getFilter("slugify");
  const safeAddCollection = (name, fn) => {
    try {
      eleventyConfig.addCollection(name, fn);
    } catch (err) {
      const msg = String(err && err.message || err);
      if (msg.includes(`addCollection(${name}) already exists`)) {
        console.log(`[ℹ️] Collection '${name}' already exists. Skipping re-definition.`);
        return;
      }
      throw err;
    }
  };

  // Tags ------------------------------------------------------------
  const TAGS_EXCLUDE = new Set(["all", "nav", "post", "posts"]);

  safeAddCollection("tagList", (collectionApi) => {
    const slugify = getSlugify();
    const map = new Map(); // slug -> display name
    collectionApi.getAll().forEach((item) => {
      const t = item.data?.tags;
      if (!t) return;
      (Array.isArray(t) ? t : [t]).forEach((tag) => {
        const name = String(tag || "").trim();
        if (!name || TAGS_EXCLUDE.has(name)) return;
        const slug = slugify(name);
        if (!slug) return;
        if (!map.has(slug)) map.set(slug, name);
      });
    });
    return Array.from(map, ([slug, name]) => ({ slug, name }));
  });

  safeAddCollection("postsByTagSlug", (collectionApi) => {
    const slugify = getSlugify();
    const map = new Map(); // slug -> posts[]
    collectionApi.getAll().forEach((item) => {
      const t = item.data?.tags;
      if (!t) return;
      (Array.isArray(t) ? t : [t]).forEach((tag) => {
        const name = String(tag || "").trim();
        if (!name || TAGS_EXCLUDE.has(name)) return;
        const slug = slugify(name);
        if (!slug) return;
        if (!map.has(slug)) map.set(slug, []);
        map.get(slug).push(item);
      });
    });
    return Object.fromEntries(map);
  });

  // Categories ------------------------------------------------------------
  safeAddCollection("categoryList", (collectionApi) => {
    const slugify = getSlugify();
    const map = new Map(); // slug -> display name
    collectionApi.getAll().forEach((item) => {
      const raw = item.data?.category ?? item.data?.categories;
      if (!raw) return;
      (Array.isArray(raw) ? raw : [raw]).forEach((cat) => {
        const name = String(cat || "").trim();
        if (!name) return;
        const slug = slugify(name);
        if (!slug) return;
        if (!map.has(slug)) map.set(slug, name);
      });
    });
    return Array.from(map, ([slug, name]) => ({ slug, name }));
  });

  safeAddCollection("postsByCategorySlug", (collectionApi) => {
    const slugify = getSlugify();
    const map = new Map(); // slug -> posts[]
    collectionApi.getAll().forEach((item) => {
      const raw = item.data?.category ?? item.data?.categories;
      if (!raw) return;
      (Array.isArray(raw) ? raw : [raw]).forEach((cat) => {
        const name = String(cat || "").trim();
        if (!name) return;
        const slug = slugify(name);
        if (!slug) return;
        if (!map.has(slug)) map.set(slug, []);
        map.get(slug).push(item);
      });
    });
    return Object.fromEntries(map);
  });

  // Project types ------------------------------------------------------------
safeAddCollection("projecttypeList", (collectionApi) => {
    const slugify = getSlugify();
    const map = new Map(); // slug -> display name
    collectionApi.getAll().forEach((item) => {
      const raw = item.data?.projecttype;
      if (!raw) return;
      (Array.isArray(raw) ? raw : [raw]).forEach((pt) => {
        const name = String(pt || "").trim();
        if (!name) return;
        const slug = slugify(name);
        if (!slug) return;
        if (!map.has(slug)) map.set(slug, name);
      });
    });
    return Array.from(map, ([slug, name]) => ({ slug, name }));
  });
  
  safeAddCollection("projectsByProjecttypeSlug", (collectionApi) => {
    const slugify = getSlugify();
    const map = new Map(); // slug -> items[]
    collectionApi.getAll().forEach((item) => {
      const raw = item.data?.projecttype;
      if (!raw) return;
      (Array.isArray(raw) ? raw : [raw]).forEach((pt) => {
        const name = String(pt || "").trim();
        if (!name) return;
        const slug = slugify(name);
        if (!slug) return;
        if (!map.has(slug)) map.set(slug, []);
        map.get(slug).push(item);
      });
    });
    return Object.fromEntries(map);
  });

  // Filters ------------------------------------------------------------
  eleventyConfig.addFilter("categoryListFrom", (items = []) => {
    const slugify = getSlugify();
    const map = new Map(); // slug -> display name
    items.forEach((item) => {
      const raw = item.data?.category ?? item.data?.categories;
      if (!raw) return;
      (Array.isArray(raw) ? raw : [raw]).forEach((cat) => {
        const name = String(cat || "").trim();
        if (!name) return;
        const slug = slugify(name);
        if (!slug) return;
        if (!map.has(slug)) map.set(slug, name);
      });
    });
    return Array.from(map, ([slug, name]) => ({ slug, name }));
  });

  eleventyConfig.addFilter("tagListFrom", (items = []) => {
    const slugify = getSlugify();
    const exclude = new Set(["all", "nav", "post", "posts"]);
    const map = new Map(); // slug -> display name
    items.forEach((item) => {
      const raw = item.data?.tags;
      if (!raw) return;
      (Array.isArray(raw) ? raw : [raw]).forEach((tag) => {
        const name = String(tag || "").trim();
        if (!name || exclude.has(name)) return;
        const slug = slugify(name);
        if (!slug) return;
        if (!map.has(slug)) map.set(slug, name);
      });
    });
    return Array.from(map, ([slug, name]) => ({ slug, name }));
  });

    eleventyConfig.addFilter("projecttypeListFrom", (items = []) => {
        const slugify = getSlugify();
        const map = new Map(); // slug -> display name
        items.forEach((item) => {
        const raw = item.data?.projecttype;
        if (!raw) return;
        (Array.isArray(raw) ? raw : [raw]).forEach((pt) => {
            const name = String(pt || "").trim();
            if (!name) return;
            const slug = slugify(name);
            if (!slug) return;
            if (!map.has(slug)) map.set(slug, name);
        });
        });
        return Array.from(map, ([slug, name]) => ({ slug, name }));
    });

  // Generic taxonomy filter (optional utility)
  eleventyConfig.addFilter("taxonomyListFrom", (items = [], field, { exclude = [] } = {}) => {
    const slugify = getSlugify();
    const ex = new Set(exclude || []);
    const map = new Map(); // slug -> display name
    items.forEach((item) => {
      const raw = item.data?.[field];
      if (!raw) return;
      (Array.isArray(raw) ? raw : [raw]).forEach((val) => {
        const name = String(val || "").trim();
        if (!name || ex.has(name)) return;
        const slug = slugify(name);
        if (!slug) return;
        if (!map.has(slug)) map.set(slug, name);
      });
    });
    return Array.from(map, ([slug, name]) => ({ slug, name }));
  });

  // Shortcodes ------------------------------------------------------------
  eleventyConfig.addShortcode("allTags", function (collections, separator = ", ") {
    const list = collections?.tagList || [];
    return list.map((t) => t.name).join(separator);
  });

  eleventyConfig.addShortcode("allCategories", function (collections, separator = ", ") {
    const list = collections?.categoryList || [];
    return list.map((c) => c.name).join(separator);
  });
}

