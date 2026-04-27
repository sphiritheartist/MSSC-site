document.addEventListener('DOMContentLoaded', () => {
  const loginArea = document.getElementById('login-area');
  const dashboardArea = document.getElementById('dashboard-area');
  const logoutBtn = document.getElementById('logout-btn');

  // Check auth
  fetch('/api/check-auth')
    .then(res => res.json())
    .then(data => {
      if (data.isAuthenticated) {
        showDashboard();
      }
    });

  // Login
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    }).then(res => res.json())
      .then(data => {
        if (data.success) {
          showDashboard();
        } else {
          document.getElementById('login-error').style.display = 'block';
        }
      });
  });

  // Logout
  logoutBtn.addEventListener('click', () => {
    fetch('/api/logout', { method: 'POST' }).then(() => {
      loginArea.style.display = 'block';
      dashboardArea.style.display = 'none';
      logoutBtn.style.display = 'none';
      document.getElementById('admin-password').value = '';
    });
  });

  // Tabs
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });

  function showDashboard() {
    loginArea.style.display = 'none';
    dashboardArea.style.display = 'block';
    logoutBtn.style.display = 'block';
    loadAnalytics();
    loadProducts();
    loadMessages();
  }

  // Analytics
  function loadAnalytics() {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => {
        const body = document.getElementById('analytics-body');
        body.innerHTML = '';
        data.forEach(row => {
          body.innerHTML += `
            <tr>
              <td style="text-transform: capitalize;">${row.event_type}</td>
              <td>${row.page}</td>
              <td><strong>${row.count}</strong></td>
            </tr>
          `;
        });
      });
  }

  // Products
  function loadProducts() {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        window.allProducts = data;
        const body = document.getElementById('products-body');
        body.innerHTML = '';
        const typesSet = new Set();
        data.forEach(prod => {
          if (prod.type) typesSet.add(prod.type);
          const imgHtml = prod.image_url ? `<img src="/${prod.image_url}" width="60" style="border-radius:4px;">` : 'No Image';
          body.innerHTML += `
            <tr>
              <td>${imgHtml}</td>
              <td><strong>${prod.title}</strong><br><small style="color:#64748b">${prod.type || 'Other'}</small></td>
              <td><small>${prod.colour} • ${prod.material}</small></td>
              <td>${prod.price || '-'}</td>
              <td>
                <i class="fas fa-edit" style="color:var(--primary); cursor:pointer; margin-right: 1rem;" onclick="openEditModal(${prod.id})"></i>
                <i class="fas fa-trash delete-btn" onclick="deleteProduct(${prod.id})"></i>
              </td>
            </tr>
          `;
        });
        
        // Populate datalists
        const optionsHtml = Array.from(typesSet).map(t => `<option value="${t}">`).join('');
        const typeOptions = document.getElementById('type-options');
        const editTypeOptions = document.getElementById('edit-type-options');
        if (typeOptions) typeOptions.innerHTML = optionsHtml;
        if (editTypeOptions) editTypeOptions.innerHTML = optionsHtml;
      });
  }

  // Upload Product
  document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    fetch('/api/products', {
      method: 'POST',
      body: formData
    }).then(res => res.json())
      .then(data => {
        if(data.error) alert('Error: ' + data.error);
        else {
          alert('Product uploaded successfully!');
          e.target.reset();
          loadProducts();
        }
      });
  });

  // Edit Product
  window.openEditModal = function(id) {
    const prod = window.allProducts.find(p => p.id === id);
    if (!prod) return;
    document.getElementById('edit-id').value = prod.id;
    document.getElementById('edit-title').value = prod.title;
    document.getElementById('edit-type').value = prod.type || 'Other';
    document.getElementById('edit-price').value = prod.price || '';
    document.getElementById('edit-colour').value = prod.colour || '';
    document.getElementById('edit-material').value = prod.material || '';
    document.getElementById('edit-description').value = prod.description || '';
    document.getElementById('edit-modal').style.display = 'flex';
  };

  document.getElementById('edit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = document.getElementById('edit-id').value;
    fetch(`/api/products/${id}`, {
      method: 'PUT',
      body: formData
    }).then(res => res.json())
      .then(data => {
        if(data.error) alert('Error: ' + data.error);
        else {
          alert('Product updated successfully!');
          document.getElementById('edit-modal').style.display = 'none';
          loadProducts();
        }
      });
  });

  window.deleteProduct = function(id) {
    if(confirm('Are you sure you want to delete this product?')) {
      fetch(`/api/products/${id}`, { method: 'DELETE' })
        .then(() => loadProducts());
    }
  };

  // Messages
  function loadMessages() {
    fetch('/api/messages')
      .then(res => res.json())
      .then(data => {
        const body = document.getElementById('messages-body');
        body.innerHTML = '';
        data.forEach(msg => {
          const date = new Date(msg.created_at).toLocaleString();
          body.innerHTML += `
            <tr>
              <td><small>${date}</small></td>
              <td><strong>${msg.name}</strong></td>
              <td><a href="mailto:${msg.email}">${msg.email}</a></td>
              <td>${msg.message}</td>
            </tr>
          `;
        });
      });
  }
});
