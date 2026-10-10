if (!customElements.get('delivery-estimate')) {
  customElements.define('delivery-estimate', class extends HTMLElement {
    connectedCallback() {
      this.updateDates();
      this.timer = setInterval(() => this.updateDates(), 60000);
    }

    disconnectedCallback() {
      clearInterval(this.timer);
    }

    updateDates() {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata', year: 'numeric', month: 'numeric', day: 'numeric',
      }).formatToParts(new Date());
      const value = (type) => Number(parts.find((part) => part.type === type).value);
      const today = Date.UTC(value('year'), value('month') - 1, value('day'));
      const min = Math.max(0, Number(this.dataset.minDays) || 0);
      const max = Math.max(min, Number(this.dataset.maxDays) || 0);
      const start = new Date(today + min * 86400000);
      const end = new Date(today + max * 86400000);
      const format = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'UTC', day: 'numeric', month: 'long',
        ...(start.getUTCFullYear() !== end.getUTCFullYear() ? { year: 'numeric' } : {}),
      });
      this.querySelector('[data-delivery-dates]').textContent = `${format.format(start)} – ${format.format(end)}`;
      this.hidden = false;
    }
  });
}
