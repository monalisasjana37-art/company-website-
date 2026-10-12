/* Monalisa Electro Make: front-end behaviour
   - Mobile nav toggle
   - Renders the product catalog and product detail pages from products-data.js
   - Product Quote and Project Enquiry forms post to /api/leads
   - Campaign attribution (UTM, gclid, referrer) travels with each lead
*/
(() => {
    'use strict';

    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const pageLoadedAt = Date.now();

    /* ---------- Analytics hook (Google Tag Manager dataLayer) ---------- */
    function track(event, data) {
        try {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push(Object.assign({ event }, data || {}));
        } catch (_) { /* tracking must never break the page */ }
    }
    $$('[data-track]').forEach((el) => el.addEventListener('click', () => track(el.dataset.track)));

    /* ---------- Mobile nav ---------- */
    const navToggle = $('.nav-toggle');
    const siteNav = $('.site-nav');
    if (navToggle && siteNav) {
        navToggle.addEventListener('click', () => {
            const open = siteNav.getAttribute('data-open') === 'true';
            siteNav.setAttribute('data-open', String(!open));
            navToggle.setAttribute('aria-expanded', String(!open));
        });
    }

    /* ---------- Footer year ---------- */
    const year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());

    /* ---------- Campaign attribution ---------- */
    function getAttribution() {
        try {
            const saved = JSON.parse(sessionStorage.getItem('mem_attribution') || 'null');
            if (saved) return saved;
        } catch (_) { /* ignore */ }
        const params = new URLSearchParams(window.location.search);
        const attribution = {};
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'].forEach((key) => {
            const value = params.get(key);
            if (value) attribution[key] = value.slice(0, 120);
        });
        attribution.referrer = (document.referrer || '').slice(0, 200);
        attribution.landing = window.location.pathname;
        try { sessionStorage.setItem('mem_attribution', JSON.stringify(attribution)); } catch (_) { /* ignore */ }
        return attribution;
    }
    const attribution = getAttribution();

    /* ---------- Product catalog (products.html) ---------- */
    const grid = $('#product-grid');
    if (grid && window.PRODUCTS) {
        grid.innerHTML = window.PRODUCTS.map((p) => `
      <a class="product-card" href="product.html?id=${encodeURIComponent(p.id)}">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" class="product-card__img">` : `<span class="swatch" aria-hidden="true">${p.initials}</span>`}
        <span class="product-card__body">
          <span class="product-card__cat">${p.category}</span>
          <h3>${p.name}</h3>
          <p>${p.tagline}</p>
        </span>
      </a>
    `).join('');
    }

    /* ---------- Product detail (product.html) ---------- */
    const detailRoot = $('#product-detail');
    if (detailRoot && window.PRODUCTS) {
        const id = new URLSearchParams(window.location.search).get('id');
        const product = window.PRODUCTS.find((p) => p.id === id);

        if (!product) {
            detailRoot.innerHTML = `
        <p>We could not find that product.</p>
        <p><a class="btn btn--ink" href="products.html">Back to all products</a></p>
      `;
        } else {
            document.title = product.name + ' | Monalisa Electro Make';
            const specRows = product.specs.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('');
            detailRoot.innerHTML = `
        <p class="breadcrumb"><a href="products.html">Products</a> / ${product.category}</p>
        <div class="product-hero">
          ${product.image ? `<img src="${product.image}" alt="${product.name}" class="product-hero__img">` : `<span class="swatch" aria-hidden="true">${product.initials}</span>`}
          <div>
            <h1>${product.name}</h1>
            <p class="product-hero__tagline">${product.tagline}</p>
            <p>${product.description}</p>
            <table class="spec-table">
              <caption class="sr-only">Specifications</caption>
              <tbody>${specRows}</tbody>
            </table>
            <a class="btn btn--volt" href="contact.html?product=${encodeURIComponent(product.name)}">Request a quote for this product</a>
          </div>
        </div>
      `;
        }
    }

    /* ---------- Validation helpers ---------- */
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function validatePhoneName(values) {
        const errors = {};
        if (values.name.trim().length < 2) errors.name = 'Enter your name.';
        const digits = values.phone.replace(/\D/g, '');
        if (digits.length < 7 || digits.length > 15) errors.phone = 'Enter a phone number we can call.';
        if (values.email && !EMAIL_RE.test(values.email.trim())) errors.email = 'Enter a valid email address.';
        return errors;
    }

    function clearErrors(form) {
        $$('.field__error', form).forEach((p) => { p.textContent = ''; });
        $$('[aria-invalid]', form).forEach((el) => el.removeAttribute('aria-invalid'));
    }

    function showErrors(form, errors) {
        let first = null;
        Object.keys(errors).forEach((name) => {
            const input = form.elements[name];
            if (!input) return;
            input.setAttribute('aria-invalid', 'true');
            const msg = $('#' + input.id + '-error');
            if (msg) msg.textContent = errors[name];
            if (!first) first = input;
        });
        if (first) first.focus();
    }

    function setStatus(el, message, state) {
        el.textContent = message || '';
        if (state) el.dataset.state = state; else delete el.dataset.state;
    }

    async function postLead(payload) {
        const response = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        let data = {};
        try { data = await response.json(); } catch (_) { /* non-JSON error */ }
        if (!response.ok) {
            const err = new Error(data.error || 'Request failed');
            err.fields = data.fields || null;
            throw err;
        }
        return data;
    }

    function wireForm(config) {
        const form = $(config.form);
        if (!form) return;
        const submit = $(config.submit);
        const status = $(config.status);
        const success = $(config.success);

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            clearErrors(form);
            setStatus(status, '');

            const values = {
                name: form.elements.name.value,
                phone: form.elements.phone.value,
                email: form.elements.email ? form.elements.email.value : '',
            };
            const errors = validatePhoneName(values);
            if (Object.keys(errors).length) {
                showErrors(form, errors);
                setStatus(status, 'Check the highlighted fields and try again.', 'error');
                return;
            }

            const payload = config.buildPayload(form);
            payload.type = config.type;
            payload.website = form.elements.website.value; // honeypot
            payload.elapsedMs = Date.now() - pageLoadedAt;
            payload.attribution = attribution;

            submit.disabled = true;
            setStatus(status, 'Sending...');

            try {
                const result = await postLead(payload);
                track('lead_submitted', { lead_type: config.type });
                config.onSuccess(result, payload);
                form.hidden = true;
                success.hidden = false;
                success.focus();
            } catch (err) {
                if (err.fields) showErrors(form, err.fields);
                setStatus(
                    status,
                    err.fields ? 'Check the highlighted fields and try again.' : 'We could not send your request. Please try again or call us.',
                    'error'
                );
                submit.disabled = false;
            }
        });
    }

    /* Product Quote form */
    wireForm({
        type: 'product-quote',
        form: '#product-quote-form',
        submit: '#product-quote-submit',
        status: '#product-quote-status',
        success: '#product-quote-success',
        buildPayload(form) {
            return {
                name: form.elements.name.value,
                company: form.elements.company.value,
                email: form.elements.email.value,
                phone: form.elements.phone.value,
                productCategory: form.elements.productCategory.value,
                productName: form.elements.productName.value,
                quantity: form.elements.quantity.value,
                specification: form.elements.specification.value,
            };
        },
        onSuccess(result) {
            $('#product-quote-success-text').textContent = 'Our team will send you a quote by email or phone within one business day.';
            $('#product-quote-success-ref').textContent = result.id ? 'Reference: ' + result.id : '';
        },
    });

    /* Project Enquiry form */
    wireForm({
        type: 'project',
        form: '#project-form',
        submit: '#project-submit',
        status: '#project-status',
        success: '#project-success',
        buildPayload(form) {
            return {
                name: form.elements.name.value,
                company: form.elements.company.value,
                email: form.elements.email.value,
                phone: form.elements.phone.value,
                siteLocation: form.elements.siteLocation.value,
                projectType: form.elements.projectType.value,
                scope: form.elements.scope.value,
                timeline: form.elements.timeline.value,
            };
        },
        onSuccess(result) {
            $('#project-success-text').textContent = 'A project lead will contact you within one business day to arrange a site visit.';
            $('#project-success-ref').textContent = result.id ? 'Reference: ' + result.id : '';
        },
    });

    /* Pre-fill product name on the contact page when arriving from a product page */
    const productNameField = $('#product-quote-form #pq-productName');
    if (productNameField) {
        const fromProduct = new URLSearchParams(window.location.search).get('product');
        if (fromProduct) productNameField.value = fromProduct;
    }
})();
