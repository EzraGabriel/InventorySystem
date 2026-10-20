export const formatDate = (date = new Date()) =>
  new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);

export const formatDateTime = (date, options = {}) =>
  new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', ...options }).format(new Date(date));
