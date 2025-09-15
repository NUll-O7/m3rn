const API_URL = 'http://localhost:5000/notes';

export async function fetchNotes({ tag, userId }) {
  const params = new URLSearchParams();
  if (tag) params.append('tag', tag);
  if (userId) params.append('userId', userId);
  const res = await fetch(`${API_URL}?${params}`);
  return res.json();
}

export async function createNote(note) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note)
  });
  return res.json();
}

export async function updateNote(id, note) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note)
  });
  return res.json();
}

export async function deleteNote(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
}