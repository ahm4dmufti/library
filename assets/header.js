fetch("includes/header.html")
  .then(r => r.ok ? r.text() : Promise.reject("Header not found"))
  .then(html => {
    document.getElementById("header").innerHTML = html;
    const yEl = document.getElementById("year");
    if (yEl) yEl.textContent = new Date().getFullYear();

    // Account area rendering: show avatar when signed in, or 'Not signed in' + Register when not.
    const accountArea = document.getElementById('account-area');
    const accountGreeting = document.getElementById('account-greeting');
    const accountAction = document.getElementById('account-action');
    const accountAvatar = document.getElementById('account-avatar');

    function safeGet(key){ try{ return localStorage.getItem(key); }catch(e){ return null } }
    function safeRemove(key){ try{ localStorage.removeItem(key); }catch(e){} }

    function renderAccount(){
      if (!accountArea) return;
      const user = safeGet('currentUser');
      // Clear any existing onclick to avoid duplicates
      if (accountAction) accountAction.onclick = null;

      if (user) {
        // show avatar (initials) and hide plain greeting text
        if (accountAvatar) {
          accountAvatar.textContent = String(user).charAt(0).toUpperCase();
          accountAvatar.classList.remove('d-none');
        }
        if (accountGreeting) accountGreeting.textContent = user;

        if (accountAction) {
          accountAction.textContent = 'Logout';
          accountAction.className = 'btn btn-sm btn-outline-danger';
          accountAction.href = '#';
          accountAction.onclick = function(e){ e.preventDefault(); safeRemove('currentUser'); try{ location.reload(); }catch(_){} };
        }
      } else {
        // not signed in: hide avatar, show 'Not signed in' and register link
        if (accountAvatar) accountAvatar.classList.add('d-none');
        if (accountGreeting) accountGreeting.textContent = 'Not signed in';
        if (accountAction) {
          accountAction.textContent = 'Register';
          accountAction.className = 'btn btn-sm btn-outline-primary';
          accountAction.href = 'register.html';
        }
      }
    }

    // initial render
    renderAccount();

    // update if storage changes in other tabs/windows
    window.addEventListener('storage', renderAccount);
  })
