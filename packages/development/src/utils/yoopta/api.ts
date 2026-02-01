export const fetchUsers = async (query: string): Promise<any[]> => {
  try {
    const url = new URL('http://localhost:3001/users');

    if (query) {
      url.searchParams.set('q', query);
    }

    url.searchParams.set('_limit', '10');

    const response = await fetch(url.toString());
    const users: any[] = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};
