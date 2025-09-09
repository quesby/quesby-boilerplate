const MiniSearch = window.MiniSearch

const $q = document.getElementById('q')
const $list = document.getElementById('results')

let mini

async function load() {
  try {
    const docs = await fetch('/search.json', { cache: 'no-store' }).then(r => r.json())
    mini = new MiniSearch({
      fields: ['title','content','tags'],
      storeFields: ['title','url','excerpt','tags'],
      searchOptions: { fuzzy: 0.2, prefix: true, boost: { title: 4, tags: 2 } }
    })
    mini.addAll(docs)
    console.log(`✅ Search index loaded with ${docs.length} documents`)
  } catch (error) {
    console.error('❌ Error loading search index:', error)
    $list.innerHTML = '<li>Error loading search. Please refresh the page.</li>'
  }
}

function render(items) {
  if (items.length === 0) {
    $list.innerHTML = '<li>No results found</li>'
    return
  }
  
  $list.innerHTML = items.slice(0, 20).map(it => {
    const tags = it.tags && it.tags.length > 0 
      ? `<span class="search-tags">${it.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</span>`
      : ''
    
    return `
      <li class="search-result">
        <a href="${it.url}" class="search-title">${escapeHtml(it.title)}</a>
        <p class="search-excerpt">${escapeHtml(it.excerpt || '')}</p>
        ${tags}
      </li>
    `
  }).join('')
}

function escapeHtml(s=''){return s.replace(/[&<>"']/g,m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]))}

let searchTimeout

$q.addEventListener('input', e => {
  clearTimeout(searchTimeout)
  const q = e.target.value.trim()
  
  if (!q) { 
    $list.innerHTML = ''
    return 
  }
  
  searchTimeout = setTimeout(() => {
    const res = mini.search(q, { combineWith: 'AND' })
    render(res.map(r => ({ ...r, ...r })))
  }, 150)
})

load()
