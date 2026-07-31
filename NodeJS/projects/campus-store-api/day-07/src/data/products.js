export const products = [
  { id: 1, title: 'Notebook', price: 4.5, description: 'A ruled notebook' },
  { id: 2, title: 'Campus Hoodie', price: 28, description: 'A warm campus hoodie' },
];

let nextId = 3;

export function createProductId() {
  const id = nextId;
  nextId += 1;
  return id;
}
